/*
  # PrivyCredit - ZK Credit Proof Schema

  This migration creates the core schema for the ZK credit proof system.

  ## New Tables
  
  ### `users`
  Stores basic user information linked to wallet addresses
  - `id` (uuid, primary key) - Unique user identifier
  - `wallet_address` (text, unique) - User's wallet address
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `proofs`
  Stores generated credit proofs with their results
  - `id` (uuid, primary key) - Unique proof identifier
  - `user_id` (uuid, foreign key) - Reference to user
  - `status` (text) - Proof status: 'apto', 'casi', 'error'
  - `factors` (jsonb) - Factor bands: {estabilidad, inflows, riesgo}
  - `anchor_root` (text) - Hash for blockchain anchor
  - `created_at` (timestamptz) - Proof generation timestamp
  - `expires_at` (timestamptz) - Proof expiration (default +30 days)

  ### `shares`
  Manages proof sharing tokens for lender verification
  - `id` (uuid, primary key) - Unique share identifier
  - `proof_id` (uuid, foreign key) - Reference to proof
  - `token` (text, unique) - Shareable verification token
  - `created_at` (timestamptz) - Share creation timestamp
  - `expires_at` (timestamptz) - Token expiration (default +72h)
  - `consumed_by_verifier_id` (text, nullable) - Verifier who consumed this
  - `consumed_at` (timestamptz, nullable) - Consumption timestamp

  ### `reminders`
  Tracks user reminders for future proof generation
  - `id` (uuid, primary key) - Unique reminder identifier
  - `user_id` (uuid, foreign key) - Reference to user
  - `reminder_date` (timestamptz) - When to remind
  - `status` (text) - 'pending', 'sent', 'cancelled'
  - `created_at` (timestamptz) - Reminder creation timestamp

  ## Security
  
  All tables have RLS enabled with policies for authenticated users.
  Users can only access their own data, verifiers can read shares.
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create proofs table
CREATE TABLE IF NOT EXISTS proofs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('apto', 'casi', 'error')),
  factors jsonb NOT NULL DEFAULT '{}'::jsonb,
  anchor_root text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '30 days')
);

-- Create shares table
CREATE TABLE IF NOT EXISTS shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_id uuid REFERENCES proofs(id) ON DELETE CASCADE NOT NULL,
  token text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '72 hours'),
  consumed_by_verifier_id text,
  consumed_at timestamptz
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reminder_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_proofs_user_id ON proofs(user_id);
CREATE INDEX IF NOT EXISTS idx_proofs_created_at ON proofs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shares_proof_id ON shares(proof_id);
CREATE INDEX IF NOT EXISTS idx_shares_token ON shares(token);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status) WHERE status = 'pending';

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for proofs table
CREATE POLICY "Users can view own proofs"
  ON proofs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own proofs"
  ON proofs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own proofs"
  ON proofs FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for shares table
CREATE POLICY "Users can view own shares"
  ON shares FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proofs
      WHERE proofs.id = shares.proof_id
      AND proofs.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view shares by token"
  ON shares FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create shares for own proofs"
  ON shares FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM proofs
      WHERE proofs.id = proof_id
      AND proofs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own shares"
  ON shares FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM proofs
      WHERE proofs.id = shares.proof_id
      AND proofs.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM proofs
      WHERE proofs.id = shares.proof_id
      AND proofs.user_id = auth.uid()
    )
  );

-- RLS Policies for reminders table
CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own reminders"
  ON reminders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
