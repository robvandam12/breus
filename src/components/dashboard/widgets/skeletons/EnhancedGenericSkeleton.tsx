
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface EnhancedGenericSkeletonProps {
  type?: 'chart' | 'list' | 'grid' | 'metrics' | 'content';
  showHeader?: boolean;
  itemCount?: number;
}

export const EnhancedGenericSkeleton = ({ 
  type = 'content', 
  showHeader = true,
  itemCount = 3 
}: EnhancedGenericSkeletonProps) => {
  const renderSkeletonContent = () => {
    switch (type) {
      case 'chart':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        );
      
      case 'metrics':
        return (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <Skeleton className="h-8 w-16 mx-auto" />
                <Skeleton className="h-3 w-20 mx-auto" />
              </motion.div>
            ))}
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: itemCount }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center space-x-3"
              >
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-4 w-16" />
              </motion.div>
            ))}
          </div>
        );
      
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: itemCount }).map((_, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-1/2" />
              </motion.div>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
            <Skeleton className="h-24 w-full" />
            <div className="flex space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-4 animate-pulse">
      {showHeader && (
        <div className="mb-4 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      )}
      {renderSkeletonContent()}
    </div>
  );
};
