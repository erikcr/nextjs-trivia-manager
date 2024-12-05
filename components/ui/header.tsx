export default function Header() {
  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex items-center justify-center gap-8">
        <h1 className="text-3xl lg:text-4xl">Remote Sales Dashboard</h1>
      </div>
      <h1 className="sr-only">Remote Sales Dashboard</h1>
      <p className="mx-auto max-w-xl text-center text-2xl !leading-tight lg:text-3xl">
        The best way to track performance of your remote sales team
      </p>
      <div className="my-8 w-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent p-[1px]" />
    </div>
  );
}
