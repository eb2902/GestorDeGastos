# Gestor de Gastos Personales

Un gestor de finanzas moderno, rápido y seguro construido con **Next.js 16**, **Supabase** y **Tailwind CSS 4**. Esta aplicación permite a los usuarios rastrear sus ingresos y gastos, visualizar su distribución financiera, buscar transacciones y gestionar su perfil personal.

## 🚀 Características

-   **Dashboard Interactivo**: Visualización clara del balance actual, ingresos y gastos totales.
-   **Gráficos Dinámicos**: Distribución de gastos por categoría utilizando Recharts.
-   **Filtros Temporales**: Visualiza tus datos por últimos 7 días, mes actual o último año.
-   **Gestión de Transacciones**: Añadir, buscar y eliminar transacciones de forma sencilla.
-   **Página de Transacciones**: Historial completo con búsqueda por descripción y métricas filtradas.
-   **Autenticación Segura**: Sistema de registro e inicio de sesión gestionado por Supabase.
-   **Recuperación de Contraseña**: Flujo completo de "olvidé mi contraseña" y restablecimiento.
-   **Protección de Rutas**: Middleware que redirige automáticamente al login si no hay sesión activa.
-   **Gestión de Perfil**: Personalización del nombre, moneda preferida (USD/ARS) y estadísticas de usuario.
-   **Eliminación de Cuenta**: Opción para borrar permanentemente la cuenta y todos los datos asociados.
-   **Diseño Responsivo**: Experiencia optimizada tanto para dispositivos móviles como para escritorio con sidebar de navegación.

## 🛠️ Tecnologías

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Base de Datos y Auth**: [Supabase](https://supabase.com/)
-   **Estilos**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Iconos**: [Lucide React](https://lucide.dev/)
-   **Gráficos**: [Recharts](https://recharts.org/)
-   **Componentes UI**: Componentes personalizados con Tailwind CSS
-   **Notificaciones**: [Sonner](https://sonner.emilkowal.ski/)
-   **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)

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

4.  **Ejecutar las migraciones de la base de datos (opcional pero recomendado):**
    ```bash
    npx supabase migration up
    ```

5.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

## 🗄️ Estructura del Proyecto

```
/
├── app/                          # Rutas, layouts y lógica de páginas (Next.js App Router)
│   ├── (dashboard)/              # Rutas protegidas que requieren autenticación
│   │   ├── page.tsx              # Dashboard principal con balance y gráficos
│   │   ├── layout.tsx            # Layout con sidebar y responsive
│   │   ├── profile/              # Perfil de usuario (nombre, moneda, estadísticas)
│   │   └── transactions/         # Historial de transacciones con búsqueda
│   ├── actions/                  # Server Actions para transacciones y usuario
│   ├── auth/                     # Callbacks de autenticación (Supabase)
│   ├── login/                    # Página de inicio de sesión
│   ├── signup/                   # Página de registro
│   ├── forgot-password/          # Recuperación de contraseña
│   └── reset-password/           # Restablecimiento de contraseña
├── components/                   # Componentes de React reutilizables
│   ├── auth/                     # Componentes de autenticación (LogoutButton)
│   ├── AddTransactionModal.tsx   # Modal para agregar transacciones
│   ├── ExpenseChart.tsx          # Gráfico de distribución de gastos
│   ├── TransactionSearch.tsx     # Búsqueda de transacciones
│   ├── TransactionTable.tsx      # Tabla de transacciones
│   ├── TimeFilters.tsx           # Filtros temporales (7D, 1M, 1Y)
│   ├── Sidebar.tsx               # Navegación lateral
│   ├── MobileHeader.tsx          # Header para dispositivos móviles
│   ├── ProfileForm.tsx           # Formulario de perfil
│   ├── DeleteAccountButton.tsx   # Eliminación de cuenta
│   └── CopyEmail.tsx             # Copiar email al portapapeles
├── utils/                        # Funciones de utilidad
│   ├── calculations.ts           # Cálculos de métricas financieras
│   ├── formatters.ts             # Formateo de moneda y fechas
│   └── supabase/                 # Clientes de Supabase (client, server, admin)
├── supabase/                     # Configuración de Supabase
│   └── migrations/               # Migraciones de base de datos
├── proxy.ts                      # Middleware de autenticación (refresco de sesión y protección de rutas)
└── public/                       # Archivos estáticos e imágenes
```

## 📜 Scripts

-   `npm run dev`: Inicia el servidor de desarrollo.
-   `npm run build`: Crea la versión de producción de la aplicación.
-   `npm run start`: Inicia la aplicación construida en modo producción.
-   `npm run lint`: Ejecuta ESLint para revisar el código.

---

## 🔗 Enlaces y Contacto

- **Demo en vivo:** [https://gestor-de-gastos-xi.vercel.app/login](https://gestor-de-gastos-xi.vercel.app/login)
- **LinkedIn:** [Ezequiel Busto Hurtado](https://www.linkedin.com/in/ezequiel-busto-hurtado-948639406)