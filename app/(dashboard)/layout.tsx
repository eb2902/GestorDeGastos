import Sidebar from "@/components/Sidebar";
import ResponsiveLayout from "@/components/ResponsiveLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsiveLayout sidebar={<Sidebar />}>
      {children}
    </ResponsiveLayout>
  );
}
