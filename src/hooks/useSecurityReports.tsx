
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SecurityReportStats {
  total_alerts: number;
  alerts_by_priority: { [key: string]: number };
  alerts_by_type: { [key: string]: number };
  avg_acknowledgement_time_seconds: number;
  unacknowledged_alerts: number;
}

export const useSecurityReports = (
    dateRange: { from: Date; to: Date }
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['security_report_stats', dateRange],
    queryFn: async (): Promise<SecurityReportStats> => {
        if (!dateRange.from || !dateRange.to) {
            return {
                total_alerts: 0,
                alerts_by_priority: {},
                alerts_by_type: {},
                avg_acknowledgement_time_seconds: 0,
                unacknowledged_alerts: 0,
            };
        }

      const { data, error } = await supabase.rpc('get_security_alert_stats', {
        p_start_date: dateRange.from.toISOString(),
        p_end_date: dateRange.to.toISOString(),
      });

      if (error) {
        console.error('Error fetching security report stats:', error);
        throw error;
      }
      
      // The return type of rpc is broad, so we cast it to tell TypeScript we know the shape.
      return data as unknown as SecurityReportStats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!dateRange.from && !!dateRange.to, // Only run query if dates are set
  });

  return {
    stats: data,
    isLoading,
    error,
  };
};
