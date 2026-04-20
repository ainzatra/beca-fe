import { LoginForm } from '@/components/LoginForm';

export function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative flex flex-col justify-center bg-gradient-to-br from-primary via-primary to-accent p-8 lg:p-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative z-10 space-y-8">
          <div className="space-y-2">
            <h1 className="text-8xl font-black text-white tracking-tight lg:text-9xl">
              ECA
            </h1>
            <p className="text-xl text-white/60 font-medium">
              Election Campaign Analytics Platform
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center bg-background">
        <div className="mx-auto w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
