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

export type PositionItem = {
  pool_name: string;
  pool_token: Address;
  asset_address: Address;
  funding_fee: string;
  leverage: number;
  margin: string;
  margin_ratio: number;
  open_price: string;
  open_time: string;
  pnl: string;
  pool_address: string;
  position_id: number;
  service_fee: string;
  side: string;
  size: string;
  symbol: string;
};

export type HistoryPositionItem = {
  ActionTime: number;
  Direction: number;
  FundingFee: string;
  Margin: string;
  PNL: string;
  PositionId: number;
  Price: string;
  ServicesFee: string;
  Status: string;
  TokenID: number;
  asset_address: string;
  pool_address: string;
  pool_name: string;
  symbol: string;
};

export type PoolParam = {
  asset_address: string;
  pool_address: string;
  fee_ratio: number; // 4位精度
  leverage_rate: number; // 4位精度
  margin_ratio: number; // 4位精度
  liquidity: string; // 和代币一样的精度
  lp_price: string; // 18位精度
  apy: string; // 4位精度
};

export type KLineItem = {
  close: string;
  high: string;
  low: string;
  open: string;
  oracle: Address;
  timestamp: number;
};

export type LiquidationItem = {
  asset_address: Address;
  pool_address: Address;
};

export type MyLiquidityItem = {
  asset_address: Address;
  liquidity: string;
  lp_amount: string;
  name: string;
  pool_address: Address;
  pool_share: string;
  roi: string;
  user_lp_amount: string;
};