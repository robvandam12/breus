
import { Suspense } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { SidebarSkeleton } from '@/components/navigation/SidebarSkeleton';
import { Skeleton } from "@/components/ui/skeleton";

const ContentSkeleton = () => (
    <>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-4 w-px mx-2" />
            <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5 rounded-sm" />
                <div>
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48 mt-1" />
                </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
                 <Skeleton className="h-10 w-24" />
                 <Skeleton className="h-10 w-10" />
            </div>
        </div>
        <div className="flex-1 p-6 space-y-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="border rounded-lg p-2">
                <Skeleton className="h-[500px] w-full" />
            </div>
        </div>
    </>
);

export const PageWithSidebarSkeleton = () => (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Suspense fallback={<SidebarSkeleton />}>
            <RoleBasedSidebar />
        </Suspense>
        <main className="flex-1 flex flex-col bg-white">
            <ContentSkeleton />
        </main>
      </div>
    </SidebarProvider>
);
