export default function FpsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 lg:px-6">
      <div className="flex items-center gap-3">
        <img
          src="/img/fps-calculator.svg"
          alt=""
          className="size-12 shrink-0"
        />
        <h1 className="text-2xl font-bold tracking-tight">محاسبه FPS</h1>
      </div>
      <p className="mt-2 text-muted-foreground">
        تخمین فریم‌ریت بازی‌ها بر اساس سیستم شما — به‌زودی.
      </p>
    </div>
  );
}
