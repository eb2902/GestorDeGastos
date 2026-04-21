"use client";
import { useState, useEffect, useRef } from "react";
import { X, Plus, ArrowDownCircle, ArrowUpCircle, ChevronDown, Calendar } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { DynamicIcon } from "./DynamicIcon"; 
import { getTodayISO } from "@/utils/formatters";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category_id: string;
  date: string;
  categories?: Category;
}

interface AddTransactionModalProps {
  transactionToEdit?: Transaction | null;
  isOpen?: boolean;
  onClose?: () => void;
  showTrigger?: boolean;
}

export default function AddTransactionModal({ 
  transactionToEdit = null, 
  isOpen: controlledIsOpen, 
  onClose: controlledOnClose,
  showTrigger = true 
}: AddTransactionModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Form State
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(getTodayISO());
  
  // UI State
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState("Seleccionar categoría");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const router = useRouter();

  // Initialize form when editing or opening
  useEffect(() => {
    if (isOpen) {
      if (transactionToEdit) {
        setDescription(transactionToEdit.description);
        setAmount(Math.abs(transactionToEdit.amount).toString());
        setType(transactionToEdit.amount > 0 ? "income" : "expense");
        setCategoryId(transactionToEdit.category_id);
        setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
        if (transactionToEdit.categories) {
          setSelectedCategoryName(transactionToEdit.categories.name);
          setSelectedIcon(transactionToEdit.categories.icon);
        }
      } else {
        resetForm();
      }
    }
  }, [isOpen, transactionToEdit]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!isOpen) return;

      const { data, error } = await supabase
        .from('categories')
        .select('id, name, icon')
        .order('name', { ascending: true });
      
      if (data) {
        setCategories(data);
        // If we have a categoryId but no name/icon (e.g. from transactionToEdit), set it now
        if (categoryId && (!selectedIcon || selectedCategoryName === "Seleccionar categoría")) {
          const cat = data.find(c => c.id === categoryId);
          if (cat) {
            setSelectedCategoryName(cat.name);
            setSelectedIcon(cat.icon);
          }
        }
      }
      if (error) {
        console.error("Error cargando categorías:", error.message);
      }
    };

    fetchCategories();
  }, [isOpen, supabase, categoryId, selectedIcon, selectedCategoryName]);

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
    setDate(getTodayISO());
    setErrorMsg(null);
    setShowValidation(false);
  };

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validación básica
    if (!categoryId) {
      setShowValidation(true);
      setErrorMsg("Por favor, selecciona una categoría");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("No hay usuario autenticado");

      const transactionData = {
        user_id: user.id,
        description,
        amount: type === "expense" ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
        category_id: categoryId,
        date: new Date(date).toISOString(),
      };

      let error;
      if (transactionToEdit) {
        const { error: updateError } = await supabase
          .from("transactions")
          .update(transactionData)
          .eq("id", transactionToEdit.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("transactions")
          .insert(transactionData);
        error = insertError;
      }

      if (error) throw error;

      handleClose();
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      setErrorMsg(message);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón Disparador */}
      {showTrigger && (
        <button 
          onClick={() => setInternalIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span>Nuevo Registro</span>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-[#0f172a] border border-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {transactionToEdit ? "Editar Movimiento" : "Nuevo Movimiento"}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {transactionToEdit ? "Modifica los detalles del registro" : "Registra tus ingresos o gastos"}
                  </p>
                </div>
                <button 
                  onClick={handleClose} 
                  className="p-2 hover:bg-slate-800 rounded-full opacity-50 hover:opacity-100 transition-all text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold animate-in fade-in zoom-in-95">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Selector de Tipo (Gasto/Ingreso) */}
                <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
                  <button 
                    type="button"
                    onClick={() => setType("expense")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${type === "expense" ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-sm" : "opacity-40 text-slate-400 hover:opacity-60"}`}
                  >
                    <ArrowDownCircle size={16} /> Gasto
                  </button>
                  <button 
                    type="button"
                    onClick={() => setType("income")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${type === "income" ? "bg-green-500/10 text-green-500 border border-green-500/20 shadow-sm" : "opacity-40 text-slate-400 hover:opacity-60"}`}
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
                      className="w-full bg-slate-900 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>

                  {/* Selector de Categoría y Fecha (Fila) */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Selector de Categoría */}
                    <div className="space-y-2 text-white" ref={dropdownRef}>
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Categoría</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`w-full bg-slate-900 border p-4 rounded-2xl flex items-center justify-between hover:border-slate-700 transition-all outline-none focus:ring-2 focus:ring-blue-500 ${showValidation && !categoryId ? 'border-red-500/50' : 'border-slate-800'}`}
                          aria-haspopup="listbox"
                          aria-expanded={isDropdownOpen}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${categoryId ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500 opacity-30'}`}>
                              <DynamicIcon name={selectedIcon || "Tag"} size={16} />
                            </div>
                            <span className={`text-sm truncate ${categoryId ? "text-white" : "text-slate-500"}`}>
                              {selectedCategoryName}
                            </span>
                          </div>
                          <ChevronDown size={14} className={`opacity-30 flex-shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute left-0 right-0 z-[100] mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="max-h-56 overflow-y-auto custom-scrollbar">
                              {categories.length === 0 ? (
                                <div className="p-4 text-center text-sm text-slate-500">Cargando...</div>
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
                                      setShowValidation(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-5 py-3.5 transition-colors text-left border-b border-slate-800/50 last:border-none ${categoryId === cat.id ? 'bg-blue-600/10' : 'hover:bg-slate-800'}`}
                                    role="option"
                                    aria-selected={categoryId === cat.id}
                                  >
                                    <div className={`p-1.5 rounded-lg ${categoryId === cat.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-blue-400'}`}>
                                      <DynamicIcon name={cat.icon} size={14} />
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

                    {/* Selector de Fecha */}
                    <div className="space-y-2 text-white">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-30 ml-1">Fecha</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" />
                        <input 
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 p-4 pl-11 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm [color-scheme:dark]"
                        />
                      </div>
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
                        className="w-full bg-slate-900 border border-slate-800 p-4 pl-10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-xl tabular-nums placeholder:text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] text-white mt-4 ${loading ? 'opacity-50 cursor-not-allowed bg-slate-800' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Guardando...
                    </span>
                  ) : (transactionToEdit ? "Guardar Cambios" : "Confirmar Movimiento")}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}