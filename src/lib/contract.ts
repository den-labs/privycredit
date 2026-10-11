import { createPublicClient, http, type Address } from 'viem';
import { scroll, scrollSepolia } from 'viem/chains';

export type ScrollNetworkConfig = {
  key: 'mainnet' | 'sepolia';
  chainId: number;
  name: string;
  explorer: string;
  rpcUrl: string;
  contractAddress: Address;
  isTestnet: boolean;
};

const SUPPORTED_NETWORKS = [
  {
    key: 'mainnet',
    chainId: scroll.id,
    name: 'Scroll Mainnet',
    explorer: 'https://scrollscan.com',
    rpcUrl: 'https://rpc.scroll.io',
    contractAddress: '0x66322406Ada2d92B38E13803fA8eC3382c65f008' as Address,
    isTestnet: false,
  },
  {
    key: 'sepolia',
    chainId: scrollSepolia.id,
    name: 'Scroll Sepolia Testnet',
    explorer: 'https://sepolia.scrollscan.com',
    rpcUrl: 'https://sepolia-rpc.scroll.io',
    contractAddress: '0x99E36C7D9a01d10E9bb7A40870b7580a2A88E8A7' as Address,
    isTestnet: true,
  },
] as const satisfies readonly ScrollNetworkConfig[];

export const [SCROLL_MAINNET_CONFIG, SCROLL_SEPOLIA_CONFIG] = SUPPORTED_NETWORKS;

export const SCROLL_MAINNET_CHAIN_ID = SCROLL_MAINNET_CONFIG.chainId;
export const SCROLL_SEPOLIA_CHAIN_ID = SCROLL_SEPOLIA_CONFIG.chainId;

export type SupportedChainId = (typeof SUPPORTED_NETWORKS)[number]['chainId'];

export const SUPPORTED_CHAIN_IDS = [SCROLL_MAINNET_CHAIN_ID, SCROLL_SEPOLIA_CHAIN_ID] as const;
export const SUPPORTED_NETWORK_NAMES = SUPPORTED_NETWORKS.map((network) => network.name);

const NETWORK_CONFIG_BY_CHAIN_ID: Record<SupportedChainId, ScrollNetworkConfig> = {
  [SCROLL_MAINNET_CHAIN_ID]: SCROLL_MAINNET_CONFIG,
  [SCROLL_SEPOLIA_CHAIN_ID]: SCROLL_SEPOLIA_CONFIG,
};

export const SCROLL_MAINNET_NAME = SCROLL_MAINNET_CONFIG.name;
export const SCROLL_MAINNET_RPC = SCROLL_MAINNET_CONFIG.rpcUrl;
export const SCROLL_MAINNET_EXPLORER = SCROLL_MAINNET_CONFIG.explorer;

export const SCROLL_SEPOLIA_NAME = SCROLL_SEPOLIA_CONFIG.name;
export const SCROLL_SEPOLIA_RPC = SCROLL_SEPOLIA_CONFIG.rpcUrl;
export const SCROLL_SEPOLIA_EXPLORER = SCROLL_SEPOLIA_CONFIG.explorer;

export const DEFAULT_CHAIN_ID = SCROLL_MAINNET_CHAIN_ID;
export const CONTRACT_ADDRESS = SCROLL_MAINNET_CONFIG.contractAddress;

export const CONTRACT_ADDRESSES: Record<SupportedChainId, Address> = {
  [SCROLL_MAINNET_CHAIN_ID]: SCROLL_MAINNET_CONFIG.contractAddress,
  [SCROLL_SEPOLIA_CHAIN_ID]: SCROLL_SEPOLIA_CONFIG.contractAddress,
};

export const getNetworkConfig = (chainId?: number): ScrollNetworkConfig => {
  if (isSupportedChain(chainId)) {
    return NETWORK_CONFIG_BY_CHAIN_ID[chainId];
  }
  return NETWORK_CONFIG_BY_CHAIN_ID[DEFAULT_CHAIN_ID];
};

export const getContractAddress = (chainId?: number): Address => getNetworkConfig(chainId).contractAddress;
export const getExplorerUrl = (chainId?: number): string => getNetworkConfig(chainId).explorer;
export const getNetworkName = (chainId?: number): string => getNetworkConfig(chainId).name;

export const isSupportedChain = (chainId?: number): chainId is SupportedChainId =>
  typeof chainId === 'number' && SUPPORTED_CHAIN_IDS.includes(chainId as SupportedChainId);

export const CONTRACT_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'oldOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' },
    ],
    name: 'OwnerChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'proofId', type: 'bytes32' },
    ],
    name: 'ProofRevoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'proofId', type: 'bytes32' },
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'uint64', name: 'epoch', type: 'uint64' },
      { indexed: false, internalType: 'bytes32', name: 'commitment', type: 'bytes32' },
      {
        components: [
          { internalType: 'enum ZKCreditProofDemo.Band', name: 'stability', type: 'uint8' },
          { internalType: 'enum ZKCreditProofDemo.Band', name: 'inflows', type: 'uint8' },
          { internalType: 'enum ZKCreditProofDemo.Band', name: 'risk', type: 'uint8' },
        ],
        indexed: false,
        internalType: 'struct ZKCreditProofDemo.Factors',
        name: 'factors',
        type: 'tuple',
      },
    ],
    name: 'ProofSubmitted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint64', name: 'epoch', type: 'uint64' },
      { indexed: true, internalType: 'bytes32', name: 'root', type: 'bytes32' },
    ],
    name: 'RootAnchored',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint64', name: 'epoch', type: 'uint64' },
      { internalType: 'bytes32', name: 'root', type: 'bytes32' },
    ],
    name: 'anchorRoot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
    name: 'epochRoot',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'proofId', type: 'bytes32' }],
    name: 'getProofSummary',
    outputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint64', name: 'epoch', type: 'uint64' },
      { internalType: 'bytes32', name: 'commitment', type: 'bytes32' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'stability', type: 'uint8' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'inflows', type: 'uint8' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'risk', type: 'uint8' },
      { internalType: 'bool', name: 'valid', type: 'bool' },
      { internalType: 'uint64', name: 'createdAt', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'proofs',
    outputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint64', name: 'epoch', type: 'uint64' },
      { internalType: 'bytes32', name: 'commitment', type: 'bytes32' },
      {
        components: [
          { internalType: 'enum ZKCreditProofDemo.Band', name: 'stability', type: 'uint8' },
          { internalType: 'enum ZKCreditProofDemo.Band', name: 'inflows', type: 'uint8' },
          { internalType: 'enum ZKCreditProofDemo.Band', name: 'risk', type: 'uint8' },
        ],
        internalType: 'struct ZKCreditProofDemo.Factors',
        name: 'factors',
        type: 'tuple',
      },
      { internalType: 'bool', name: 'valid', type: 'bool' },
      { internalType: 'uint64', name: 'createdAt', type: 'uint64' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'proofId', type: 'bytes32' }],
    name: 'revokeProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'setOwner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'proofId', type: 'bytes32' },
      { internalType: 'uint64', name: 'epoch', type: 'uint64' },
      { internalType: 'bytes32', name: 'commitment', type: 'bytes32' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'stability', type: 'uint8' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'inflows', type: 'uint8' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'risk', type: 'uint8' },
    ],
    name: 'submitProof',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'proofId', type: 'bytes32' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'minStability', type: 'uint8' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'minInflows', type: 'uint8' },
      { internalType: 'enum ZKCreditProofDemo.Band', name: 'minRisk', type: 'uint8' },
    ],
    name: 'verifyBands',
    outputs: [{ internalType: 'bool', name: 'ok', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const publicClients: Record<SupportedChainId, ReturnType<typeof createPublicClient>> = {
  [SCROLL_MAINNET_CHAIN_ID]: createPublicClient({
    chain: scroll,
    transport: http(SCROLL_MAINNET_RPC),
  }),
  [SCROLL_SEPOLIA_CHAIN_ID]: createPublicClient({
    chain: scrollSepolia,
    transport: http(SCROLL_SEPOLIA_RPC),
  }),
};

export const getPublicClient = (chainId?: number) => {
  const targetChainId: SupportedChainId = isSupportedChain(chainId) ? chainId : DEFAULT_CHAIN_ID;
  return publicClients[targetChainId];
};

export const publicClient = getPublicClient();

export type ProofSummaryTuple = readonly [
  Address,
  bigint,
  `0x${string}`,
  number,
  number,
  number,
  boolean,
  bigint,
];

export type ProofSummaryResult = {
  data: ProofSummaryTuple;
  network: ScrollNetworkConfig;
  chainId: SupportedChainId;
  client: ReturnType<typeof createPublicClient>;
};

export const findValidProofSummary = async (
  proofId: `0x${string}`,
): Promise<ProofSummaryResult | null> => {
  for (const chainId of SUPPORTED_CHAIN_IDS) {
    const network = NETWORK_CONFIG_BY_CHAIN_ID[chainId];
    const client = publicClients[chainId];
    const data = (await client.readContract({
      address: network.contractAddress,
      abi: CONTRACT_ABI,
      functionName: 'getProofSummary',
      args: [proofId],
    })) as ProofSummaryTuple;

    if (data[6]) {
      return {
        data,
        network,
        chainId,
        client,
      };
    }
  }

  return null;
};

export enum Band {
  A = 0,
  B = 1,
  C = 2,
}

export function bandLevelToBand(bandLevel: 'A' | 'B' | 'C'): Band {
  return Band[bandLevel];
}

export function bandToBandLevel(band: number): 'A' | 'B' | 'C' {
  switch (band) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    default:
      return 'C';
  }
}
