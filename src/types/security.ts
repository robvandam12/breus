
export interface SecurityAlert {
  id: string;
  inmersion_id: string;
  rule_id: string | null;
  type: 'DEPTH_LIMIT' | 'ASCENT_RATE' | 'BOTTOM_TIME' | string;
  priority: 'info' | 'warning' | 'critical' | 'emergency';
  details: {
    inmersion_code?: string;
    [key: string]: any;
  };
  acknowledged: boolean;
  acknowledged_by: string | null;
  acknowledged_at: string | null;
  created_at: string;
  inmersion?: {
    codigo: string;
  };
  escalation_level: number;
  last_escalated_at: string | null;
}
