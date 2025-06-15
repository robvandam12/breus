
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ImmersionStats {
  total_inmersions: number;
  total_dive_time_seconds: number;
  avg_dive_time_seconds: number;
  avg_max_depth: number;
  inmersions_by_day: { date: string; count: number }[];
  inmersions_by_site: { site: string; count: number }[];
  inmersions_by_diver: { diver: string; count: number }[];
  inmersions_by_work_type: { [key: string]: number };
}

export const useImmersionReports = (
    dateRange: { from: Date; to: Date }
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['immersion_report_stats', dateRange],
    queryFn: async (): Promise<ImmersionStats> => {
        if (!dateRange.from || !dateRange.to) {
            return {
                total_inmersions: 0,
                total_dive_time_seconds: 0,
                avg_dive_time_seconds: 0,
                avg_max_depth: 0,
                inmersions_by_day: [],
                inmersions_by_site: [],
                inmersions_by_diver: [],
                inmersions_by_work_type: {},
            };
        }

      const { data, error } = await supabase.rpc('get_immersion_stats', {
        p_start_date: dateRange.from.toISOString(),
        p_end_date: dateRange.to.toISOString(),
      });

      if (error) {
        console.error('Error fetching immersion report stats:', error);
        throw error;
      }
      
      return data as unknown as ImmersionStats;
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
