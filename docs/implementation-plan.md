Here is the full plan for your USDC checkout store on Arc Testnet:

---

## Implementation Plan: Arc USDC Checkout Store

### Summary
A product storefront where customers browse items, add them to a cart, and pay with USDC via their browser wallet. Includes a live USDC balance display, per-order QR payment links, and a transaction history panel — all running on Arc Testnet.

### Architecture
- **Blockchain:** Arc Testnet — USDC is the native gas token, so customers pay for goods and gas in a single asset with sub-second finality
- **Contract:** No custom contract needed — payments are direct USDC ERC-20 transfers to the merchant address (`0x3600...0000` on Arc)
- **Frontend:** Vite + React + TypeScript, Tailwind CSS, wagmi v2, ConnectKit
- **Wallet:** ConnectKit — supports MetaMask, Coinbase Wallet, and any injected browser wallet

### Files to Create / Modify

1. `src/config.ts` — add Arc Testnet chain config, USDC address, and merchant address constant
2. `src/data/products.ts` — static product catalog (name, price in USDC, image placeholder, description)
3. `src/hooks/useUsdcBalance.ts` — wagmi `useReadContract` hook reading USDC `balanceOf` (6 decimals, ERC-20 view only)
4. `src/hooks/useUsdcPayment.ts` — `useWriteContract` + `useWaitForTransactionReceipt` for USDC `transfer` to merchant; enforces Arc Testnet chain check before submission
5. `src/hooks/useTxHistory.ts` — stores completed payment receipts in `localStorage` (hash, item, amount, timestamp)
6. `src/components/Header.tsx` — top bar with app name, ConnectKit wallet button, and live USDC balance chip
7. `src/components/ProductCard.tsx` — product tile with name, price, and "Buy Now" primary CTA
8. `src/components/ProductGrid.tsx` — responsive grid of `ProductCard` components
9. `src/components/Cart.tsx` — slide-in cart sheet; shows items, total, and "Pay with USDC" button
10. `src/components/PaymentSheet.tsx` — bottom sheet: confirms order total, triggers USDC transfer, shows confirming → success / error states with explorer link
11. `src/components/QRModal.tsx` — generates a shareable payment URL (`?to=<merchant>&amount=<total>&memo=<items>`) and renders a QR code via `qrcode.react`
12. `src/components/TxHistory.tsx` — collapsible panel listing past purchases with hash, amount, and explorer links
13. `src/components/FaucetBanner.tsx` — dismissible banner linking to `faucet.circle.com` when balance is zero
14. `src/App.tsx` — root layout: `Header`, `ProductGrid`, `Cart`, `TxHistory`, all wrapped in existing `Web3Provider`

### Build Sequence

1. Extend `src/config.ts` with chain, USDC address, and merchant wallet constant
2. Create `src/data/products.ts` with a small catalog (4–6 testnet-priced items, $0.10–$1.00)
3. Build `useUsdcBalance`, `useUsdcPayment`, and `useTxHistory` hooks
4. Build `Header` with ConnectKit button and live balance
5. Build `ProductCard` + `ProductGrid`
6. Build `Cart` sheet with line items and total
7. Build `PaymentSheet` with full transaction lifecycle (idle → signing → confirming → success/error)
8. Build `QRModal` using `qrcode.react`
9. Build `TxHistory` panel reading from `localStorage`
10. Add `FaucetBanner` for zero-balance wallets
11. Wire everything in `src/App.tsx`

### Done When
- [ ] Wallet connects via ConnectKit on Arc Testnet
- [ ] USDC balance displays live in the header and refreshes after payment
- [ ] Products render in a grid; clicking "Buy Now" opens the cart or payment sheet
- [ ] Payment triggers a real USDC transfer on Arc Testnet with correct 6-decimal encoding
- [ ] Confirming state shown while tx is pending; success shows explorer link
- [ ] Wrong-chain warning shown if wallet is not on Arc Testnet
- [ ] QR code modal generates a valid shareable payment URL
- [ ] Transaction history persists across page reloads
- [ ] Faucet banner appears when USDC balance is zero

---

## Ready to build?

Switch to **Build mode** (use the mode selector) and approve — the build agent will implement this end to end and give you a live preview you can try with MetaMask or Coinbase Wallet. You'll need a small amount of testnet USDC from [faucet.circle.com](https://faucet.circle.com) to make a real payment. Plan saved to `arc-studio-plans/PLAN.md`.

Switch to **Build mode** using the mode selector at the top, then approve the plan to kick off the build. The agent will wire up the full store end to end and give you a live preview. Before making your first real payment, grab testnet USDC from [faucet.circle.com](https://faucet.circle.com).
