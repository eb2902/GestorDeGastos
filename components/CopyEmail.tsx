"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyEmailProps {
  email: string;
}

export default function CopyEmail({ email }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="group relative flex items-center gap-2 mt-1">
      <p className="text-sm text-slate-500 font-medium">{email}</p>
      <button
        onClick={handleCopy}
        className="p-1.5 rounded-lg bg-slate-800/0 hover:bg-slate-800 text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
        title="Copiar email"
      >
        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
      </button>
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-[10px] text-white rounded shadow-lg animate-fade-in-tooltip">
          ¡Copiado!
        </span>
      )}
    </div>
  );
}
