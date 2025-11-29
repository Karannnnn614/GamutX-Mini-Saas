export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="rounded-lg border p-4 animate-pulse">
      <div className="h-5 bg-muted rounded w-2/3 mb-2"></div>
      <div className="h-4 bg-muted rounded w-full mb-2"></div>
      <div className="h-3 bg-muted rounded w-1/3"></div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="h-8 bg-muted rounded w-1/3 animate-pulse"></div>
      <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
      <div className="space-y-4 mt-8">
        <TaskCardSkeleton />
        <TaskCardSkeleton />
        <TaskCardSkeleton />
      </div>
    </div>
  );
}
