export enum SupportedChainId {
  MAINNET = 1,
  RINKEBY = 4,
  GOERLI = 5,
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'mainnet',
  [SupportedChainId.RINKEBY]: 'rinkeby',
  [SupportedChainId.GOERLI]: 'goerli',
};

/**
 * Array of all the supported chain IDs
 */
export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId).filter(
  (id) => typeof id === 'number',
) as SupportedChainId[];

export const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [SupportedChainId.MAINNET];

/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export const L1_CHAIN_IDS = [SupportedChainId.MAINNET, SupportedChainId.RINKEBY, SupportedChainId.GOERLI] as const;

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number];

export const FALLBACK_CHAIN_ID = SupportedChainId.GOERLI;

export const L2_CHAIN_IDS: readonly SupportedChainId[] = [] as const;

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number];

export function isSupportedChain(chainId: number | null | undefined): chainId is SupportedChainId {
  return !!chainId && !!SupportedChainId[chainId];
}
