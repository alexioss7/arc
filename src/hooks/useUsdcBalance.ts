import { useReadContract, useAccount } from 'wagmi'
import { getUsdc } from '@/onchain-facts'
import { formatUsdc } from '@/onchain-money'
import { arcTestnet } from 'viem/chains'

const USDC_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export function useUsdcBalance() {
  const { address } = useAccount()
  const usdc = getUsdc(arcTestnet.id)

  const { data, isLoading, refetch } = useReadContract({
    address: usdc?.address as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!usdc,
      refetchInterval: 10_000,
    },
  })

  const formatted = data !== undefined ? formatUsdc(data) : undefined

  return { raw: data, formatted, isLoading, refetch }
}
