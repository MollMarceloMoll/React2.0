import { useState, useEffect, useCallback, useRef } from "react";
import { TrendingUp, ArrowUpRight, Calendar, X } from "lucide-react";
import {
  getResumen,
  getGrafico,
  getTopProductos,
  getActividadReciente,
} from "../api/reportes";

// ─── Types ────────────────────────────────────────────────────────────────────
type Periodo = "hoy" | "7d" | "mes" | "año" | "personalizado";

interface Resumen {
  total_ventas: number;
  ganancia_total: number;
  ticket_promedio: number;
  descuentos_total: number;
  ganancia_real_unitaria: number;
  ganancia_real_por_kilo: number;
}

interface PuntoGrafico {
  fecha: string;
  ingresos: number;
  ventas: number;
  ganancia_real_unitaria: number;
  ganancia_real_por_kilo: number;
}

interface TopProducto {
  id: number;
  nombre: string;
  categoria: string;
  precio_venta: number;
  precio_compra: number;
  precio_venta_kg: number;
  peso_bolsa_kg: number;
  total_cantidad: number;
  total_ingresos: number;
  num_ventas: number;
  ganancia_real_unitaria: number;
  ganancia_real_por_kilo: number;
}

interface Actividad {
  id: number;
  nombre_cliente: string;
  total: number;
  metodo_pago: string;
  fecha: string;
  vendedor: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

const tiempoRelativo = (fecha: string) => {
  const diff = (Date.now() - new Date(fecha).getTime()) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const iniciales = (nombre: string) =>
  nombre.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();

const avatarColor = (nombre: string) => {
  const colors = ["#6366f1","#8b5cf6","#ec4899","#14b8a6","#f59e0b","#10b981","#3b82f6"];
  let hash = 0;
  for (const c of nombre) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const categoriaEmoji: Record<string, string> = {
  mascota: "🐶",
  granja: "🌾",
  accesorio: "🎀",
  veterinaria: "💊",
};

// ─── Calendar Picker Component ────────────────────────────────────────────────
interface DateRange {
  desde: string;
  hasta: string;
}

function CalendarPicker({
  dateRange,
  setDateRange,
  onApply,
}: {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  onApply: () => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingFrom, setSelectingFrom] = useState(true);
  const calendarRef = useRef<HTMLDivElement>(null);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = selected.toISOString().split('T')[0];

    if (selectingFrom) {
      setDateRange({ ...dateRange, desde: dateStr });
      setSelectingFrom(false);
    } else {
      if (new Date(dateStr) < new Date(dateRange.desde)) {
        setDateRange({ desde: dateStr, hasta: dateRange.desde });
      } else {
        setDateRange({ ...dateRange, hasta: dateStr });
      }
      setSelectingFrom(true);
    }
  };

  const isDateInRange = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    
    if (!dateRange.desde || !dateRange.hasta) return false;
    
    const date = new Date(dateStr);
    const from = new Date(dateRange.desde);
    const to = new Date(dateRange.hasta);
    
    return date >= from && date <= to;
  };

  const isDateSelected = (day: number) => {
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return dateStr === dateRange.desde || dateStr === dateRange.hasta;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const monthName = currentMonth.toLocaleString("es-AR", { month: "long", year: "numeric" });

  return (
    <div ref={calendarRef} className="bg-slate-900 border border-slate-800 rounded-xl p-4 w-80">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="text-slate-400 hover:text-white transition text-sm"
        >
          ← Anterior
        </button>
        <span className="text-white font-semibold capitalize">{monthName}</span>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="text-slate-400 hover:text-white transition text-sm"
        >
          Siguiente →
        </button>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sab'].map((day) => (
          <div key={day} className="text-center text-xs text-slate-500 font-semibold py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const isSelected = isDateSelected(day);
          const isInRange = isDateInRange(day);
          
          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square rounded text-sm font-medium transition
                ${isSelected
                  ? 'bg-indigo-600 text-white'
                  : isInRange
                  ? 'bg-indigo-600/30 text-indigo-200'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected Range Display */}
      <div className="mb-4 p-3 bg-slate-800 rounded-lg text-xs">
        <p className="text-slate-400 mb-1">Período seleccionado:</p>
        <p className="text-white font-semibold">
          {dateRange.desde && dateRange.hasta
            ? `${new Date(dateRange.desde).toLocaleDateString('es-AR')} - ${new Date(dateRange.hasta).toLocaleDateString('es-AR')}`
            : dateRange.desde
            ? `Desde: ${new Date(dateRange.desde).toLocaleDateString('es-AR')}`
            : 'Selecciona un rango'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setDateRange({ desde: '', hasta: '' });
            setSelectingFrom(true);
          }}
          className="flex-1 text-xs px-3 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
        >
          Limpiar
        </button>
        <button
          onClick={onApply}
          disabled={!dateRange.desde || !dateRange.hasta}
          className="flex-1 text-xs px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Aplicar
        </button>
      </div>
    </div>
  );
}

// ─── Mini SVG Line Chart ──────���────────────────────────────────────────────────
function LineChart({
  data,
  campo,
  color,
  label,
}: {
  data: PuntoGrafico[];
  campo: "ingresos" | "ventas" | "ganancia_real_unitaria" | "ganancia_real_por_kilo";
  color: string;
  label: string;
}) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; idx: number } | null>(null);

  if (!data.length) return <div className="h-48 flex items-center justify-center text-slate-600 text-sm">Sin datos</div>;

  const valores = data.map(d => Number(d[campo]));
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min || 1;

  const W = 560;
  const H = 140;
  const PAD = { top: 16, right: 16, bottom: 32, left: 12 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const px = (i: number) => PAD.left + (i / (data.length - 1 || 1)) * innerW;
  const py = (v: number) => PAD.top + innerH - ((v - min) / rango) * innerH;

  const pathD = data.map((d, i) => `${i === 0 ? "M" : "L"} ${px(i)} ${py(Number(d[campo]))}`).join(" ");
  const areaD = `${pathD} L ${px(data.length - 1)} ${H - PAD.bottom} L ${px(0)} ${H - PAD.bottom} Z`;

  const yLabels = [min, min + rango / 2, max];

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id={`grad-${campo}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {yLabels.map((v, i) => {
          const y = py(v);
          return (
            <g key={i}>
              <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              <text x={PAD.left - 4} y={y + 4} fill="#475569" fontSize="9" textAnchor="end">
                {(campo === "ingresos" || campo === "ganancia_real_unitaria" || campo === "ganancia_real_por_kilo") 
                  ? `$${(v / 1000).toFixed(0)}k` 
                  : Math.round(v)}
              </text>
            </g>
          );
        })}

        <path d={areaD} fill={`url(#grad-${campo})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => {
          if (data.length > 10 && i % 2 !== 0) return null;
          const fecha = new Date(d.fecha + "T00:00:00");
          const label = `${fecha.getDate()} ${fecha.toLocaleString("es", { month: "short" })}`;
          return (
            <text key={i} x={px(i)} y={H - 4} fill="#475569" fontSize="9" textAnchor="middle">
              {label}
            </text>
          );
        })}

        {data.map((d, i) => (
          <circle
            key={i}
            cx={px(i)}
            cy={py(Number(d[campo]))}
            r="10"
            fill="transparent"
            onMouseEnter={() => setTooltip({ x: px(i), y: py(Number(d[campo])), idx: i })}
          />
        ))}

        {tooltip && (
          <>
            <line x1={px(tooltip.idx)} y1={PAD.top} x2={px(tooltip.idx)} y2={H - PAD.bottom} stroke={color} strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
            <circle cx={px(tooltip.idx)} cy={py(Number(data[tooltip.idx][campo]))} r="5" fill={color} stroke="#0f172a" strokeWidth="2" />
          </>
        )}
      </svg>

      {tooltip && (() => {
        const d = data[tooltip.idx];
        const fecha = new Date(d.fecha + "T00:00:00");
        const val = Number(d[campo]);
        return (
          <div
            className="absolute z-10 pointer-events-none"
            style={{
              left: `${(tooltip.x / W) * 100}%`,
              top: `${(tooltip.y / H) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl whitespace-nowrap">
              <p className="text-slate-400 mb-1">
                {fecha.getDate()} {fecha.toLocaleString("es", { month: "short" })}
              </p>
              <p className="font-semibold" style={{ color }}>
                {(campo === "ingresos" || campo === "ganancia_real_unitaria" || campo === "ganancia_real_por_kilo") 
                  ? fmt(val) 
                  : `${Math.round(val)} ventas`}
              </p>
            </div>
          </div>
        );
      })()}

      <div className="flex items-center gap-2 mt-2 px-1">
        <div className="w-3 h-0.5 rounded" style={{ background: color }} />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-800 rounded-lg ${className}`} />
);

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, loading }: { label: string; value: string; sub?: string; loading: boolean }) {
  if (loading) return <Skeleton className="h-24" />;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-1">
      <span className="text-slate-400 text-xs uppercase tracking-wider">{label}</span>
      <span className="text-white text-2xl font-bold">{value}</span>
      {sub && <span className="text-slate-500 text-xs">{sub}</span>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Reportes() {
  const [periodo, setPeriodo] = useState<Periodo>("7d");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ desde: '', hasta: '' });
  const [resumen, setResumen] = useState<Resumen | null>(null);
  const [grafico, setGrafico] = useState<PuntoGrafico[]>([]);
  const [topProductos, setTopProductos] = useState<TopProducto[]>([]);
  const [actividad, setActividad] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = periodo === "personalizado" 
        ? `?periodo=personalizado&desde=${dateRange.desde}&hasta=${dateRange.hasta}`
        : `?periodo=${periodo}`;

      const [r, g, t, a] = await Promise.all([
        getResumen(queryParams),
        getGrafico(queryParams),
        getTopProductos(queryParams, 5),
        getActividadReciente(8),
      ]);
      setResumen(r);
      setGrafico(g);
      setTopProductos(t);
      setActividad(a);
    } catch {
      setError("Error al cargar los reportes. Verificá la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [periodo, dateRange]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCalendar]);

  const handleApplyDates = () => {
    setPeriodo("personalizado");
    setShowCalendar(false);
  };

  const maxCantidad = topProductos[0]?.total_cantidad || 1;

  const TABS: { key: Periodo; label: string }[] = [
    { key: "hoy", label: "Hoy" },
    { key: "7d", label: "Últimos 7 Días" },
    { key: "mes", label: "Este Mes" },
    { key: "año", label: "Este Año" },
  ];

  const getPeriodoLabel = () => {
    if (periodo === "personalizado" && dateRange.desde && dateRange.hasta) {
      const desde = new Date(dateRange.desde).toLocaleDateString('es-AR');
      const hasta = new Date(dateRange.hasta).toLocaleDateString('es-AR');
      return `${desde} - ${hasta}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <h1 className="text-xl font-bold text-white">Reportes de Ventas</h1>
        </div>
        <button
          onClick={cargarDatos}
          className="text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 rounded-lg px-3 py-1.5 transition"
        >
          Actualizar
        </button>
      </div>

      {/* Tabs + Calendar */}
      <div className="flex gap-2 mb-6 flex-wrap items-center">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => {
              setPeriodo(t.key);
              setShowCalendar(false);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              periodo === t.key
                ? "bg-indigo-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}

        {/* Calendar Button */}
        <div className="relative">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              periodo === "personalizado"
                ? "bg-indigo-600 text-white"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Personalizado
          </button>

          {/* Calendar Dropdown */}
          {showCalendar && (
            <div className="absolute top-full right-0 mt-2 z-50" ref={calendarRef}>
              <CalendarPicker
                dateRange={dateRange}
                setDateRange={setDateRange}
                onApply={handleApplyDates}
              />
            </div>
          )}
        </div>

        {/* Clear custom date */}
        {periodo === "personalizado" && (
          <button
            onClick={() => {
              setPeriodo("7d");
              setDateRange({ desde: '', hasta: '' });
              setShowCalendar(false);
            }}
            className="text-slate-400 hover:text-white transition"
            title="Limpiar fecha personalizada"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Show current period */}
      {getPeriodoLabel() && (
        <div className="mb-4 text-xs text-slate-400">
          Período: <span className="text-indigo-400 font-semibold">{getPeriodoLabel()}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard
          label="Ganancia Total"
          value={resumen ? fmt(Number(resumen.ganancia_total)) : "$0"}
          loading={loading}
        />
        <KpiCard
          label="Ganancia Real (Unitaria)"
          value={resumen ? fmt(Number(resumen.ganancia_real_unitaria)) : "$0"}
          sub="por unidad"
          loading={loading}
        />
        <KpiCard
          label="Ganancia Real (Por Kilo)"
          value={resumen ? fmt(Number(resumen.ganancia_real_por_kilo)) : "$0"}
          sub="por kilogramo"
          loading={loading}
        />
        <KpiCard
          label="Descuentos"
          value={resumen ? fmt(Number(resumen.descuentos_total)) : "$0"}
          sub="otorgados"
          loading={loading}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* Charts Column */}
        <div className="xl:col-span-2 space-y-4">

          {/* Ganancia Real Unitaria Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Ganancia Real por Unidad</h2>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </div>
            {loading
              ? <Skeleton className="h-40" />
              : <LineChart data={grafico} campo="ganancia_real_unitaria" color="#10b981" label="Ganancia Unitaria ($)" />
            }
          </div>

          {/* Ganancia Real Por Kilo Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Ganancia Real por Kilo</h2>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </div>
            {loading
              ? <Skeleton className="h-40" />
              : <LineChart data={grafico} campo="ganancia_real_por_kilo" color="#f59e0b" label="Ganancia por Kilo ($)" />
            }
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">

          {/* Top Productos */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="font-semibold text-white mb-4">Artículos más Vendidos</h2>
            {loading ? (
              <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
            ) : topProductos.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-6">Sin datos para este período</p>
            ) : (
              <div className="space-y-4">
                {topProductos.map((p, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-base">{categoriaEmoji[p.categoria] ?? "📦"}</span>
                        <span className="text-sm text-white truncate" title={p.nombre}>{p.nombre}</span>
                      </div>
                      <span className="text-xs text-slate-400 ml-2 shrink-0">
                        {Number(p.total_cantidad).toFixed(0)} und.
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full bg-indigo-500 transition-all duration-700"
                        style={{ width: `${(Number(p.total_cantidad) / maxCantidad) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between gap-2 text-xs">
                      <span className="text-emerald-400">Unitaria: {fmt(Number(p.ganancia_real_unitaria))}</span>
                      <span className="text-amber-400">Por Kilo: {fmt(Number(p.ganancia_real_por_kilo))}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actividad Reciente */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Actividad Reciente</h2>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </div>
            {loading ? (
              <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            ) : actividad.length === 0 ? (
              <p className="text-slate-600 text-sm text-center py-6">Sin actividad reciente</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                {actividad.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: avatarColor(a.vendedor || a.nombre_cliente) }}
                    >
                      {iniciales(a.vendedor || a.nombre_cliente)}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{a.vendedor || "—"}</p>
                      <p className="text-xs text-slate-500 truncate">Venta. {a.nombre_cliente}</p>
                    </div>
                    {/* Monto + Tiempo */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-emerald-400">+{fmt(Number(a.total))}</p>
                      <p className="text-xs text-slate-600">{tiempoRelativo(a.fecha)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}