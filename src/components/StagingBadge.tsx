export function StagingBadge() {
    if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview") {
        return null;
    }

    return (
        <div className="fixed top-4 left-4 z-50 pointer-events-none">
            <div className="rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/50 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                Staging
            </div>
        </div>
    );
}
