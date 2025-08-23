import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  return (
    <header className="relative w-full py-4 px-6 shadow-sm rounded-xl bg-white mb-4">
      {/* Sidebar trigger positioned at the far left of the header */}
      <SidebarTrigger className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer md:left-6" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight">
            Election Campaign Analytics
          </h1>
          <p className="text-gray-600 hidden sm:block">
            Real-time Prescriptive Analytics for Strategic Campaign Optimization
          </p>
        </div>
      </div>
    </header>
  );
}
