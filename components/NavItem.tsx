"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export default function NavItem({ icon, label, href }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link href={href} className="block w-full">
      <div 
        className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all border group ${
          isActive 
            ? "bg-blue-600/10 border-blue-600/20 text-blue-500 shadow-lg shadow-blue-500/5" 
            : "hover:bg-slate-900 border-transparent hover:border-slate-800 text-slate-400 hover:text-white"
        }`}
      >
        <div className={`transition-opacity ${isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100"}`}>
          {icon}
        </div>
        <span className={`font-bold text-sm tracking-tight ${isActive ? "text-blue-500" : ""}`}>
          {label}
        </span>
        {isActive && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-scale-in" />
        )}
      </div>
    </Link>
  );
}
