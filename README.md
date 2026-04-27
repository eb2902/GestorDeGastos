# Gestor de Gastos Personales

Un gestor de finanzas moderno, rápido y seguro construido con **Next.js**, **Supabase** y **Tailwind CSS**. Esta aplicación permite a los usuarios rastrear sus ingresos y gastos, visualizar su distribución financiera y gestionar su perfil personal.

## 🚀 Características

-   **Dashboard Interactivo**: Visualización clara del balance actual, ingresos y gastos totales.
-   **Gráficos Dinámicos**: Distribución de gastos por categoría utilizando Recharts.
-   **Gestión de Transacciones**: Añadir, buscar y eliminar transacciones de forma sencilla.
-   **Filtros Temporales**: Visualiza tus datos por últimos 7 días, mes actual o último año.
-   **Autenticación Segura**: Sistema de registro e inicio de sesión gestionado por Supabase.
-   **Gestión de Perfil**: Personalización del nombre y moneda preferida (USD/ARS).
-   **Diseño Responsivo**: Experiencia optimizada tanto para dispositivos móviles como para escritorio.

## 🛠️ Tecnologías

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Base de Datos y Auth**: [Supabase](https://supabase.com/)
-   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
-   **Iconos**: [Lucide React](https://lucide.dev/)
-   **Gráficos**: [Recharts](https://recharts.org/)
-   **Componentes UI**: Radix UI / Shadcn (basado en Tailwind)
-   **Notificaciones**: [Sonner](https://sonner.stevenly.me/)

## 📦 Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/eb2902/GestorDeGastos.git
    cd GestorDeGastos
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto y añade tus credenciales de Supabase:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
    ```

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 🗄️ Estructura del Proyecto

-   `/app`: Rutas, layouts y lógica de páginas (Next.js App Router).
    -   `/(dashboard)`: Rutas protegidas que requieren autenticación.
    -   `/actions`: Server Actions para transacciones y gestión de usuario.
-   `/components`: Componentes de React reutilizables (Tablas, Modales, Gráficos).
-   `/utils`: Funciones de utilidad para formateo de moneda, fechas y cálculos matemáticos.
-   `/public`: Archivos estáticos e imágenes.

## 📜 Scripts

-   `npm run dev`: Inicia el servidor de desarrollo.
-   `npm run build`: Crea la versión de producción de la aplicación.
-   `npm run start`: Inicia la aplicación construida en modo producción.
-   `npm run lint`: Ejecuta ESLint para revisar el código.

---

