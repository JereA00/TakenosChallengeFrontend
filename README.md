# UCL Draw — Frontend

Interfaz web para visualizar el sorteo de la fase de liga de la UEFA Champions League. Consume la API REST del backend para mostrar partidos, equipos y estadísticas del sorteo.

## Requisitos

- Node.js >= 22.0.0
- npm >= 10.0.0
- El backend debe estar corriendo en `http://localhost:8000`

## Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo
npm run dev
```

La app queda disponible en `http://localhost:3000`.

> **Importante:** el backend (`fullstack-backend-ucl-challenge-main`) debe estar corriendo antes de abrir el frontend. Ver su README para instrucciones de setup.

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción |
| `npm start` | Servidor desde el build de producción |
| `npm run lint` | Verificar errores de código con ESLint |

## Rutas de la aplicación

| URL | Descripción |
|-----|-------------|
| `/` | Redirige a `/draw` |
| `/draw` | Gestión del sorteo — crear, eliminar y ver los bombos |
| `/matches` | Listado general de partidos con filtros y paginación |
| `/teams` | Listado de equipos agrupados por bombo |
| `/teams/:id` | Detalle de un equipo con sus partidos de local y visitante |

---

## Estructura del proyecto

```
ucl-frontend/
├── app/                          ← rutas (App Router de Next.js)
│   ├── layout.tsx                ← HTML base que envuelve todas las páginas
│   ├── page.tsx                  ← ruta "/" → redirige a /matches
│   ├── globals.css               ← estilos globales + importación de Tailwind
│   ├── draw/
│   │   └── page.tsx              ← ruta "/draw" — gestión del sorteo
│   ├── matches/
│   │   └── page.tsx              ← ruta "/matches" — listado de partidos
│   └── teams/
│       ├── page.tsx              ← ruta "/teams" — listado de equipos
│       └── [id]/
│           └── page.tsx          ← ruta "/teams/:id" — detalle de equipo
│
├── components/                   ← componentes reutilizables de UI
│   ├── Header.tsx                ← barra de navegación fija (Sorteo / Partidos / Equipos)
│   ├── MatchCard.tsx             ← tarjeta individual de un partido
│   ├── MatchFilters.tsx          ← selectores de equipo, jornada y local/visitante
│   └── Pagination.tsx            ← controles de paginación
│
├── lib/
│   └── api.ts                    ← cliente HTTP centralizado (todas las llamadas al backend)
│
├── public/                       ← archivos estáticos
├── package.json
└── tsconfig.json
```

### Por qué esta estructura

**`app/` — rutas automáticas**

Next.js convierte cada `page.tsx` dentro de `app/` en una ruta automáticamente. No hay que configurar ningún router. Las carpetas con `[nombre]` entre corchetes son rutas dinámicas: `teams/[id]/page.tsx` responde a `/teams/1`, `/teams/42`, etc.

**`components/` — piezas reutilizables**

Los componentes son fragmentos de UI sin URL propia. `MatchCard` lo usan tanto `/matches` como `/teams/:id` — vivir en `components/` evita duplicarlo. La regla es: si algo aparece en más de una página, va a `components/`.

**`lib/api.ts` — cliente HTTP centralizado**

Todas las llamadas al backend están en un solo archivo. Si cambia la URL base, el token de autenticación, o el formato de los parámetros, se modifica en un solo lugar.

---

## Decisiones técnicas

### `"use client"` en todos los componentes interactivos

Next.js renderiza por defecto en el servidor (SSR). Los componentes que usan `useState`, `useEffect`, o eventos del navegador (`onClick`, `onChange`) necesitan declararse como cliente con `"use client"` al inicio del archivo. Todos los componentes de este proyecto son del lado del cliente porque consumen la API en tiempo real desde el navegador.

### Estado elevado en la página (`lifting state up`)

Los filtros activos (`teamId`, `matchDay`, `page`) viven en `matches/page.tsx`, no en `MatchFilters.tsx`. Esto es porque la página es quien sabe qué hacer cuando cambia un filtro: resetear la paginación, volver a llamar a la API. Los componentes hijos solo muestran los valores y notifican al padre mediante callbacks (`onTeamChange`, `onMatchDayChange`).

### `useCallback` para evitar re-renders infinitos

`fetchMatches` se envuelve en `useCallback` con dependencias `[teamId, matchDay, location, countryName, page]`. Sin esto, cada render crea una función nueva, el `useEffect` que la observa la detecta como cambio y vuelve a llamar a la API indefinidamente.

### CORS habilitado en el backend

El navegador bloquea requests entre orígenes distintos (puerto 3000 → puerto 8000). Se habilitó en el backend agregando el middleware `cors` con `origin: "http://localhost:3000"` en `app.ts`.

### `usePathname` para navegación activa

El `Header` usa `usePathname()` de Next.js para saber en qué ruta está el usuario y resaltar el link correspondiente. Es un hook del cliente, por eso el componente necesita `"use client"`.

### Estado de acción con tipo union en lugar de múltiples booleans

La página `/draw` maneja un tipo `Status = "idle" | "loading" | "creating" | "deleting"` en lugar de variables separadas como `isLoading`, `isCreating`, `isDeleting`. Esto garantiza que solo un estado esté activo a la vez — con booleans separados podrían ser `true` simultáneamente, lo que generaría UI inconsistente.

### `URLSearchParams` para query strings

Los filtros se construyen con `new URLSearchParams()` en lugar de concatenar strings manualmente. Es más seguro (escapa caracteres especiales automáticamente) y más legible.

---

## Funcionalidades implementadas

- **Gestión del sorteo** — crear el sorteo, eliminar con confirmación, ver los 4 bombos con sus equipos
- **Header de navegación** fijo en todas las páginas con indicador de página activa
- **Listado de partidos** con paginación de 18 por página (una jornada completa por página)
- **Filtro por equipo** — muestra solo los partidos de ese equipo
- **Filtro por jornada** — muestra los 18 partidos de esa jornada
- **Filtro local/visitante** — cuando hay equipo seleccionado, filtra solo partidos de local o de visitante
- **Filtro por país** — muestra todos los partidos de cualquier equipo de ese país, sin necesidad de elegir un equipo específico; se envía como `countryName` al backend (filtro server-side, no client-side)
- **Combinación de filtros** — equipo + jornada + local/visitante, o país + jornada, simultáneamente
- **Reset de filtros** — botón que limpia todos los filtros y vuelve a la página 1
- **Listado de equipos** agrupados por bombo (1 al 4)
- **Detalle de equipo** con partidos de local y visitante separados
- **Estado de carga** — spinner animado mientras se espera la respuesta
- **Manejo de errores** — mensaje claro si el backend no responde
- **Estado vacío** — mensaje cuando no hay resultados para los filtros aplicados
