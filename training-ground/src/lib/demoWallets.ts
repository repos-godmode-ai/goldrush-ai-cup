/**
 * Curated wallets for live demos — public addresses only.
 * Data still comes from GoldRush; a valid API key is required.
 */
export type DemoWallet = {
  id: string;
  label: string;
  chain: string;
  address: string;
  blurb: string;
};

export const DEMO_WALLETS: DemoWallet[] = [
  {
    id: "vitalik-eth",
    label: "Vitalik · Ethereum",
    chain: "eth-mainnet",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    blurb: "High-activity L1 wallet — rich roster + history.",
  },
  {
    id: "vitalik-base",
    label: "Vitalik · Base",
    chain: "base-mainnet",
    address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    blurb: "Same address on Base — good L2 story.",
  },
  {
    id: "binance-hot",
    label: "Binance 14 · Ethereum",
    chain: "eth-mainnet",
    address: "0x28C6c06298d514Db089934071355E5743bf21d60",
    blurb: "High-volume hot wallet — great for roster density.",
  },
];
