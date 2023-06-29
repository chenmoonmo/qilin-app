import type { Address } from 'wagmi';

export type ChainInfo = {
  chain_id: number;
  chain_name: string;
  block_height: number;
  native_currency_name: string;
  native_currency_symbol: string;
  native_currency_decimal: number;
  rpc_urls: string[] | null;
  explorer_url: string;
  weth_address: string;
};

export type AssetInfo = {
  asset: Address;
  liquidity: string;
  lp_amount: string;
  lp_token: Address;
  pool_decimal: number;
  pool_name: string;
  pool_token: Address;
};

export type PoolInfo = {
  name: string;
  oracle: Address;
  pool: Address;
  rate: Address;
  reserve: boolean;
};

export type PoolItem = {
  ID: number;
  future_chang_24: string;
  future_price: string;
  volumn_24: string;
  asset_info: AssetInfo;
  pool_info: PoolInfo;
};

export type Pool = {
  funding_8: string;
  nake_position: string;
  spot_price: string;
  pair_info: PoolItem;
  size_info: {
    position_long: string;
    position_short: string;
    size_long: string;
    size_short: string;
  };
  setting: {
    asset_level: number;
    fee_ratio: number;
    legal_level: number[];
    liq_ratio: number;
    margin_ratio: number;
    price_threshold: number;
    rebase_block: number;
    rebase_ratio: number;
  };
};
