import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#020617]">
      {/* Sidebar Fijo */}
      <aside className="w-64 fixed inset-y-0 left-0 border-r border-slate-800">
        <Sidebar />
      </aside>

      {/* Contenido Principal con Scroll */}
      <main className="flex-1 ml-64 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
