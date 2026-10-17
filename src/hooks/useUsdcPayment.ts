import { useWriteContract, useWaitForTransactionReceipt, useAccount, useSwitchChain } from 'wagmi'
import { getUsdc } from '@/onchain-facts'
import { parseUnitsExact } from '@/onchain-money'
import { USDC_DECIMALS } from '@/onchain-facts'
import { arcTestnet } from 'viem/chains'

const USDC_TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

// Merchant address — replace with your own wallet to receive payments
export const MERCHANT_ADDRESS = '0x5B12Ce46C7194aD57d143bC22847224047b1Ef42' as const

export function useUsdcPayment() {
  const { chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const usdc = getUsdc(arcTestnet.id)

  const {
    writeContractAsync,
    data: hash,
    isPending: isWritePending,
    reset,
    error: writeError,
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash })

  const pay = async (totalUsdc: string) => {
    if (!usdc) throw new Error('USDC not found for Arc Testnet')

    // Switch to Arc Testnet if needed
    if (chainId !== arcTestnet.id) {
      await switchChainAsync({ chainId: arcTestnet.id })
    }

    const amountRaw = parseUnitsExact(totalUsdc, USDC_DECIMALS)

    return writeContractAsync({
      address: usdc.address as `0x${string}`,
      abi: USDC_TRANSFER_ABI,
      functionName: 'transfer',
      args: [MERCHANT_ADDRESS, amountRaw],
      chainId: arcTestnet.id,
    })
  }

  return {
    pay,
    hash,
    isWritePending,
    isConfirming,
    isSuccess,
    error: writeError ?? receiptError,
    reset,
    isWrongChain: !!chainId && chainId !== arcTestnet.id,
  }
}
