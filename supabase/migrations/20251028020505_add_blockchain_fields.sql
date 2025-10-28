/*
  # Add blockchain fields to proofs table

  This migration adds fields to store blockchain-related data for proofs:
  
  1. Changes to `proofs` table
    - `blockchain_proof_id` (text, nullable) - The bytes32 proof ID on the smart contract
    - `tx_hash` (text, nullable) - Transaction hash of the submitProof call
    - `epoch` (bigint, nullable) - Epoch number on the blockchain
  
  These fields allow us to link off-chain proofs with their on-chain anchors.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'proofs' AND column_name = 'blockchain_proof_id'
  ) THEN
    ALTER TABLE proofs ADD COLUMN blockchain_proof_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'proofs' AND column_name = 'tx_hash'
  ) THEN
    ALTER TABLE proofs ADD COLUMN tx_hash text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'proofs' AND column_name = 'epoch'
  ) THEN
    ALTER TABLE proofs ADD COLUMN epoch bigint;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_proofs_blockchain_proof_id ON proofs(blockchain_proof_id);
CREATE INDEX IF NOT EXISTS idx_proofs_tx_hash ON proofs(tx_hash);
