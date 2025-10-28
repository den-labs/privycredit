export type ProofStatus = 'apto' | 'casi' | 'error';
export type BandLevel = 'A' | 'B' | 'C';
export type ReminderStatus = 'pending' | 'sent' | 'cancelled';

export interface User {
  id: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

export interface Factors {
  estabilidad: BandLevel;
  inflows: BandLevel;
  riesgo: BandLevel;
}

export interface Proof {
  id: string;
  user_id: string;
  status: ProofStatus;
  factors: Factors;
  anchor_root?: string;
  created_at: string;
  expires_at: string;
  blockchain_proof_id?: string;
  tx_hash?: string;
  epoch?: number;
}

export interface Share {
  id: string;
  proof_id: string;
  token: string;
  created_at: string;
  expires_at: string;
  consumed_by_verifier_id?: string;
  consumed_at?: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  reminder_date: string;
  status: ReminderStatus;
  created_at: string;
}

export interface Improvement {
  title: string;
  description: string;
  impact: 'alto' | 'medio' | 'bajo';
}
