export function ProductSkeleton() {
    return (
        <div className="flex flex-col p-6 shadow-sm animate-pulse">
            {/* Image Skeleton */}
            <div className="mb-6 h-52 w-full bg-neutral-200" />

            {/* Content Skeleton */}
            <div className="flex-1 text-center pt-5 space-y-3">
                <div className="h-6 w-2/3 mx-auto bg-neutral-200 rounded" /> {/* Name */}
                <div className="h-4 w-full bg-neutral-100 rounded" />    {/* Description line 1 */}
                <div className="h-4 w-5/6 mx-auto bg-neutral-100 rounded" /> {/* Description line 2 */}
            </div>

            {/* Footer Skeleton */}
            <div className="mt-8 w-full flex items-center justify-between px-2">
                <div className="h-7 w-16 bg-neutral-200 rounded" /> {/* Price */}
                <div className="h-10 w-10 bg-neutral-200 rounded-full" /> {/* Icon placeholder */}
            </div>
        </div>
    );
}