export type BandLevel = 'A' | 'B' | 'C';

export interface Proof {
  id: string;
  user_id: string;
  status: 'apto' | 'casi';
  factors: {
    estabilidad: BandLevel;
    inflows: BandLevel;
    riesgo: BandLevel;
  };
  anchor_root: string;
  blockchain_proof_id: string;
  tx_hash?: string;
  epoch: number;
  created_at: string;
  expires_at: string;
  chainId: number;
}
