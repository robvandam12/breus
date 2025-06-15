
export type SecurityAlertPriority = 'info' | 'warning' | 'critical' | 'emergency';

export interface SecurityAlert {
  id: string;
  inmersion_id: string;
  rule_id: string | null;
  type: 'DEPTH_LIMIT' | 'ASCENT_RATE' | 'BOTTOM_TIME' | string;
  priority: SecurityAlertPriority;
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

export interface EscalationLevel {
  after_minutes: number;
  notify_roles: string[];
  channels: string[];
}

export interface EscalationPolicy {
  levels: EscalationLevel[];
}

export interface SecurityAlertRule {
  id: string;
  name: string;
  description: string | null;
  type: string;
  config: any;
  priority: SecurityAlertPriority;
  message_template: string;
  enabled: boolean;
  is_template: boolean;
  scope_type: string | null;
  scope_id: string | null;
  escalation_policy: EscalationPolicy;
  notification_channels: string[];
  target_roles: string[];
  created_at: string;
  updated_at: string;
}
