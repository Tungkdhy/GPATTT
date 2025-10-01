import { Skeleton } from '../ui/skeleton';

interface LoadingSkeletonProps {
  type?: 'table' | 'card' | 'dashboard';
  rows?: number;
}

export function LoadingSkeleton({ type = 'table', rows = 5 }: LoadingSkeletonProps) {
  if (type === 'dashboard') {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="slide-in-left">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stagger-item" style={{animationDelay: `${i * 0.1}s`}}>
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
        
        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 w-full stagger-item" style={{animationDelay: '0.5s'}} />
          <Skeleton className="h-80 w-full stagger-item" style={{animationDelay: '0.6s'}} />
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="slide-in-left">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        
        <div className="stagger-item">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Default table skeleton
  return (
    <div className="space-y-6 fade-in-up">
      <div className="slide-in-left">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 mt-2" />
      </div>
      
      <div className="space-y-4 stagger-item">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {/* Search and filters */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        
        {/* Table */}
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton 
              key={i} 
              className="h-12 w-full stagger-item" 
              style={{animationDelay: `${i * 0.05}s`}}
            />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="flex justify-center">
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
    </div>
  );
}