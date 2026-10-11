#!/usr/bin/env node
import { createPublicClient, http } from 'viem';
import { scroll, scrollSepolia } from 'viem/chains';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const currentEpoch = Math.floor(Date.now() / DAY_IN_MS);

const NETWORKS = [
  {
    key: 'mainnet',
    name: 'Scroll Mainnet',
    chain: scroll,
    rpcUrl: 'https://rpc.scroll.io',
    contract: '0x66322406Ada2d92B38E13803fA8eC3382c65f008',
  },
  {
    key: 'sepolia',
    name: 'Scroll Sepolia',
    chain: scrollSepolia,
    rpcUrl: 'https://sepolia-rpc.scroll.io',
    contract: '0x99E36C7D9a01d10E9bb7A40870b7580a2A88E8A7',
  },
];

const ABI = [
  {
    name: 'epochRoot',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint64' }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
] ;

async function main() {
  console.log(`Checking epoch ${currentEpoch} (${new Date(currentEpoch * DAY_IN_MS).toISOString().split('T')[0]})\n`);

  for (const network of NETWORKS) {
    const client = createPublicClient({
      chain: network.chain,
      transport: http(network.rpcUrl),
    });

    const root = await client.readContract({
      address: network.contract,
      abi: ABI,
      functionName: 'epochRoot',
      args: [BigInt(currentEpoch)],
    });

    const hasRoot = root !== '0x0000000000000000000000000000000000000000000000000000000000000000';
    console.log(`${network.name}`);
    console.log(`  Contract: ${network.contract}`);
    console.log(`  Root set: ${hasRoot ? root : '❌ (not anchored)'}`);
    console.log('');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
