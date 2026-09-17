import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-250">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 max-w-full overflow-x-hidden">
        <Topbar />
        <main className="flex-1 p-6 md:p-8 ml-64 bg-slate-50 dark:bg-[#0B0F19] min-h-[calc(100vh-5rem)] max-w-full overflow-x-hidden transition-colors duration-250">
          {children}
        </main>
      </div>
    </div>
  );
}

