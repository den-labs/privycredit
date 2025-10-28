# Blockchain Integration - PrivyCredit

## Overview

PrivyCredit now integrates with a smart contract deployed on Scroll to anchor ZK credit proofs on-chain. This provides cryptographic verification and immutability for credit assessments.

## Smart Contract Details

- **Network**: Scroll (Chain ID: 534352)
- **Contract Address**: `0x017Ee1cf9fd610b0D2a264bca1dec9Efe0d8b778`
- **Explorer**: [View on Scrollscan](https://scrollscan.com/address/0x017Ee1cf9fd610b0D2a264bca1dec9Efe0d8b778)

## How It Works

### 1. Proof Generation Flow

When a user generates a proof:

1. **Signal Collection**: Analyzes wallet history (estabilidad, inflows, riesgo)
2. **ZK Proof Generation**: Creates off-chain cryptographic proof
3. **Blockchain Anchoring**: Submits proof to smart contract via `submitProof()`
   - Generates unique `proofId` (keccak256 hash)
   - Creates `commitment` hash (ZK proof commitment)
   - Records band levels (A/B/C) for each factor
   - Stores epoch timestamp
4. **Database Storage**: Saves proof metadata + transaction hash in Supabase

### 2. Verification Flow

Lenders can verify proofs in two ways:

1. **Off-chain**: Query Supabase database via share token
2. **On-chain**: Read from smart contract using `getProofSummary(proofId)`

The VerifierGate automatically checks both:
- Validates share token hasn't expired
- Queries on-chain proof status via `getProofSummary()`
- Shows blockchain verification badge if valid

### 3. Band System

Each factor is represented as an enum:
- **Band A (0)**: Alto/High - Best performance
- **Band B (1)**: Medio/Medium - Acceptable
- **Band C (2)**: Bajo/Low - Needs improvement

Factors evaluated:
- `stability`: Wallet age and transaction continuity
- `inflows`: Income pattern regularity
- `risk`: DeFi exposure and drawdown risk

## Technical Stack

- **viem**: Ethereum interaction library
- **wagmi concepts**: Wallet connection patterns
- **Scroll RPC**: https://rpc.scroll.io
- **Supabase**: Off-chain database for metadata

## Key Functions

### Smart Contract

```solidity
// Submit a new proof
function submitProof(
    bytes32 proofId,
    uint64 epoch,
    bytes32 commitment,
    Band stability,
    Band inflows,
    Band risk
) external

// Read proof data
function getProofSummary(bytes32 proofId)
    external view returns (
        address user,
        uint64 epoch,
        bytes32 commitment,
        Band stability,
        Band inflows,
        Band risk,
        bool valid,
        uint64 createdAt
    )

// Verify if proof meets minimum bands
function verifyBands(
    bytes32 proofId,
    Band minStability,
    Band minInflows,
    Band minRisk
) external view returns (bool ok)
```

### Frontend Integration

```typescript
// Connect wallet (Web3Context)
import { useWeb3 } from './context/Web3Context';
const { account, connect, isConnected } = useWeb3();

// Submit proof on-chain
const hash = await walletClient.writeContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'submitProof',
  args: [proofId, epoch, commitment, stabilityBand, inflowsBand, riskBand],
});

// Verify proof on-chain
const proofData = await publicClient.readContract({
  address: CONTRACT_ADDRESS,
  abi: CONTRACT_ABI,
  functionName: 'getProofSummary',
  args: [proofId],
});
```

## Database Schema

The `proofs` table includes blockchain fields:

```sql
- blockchain_proof_id: text -- bytes32 proof ID on contract
- tx_hash: text -- Transaction hash
- epoch: bigint -- Epoch number
```

## Privacy Guarantees

✅ **What's on-chain**:
- Proof ID (hash)
- Commitment (hash)
- Band levels (A/B/C) only
- Epoch timestamp
- User wallet address

❌ **NOT on-chain**:
- Actual transaction amounts
- Wallet balances
- Counterparty addresses
- Personal identifiable information

## Gas Optimization

- Single transaction per proof submission
- Minimal storage (only bands, not raw data)
- No complex computation on-chain (verification is off-chain)

## Future Enhancements

1. **Epoch Root Anchoring**: Owner can anchor Merkle roots for batched verification
2. **Proof Revocation**: Owner can revoke compromised proofs
3. **Multi-verifier Support**: Track which lenders consumed proofs
4. **Attestations**: Link to external data providers (Open Banking via EIP-712 signatures)

## Security Considerations

- Users must approve transaction in MetaMask/wallet
- Smart contract is ownable (admin functions restricted)
- RLS policies in Supabase protect off-chain data
- Share tokens expire after 72 hours
- Proofs expire after 30 days

## Testing

To test the integration:

1. Install MetaMask or compatible wallet
2. Switch to Scroll network (or add it)
3. Get Scroll ETH from [bridge](https://scroll.io/bridge) or faucet
4. Connect wallet and generate proof
5. Approve transaction in wallet
6. View transaction on Scrollscan
7. Verify proof in VerifierGate

## Links

- [Scroll Network](https://scroll.io)
- [Scrollscan Explorer](https://scrollscan.com)
- [viem Documentation](https://viem.sh)
- [Contract Address](https://scrollscan.com/address/0x017Ee1cf9fd610b0D2a264bca1dec9Efe0d8b778)
