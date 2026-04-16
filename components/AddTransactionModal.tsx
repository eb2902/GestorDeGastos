"use client";
import { useState, useEffect, useRef } from "react";
import { X, Plus, ArrowDownCircle, ArrowUpCircle, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { DynamicIcon } from "./DynamicIcon"; 

interface Category {
  id: string;
  name: string;
  icon: string;
}

export default function AddTransactionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [categoryId, setCategoryId] = useState("");
  
  // UI State
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Seleccionar categoría");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen) return;

      const { data, error } = await supabase
        .from('categories')
        .select('id, name, icon')
        .order('name', { ascending: true });
      
      if (data) {
        setCategories(data);
      }
      if (error) {
        console.error("Error cargando categorías:", error.message);
      }
    };

    fetchCategories();
  }, [isOpen, supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCategoryId("");
    setSelectedIcon(null);
    setSelectedCategoryName("Seleccionar categoría");
    setIsDropdownOpen(false);
    setLoading(false);
    setType("expense");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("transactions").insert({
      user_id: user?.id,
      description,
      amount: type === "expense" ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      category_id: categoryId || null,
      date: new Date().toISOString(),
    });

    if (error) {
      alert("Error al guardar: " + error.message);
      setLoading(false);
    } else {
      setIsOpen(false);
      resetForm();
      router.refresh();
    }
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
    >
      <Plus size={18} />
      <span>Nuevo Registro</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-200 relative">
        <div className="p-8">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">Nuevo Movimiento</h2>
            <button 
              onClick={() => { setIsOpen(false); resetForm(); }} 
              className="p-2 hover:bg-slate-800 rounded-full opacity-50 hover:opacity-100 transition-all text-white"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 pb-6">
            
            {/* Selector de Tipo (Gasto/Ingreso) */}
            <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
              <button 
                type="button"
                onClick={() => setType("expense")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${type === "expense" ? "bg-red-500/10 text-red-500 border border-red-500/20" : "opacity-40 text-slate-400"}`}
              >
                <ArrowDownCircle size={16} /> Gasto
              </button>
              <button 
                type="button"
                onClick={() => setType("income")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${type === "income" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "opacity-40 text-slate-400"}`}
              >
                <ArrowUpCircle size={16} /> Ingreso
              </button>
            </div>

            <div className="space-y-4">
              
              {/* Descripción */}
              <div className="space-y-2 text-white">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Descripción</label>
                <input 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: Supermercado Coto"
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              {/* Selector de Categoría con DynamicIcon */}
              <div className="space-y-2 text-white" ref={dropdownRef}>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Categoría</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${categoryId ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500 opacity-30'}`}>
                        <DynamicIcon name={selectedIcon || "Tag"} size={18} />
                      </div>
                      <span className={categoryId ? "text-white" : "text-slate-500"}>
                        {selectedCategoryName}
                      </span>
                    </div>
                    <ChevronDown size={18} className={`opacity-30 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 z-[100] mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
                        {categories.length === 0 ? (
                          <div className="p-4 text-center text-sm text-slate-500">Cargando categorías...</div>
                        ) : (
                          categories.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setCategoryId(cat.id);
                                setSelectedCategoryName(cat.name);
                                setSelectedIcon(cat.icon);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-5 py-3.5 transition-colors text-left border-b border-slate-800/50 last:border-none ${categoryId === cat.id ? 'bg-blue-600/10' : 'hover:bg-slate-800'}`}
                            >
                              <div className={`p-1.5 rounded-lg ${categoryId === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-blue-400'}`}>
                                <DynamicIcon name={cat.icon} size={16} />
                              </div>
                              <span className={`text-sm font-medium ${categoryId === cat.id ? 'text-blue-400' : 'text-slate-300'}`}>
                                {cat.name}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Monto */}
              <div className="space-y-2 text-white">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Monto</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold opacity-30">$</span>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900 border border-slate-800 p-4 pl-10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-xl tabular-nums"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] text-white mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
            >
              {loading ? "Guardando..." : "Confirmar Movimiento"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}