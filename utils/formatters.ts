/**
 * Utilidades de formateo para la aplicación.
 */

/**
 * Formatea un número como moneda (predeterminado ARS).
 */
export const formatCurrency = (amount: number, currency: string = 'USD', locale: string = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea solo el valor numérico absoluto, sin símbolo de moneda.
 * Útil para mostrar montos con prefijo de signo manual (+/-).
 */
export const formatAmount = (amount: number, locale: string = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
};

/**
 * Formatea una fecha de forma legible.
 */
export const formatDate = (dateString: string, locale: string = 'es-AR') => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD para inputs de tipo date.
 */
export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0];
};
