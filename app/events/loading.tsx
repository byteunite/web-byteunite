import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation skeleton */}
            <div className="h-16 border-b bg-background">
                <div className="container mx-auto px-4 h-full flex items-center justify-between">
                    <Skeleton className="h-8 w-32" />
                    <div className="flex space-x-4">
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-8 w-20" />
                    </div>
                </div>
            </div>

            {/* Header skeleton */}
            <section className="py-16 px-4">
                <div className="container mx-auto text-center">
                    <Skeleton className="h-12 w-96 mx-auto mb-4" />
                    <Skeleton className="h-6 w-[600px] mx-auto mb-8" />

                    {/* Filters skeleton */}
                    <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-4 mb-8">
                        <Skeleton className="h-10 flex-1" />
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-10 w-48" />
                    </div>
                </div>
            </section>

            {/* Events grid skeleton */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <Skeleton className="h-8 w-64 mx-auto mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card className="pt-0" key={i}>
                                <Skeleton className="h-48 w-full rounded-t-lg" />
                                <CardHeader>
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-6 w-16" />
                                        <Skeleton className="h-8 w-20" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
