
import { Suspense } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { ModularSidebar } from "@/components/navigation/ModularSidebar";
import { SidebarSkeleton } from '@/components/navigation/SidebarSkeleton';
import { Skeleton } from "@/components/ui/skeleton";

const DashboardContentSkeleton = () => (
    <>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Skeleton className="h-8 w-8" />
          <div className='pl-2'>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </header>
        <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
        </div>
    </>
);

export const DashboardWithSidebarSkeleton = () => (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Suspense fallback={<SidebarSkeleton />}>
            <ModularSidebar />
        </Suspense>
        <main className="flex-1 flex flex-col bg-white">
            <DashboardContentSkeleton />
        </main>
      </div>
    </SidebarProvider>
);
