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
  lp_token: Address;
  pool_token: Address;
  liquidity: string;
  lp_amount: string;
  pool_decimal: number;
  pool_name: string;
  liquidity_value: string;
  token_image_url: string;
};

export type PoolInfo = {
  oracle: Address;
  pool: Address;
  rate: Address;
  name: string;
  reserve: boolean;
  liquidity_time: number;
  asset_liquidity: string;
  token1_image_url: string;
  token0_image_url: string;
};

export type PoolItem = {
  ID: number;
  apy: string;
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
    rebase_long: string;
    rebase_short: string;
    size_long: string;
    size_short: string;
    last_rebase_time: number;
    request_time: number;
    last_price: string;
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
    price_threshold_Ratio: number;
    price_effective_time: number;
    price_shock_ratio: number;
    liquidity_move_ratio: number;
    liquidity_move_time: number;
    base_liquidity: string;
  };
};

export type PositionItem = {
  asset_address: Address;
  funding_fee: string;
  leverage: number;
  margin: string;
  margin_ratio: number;
  open_price: string;
  open_rebase: string;
  open_time: string;
  pnl: string;
  pool_address: Address;
  pool_name: string;
  pool_token: Address;
  position_id: number;
  position_ratio: number;
  service_fee: string;
  side: string;
  size: string;
  symbol: string;
};

export type HistoryPositionItem = {
  ActionHash: string;
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
  asset_address: Address;
  pool_address: Address;
  fee_ratio: number;
  asset_level: number;
  margin_ratio: number;
  liquidity: string;
  lp_price: string;
  lp_amount: string;
  lp: Address;
  apy: string;
  liquidity_value: string;
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
  position_id: number;
  rewards: string;
  size: string;
  symbol: string;
  user_address: Address;
};

export type MyLiquidityItem = {
  asset_address: Address;
  oracle_address: Address;
  pool_address: Address;
  token: Address;
  liquidity: string;
  lp_amount: string;
  name: string;
  pool_share: string;
  roi: string;
  user_lp_amount: string;
  user_liquidity: string;
  user_liquidity_value: string;
  token_name: string;
  epoch_end_time: number;
  epoch_index: number;
  epoch_start_time: number;
  lp_price: string;
  withdraw_request: number;
};

export type OracleItem = {
  address: Address;
  name: string;
  token_address: Address;
  token_name: string;
  token_image_url: string;
};

export type PositionValue = {
  asset_address: Address;
  pool_address: Address;
  pool_name: string;
  pool_token: Address;
  position_id: number;
  side: string;
  symbol: string;
  service_fee: string;
  funding_fee: string;
  pnl: string;
  realized_pnl: string;
  open_price: string;
  close_price: string;
  size: string;
  can_close: boolean;
  margin_exist: boolean;
};

export type liquidityItem = {
  apy: string;
  asset_address: Address;
  liquidity: string;
  liquidity_value: string;
  lp_amount: string;
  name: string;
  oracle_address: Address;
  pool_address: Address;
  token: Address;
  token_name: string;
  epoch_end_time: number;
  epoch_index: number;
  epoch_start_time: number;
};

export type ApplyRemoveItem = {
  name: string;
  asset_address: Address;
  index: number;
  owner: Address;
  receipt: Address;
  lp_amount: string;
  token_amount: string;
  out_epoch: number;
  status: number; //1:不能领取，2:可以领取
  out_time: number; //可以移除的秒数
  pool_name: string;
};
