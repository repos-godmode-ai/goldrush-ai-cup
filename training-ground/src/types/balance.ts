/** One row from GoldRush `balances_v2` items (subset of fields we use). */
export type BalancePlayer = {
  contract_ticker_symbol?: string;
  contract_name?: string;
  contract_address?: string;
  logo_url?: string;
  quote?: number;
  quote_24h?: number;
  pretty_quote?: string;
  type?: string;
  native_token?: boolean;
};
