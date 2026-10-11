#!/usr/bin/env node
import { createWalletClient, http } from 'viem';
import { scroll, scrollSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const NETWORKS = {
  mainnet: {
    name: 'Scroll Mainnet',
    chain: scroll,
    rpcUrl: 'https://rpc.scroll.io',
    contract: '0x66322406Ada2d92B38E13803fA8eC3382c65f008',
  },
  sepolia: {
    name: 'Scroll Sepolia',
    chain: scrollSepolia,
    rpcUrl: 'https://sepolia-rpc.scroll.io',
    contract: '0x99E36C7D9a01d10E9bb7A40870b7580a2A88E8A7',
  },
};

const ABI = [
  {
    name: 'anchorRoot',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'epoch', type: 'uint64' },
      { name: 'root', type: 'bytes32' },
    ],
    outputs: [],
  },
] ;

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (!arg.startsWith('--')) return acc;
    const [key, value] = arg.replace(/^--/, '').split('=');
    acc[key] = value ?? true;
    return acc;
  }, {});
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const chainKey = (args.chain ?? 'mainnet').toLowerCase();
  const network = NETWORKS[chainKey];

  if (!network) {
    throw new Error(`Unknown chain "${chainKey}". Use --chain=mainnet|sepolia`);
  }

  const epoch =
    args.epoch !== undefined ? BigInt(args.epoch) : BigInt(Math.floor(Date.now() / DAY_IN_MS));
  const root = args.root;

  if (!root || typeof root !== 'string' || !root.startsWith('0x') || root.length !== 66) {
    throw new Error('Missing or invalid --root. Pass a 32-byte hex string (0x...)');
  }

  const privateKey = process.env.ANCHOR_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('Set ANCHOR_PRIVATE_KEY in your environment before running this script.');
  }

  const account = privateKeyToAccount(privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`);

  const walletClient = createWalletClient({
    chain: network.chain,
    transport: http(network.rpcUrl),
    account,
  });

  console.log(`Anchoring epoch ${epoch} on ${network.name}`);
  console.log(`  Contract: ${network.contract}`);
  console.log(`  Root:     ${root}`);

  const txHash = await walletClient.writeContract({
    address: network.contract,
    abi: ABI,
    functionName: 'anchorRoot',
    args: [epoch, root],
  });

  console.log(`Submitted transaction ${txHash}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
