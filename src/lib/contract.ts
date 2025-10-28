import { createPublicClient, createWalletClient, custom, http, type Address } from 'viem';
import { scrollSepolia } from 'viem/chains';

export const CONTRACT_ADDRESS = '0x017Ee1cf9fd610b0D2a264bca1dec9Efe0d8b778' as Address;

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

export const publicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
});

export function createWalletClientFromProvider() {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  return createWalletClient({
    chain: scrollSepolia,
    transport: custom(window.ethereum),
  });
}

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
