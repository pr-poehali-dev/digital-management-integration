import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── ТИПЫ ─────────────────────────────────────────────────────────────────────
type SignalLevel = "ok" | "warn" | "crit";
type DashboardId = "monitoring" | "tk";

// ─── ДАННЫЕ: МОНИТОРИНГ СТРОЙКИ ───────────────────────────────────────────────
const PROJECTS = [
  { id: 1, name: "ЖК «Северный парк»", address: "ул. Лесная, 12", stage: "Монолит — 14 эт.", manager: "Карпов А.В." },
  { id: 2, name: "ЖК «Речной квартал»", address: "пр. Набережный, 5", stage: "Фасад — секц. Б", manager: "Никитина О.С." },
  { id: 3, name: "БЦ «Орион»", address: "ул. Промышленная, 3", stage: "Инженерия — 4 эт.", manager: "Власов Д.Е." },
];

interface Signal {
  id: number; project: string; block: "стройка" | "финансы" | "продажи";
  text: string; level: SignalLevel; time: string; responsible: string;
}
const SIGNALS: Signal[] = [
  { id: 1, project: "ЖК «Северный парк»", block: "стройка", text: "Отставание от графика монолита +18 дней", level: "crit", time: "09:14", responsible: "Карпов А.В." },
  { id: 2, project: "ЖК «Речной квартал»", block: "финансы", text: "Превышение себестоимости кв.м. на 7,2%", level: "warn", time: "08:50", responsible: "Никитина О.С." },
  { id: 3, project: "БЦ «Орион»", block: "продажи", text: "Темп продаж ниже плана на 31%", level: "crit", time: "08:30", responsible: "Власов Д.Е." },
  { id: 4, project: "ЖК «Северный парк»", block: "финансы", text: "Смета по фундаменту в допустимых пределах", level: "ok", time: "вчера", responsible: "Карпов А.В." },
  { id: 5, project: "ЖК «Речной квартал»", block: "стройка", text: "Завершён монтаж перекрытий 11-го этажа", level: "ok", time: "вчера", responsible: "Никитина О.С." },
];
const METRICS = [
  { label: "Объектов в работе", value: "3", sub: "по 2 городам", icon: "Building2" },
  { label: "Критических сигналов", value: "2", sub: "требуют решения", icon: "AlertTriangle", level: "crit" as SignalLevel },
  { label: "Предупреждений", value: "1", sub: "на контроле", icon: "AlertCircle", level: "warn" as SignalLevel },
  { label: "Норма", value: "2", sub: "отклонений нет", icon: "CheckCircle2", level: "ok" as SignalLevel },
];
const PROGRESS = [
  { project: "ЖК «Северный парк»", plan: 62, fact: 48, cost_plan: 1840, cost_fact: 1974, sales_plan: 71, sales_fact: 58 },
  { project: "ЖК «Речной квартал»", plan: 81, fact: 80, cost_plan: 2100, cost_fact: 2251, sales_plan: 88, sales_fact: 72 },
  { project: "БЦ «Орион»", plan: 55, fact: 54, cost_plan: 3200, cost_fact: 3190, sales_plan: 40, sales_fact: 28 },
];

// ─── ДАННЫЕ: УПРАВЛЯЕМОСТЬ ТК ─────────────────────────────────────────────────
interface Carrier {
  id: number; name: string; type: string; region: string;
  trips_plan: number; trips_fact: number;
  fuel_plan: number; fuel_fact: number;
  drivers_total: number; drivers_active: number;
  violations: number; rating: number;
}
const CARRIERS: Carrier[] = [
  { id: 1, name: "ТК «ЛогиСтрой»", type: "Бетоновозы", region: "Москва", trips_plan: 120, trips_fact: 108, fuel_plan: 8400, fuel_fact: 9120, drivers_total: 18, drivers_active: 15, violations: 3, rating: 4.2 },
  { id: 2, name: "ТК «СевТранс»", type: "Самосвалы", region: "Москва", trips_plan: 95, trips_fact: 94, fuel_plan: 6650, fuel_fact: 6580, drivers_total: 14, drivers_active: 14, violations: 0, rating: 4.8 },
  { id: 3, name: "ТК «АвтоГрейд»", type: "Кран. техника", region: "СПб", trips_plan: 40, trips_fact: 27, fuel_plan: 4200, fuel_fact: 4950, drivers_total: 8, drivers_active: 5, violations: 5, rating: 3.1 },
  { id: 4, name: "ТК «ПромВектор»", type: "Бортовые", region: "СПб", trips_plan: 68, trips_fact: 65, fuel_plan: 4760, fuel_fact: 4810, drivers_total: 10, drivers_active: 9, violations: 1, rating: 4.5 },
];

interface TkSignal { id: number; carrier: string; text: string; level: SignalLevel; time: string; }
const TK_SIGNALS: TkSignal[] = [
  { id: 1, carrier: "ТК «АвтоГрейд»", text: "Выполнение рейсов 67% — критическое отставание от плана", level: "crit", time: "09:22" },
  { id: 2, carrier: "ТК «АвтоГрейд»", text: "Перерасход топлива +17,9% от нормы", level: "crit", time: "09:10" },
  { id: 3, carrier: "ТК «ЛогиСтрой»", text: "3 нарушения ПДД за период — требуется разбор", level: "warn", time: "08:45" },
  { id: 4, carrier: "ТК «ЛогиСтрой»", text: "Выполнение рейсов 90% — незначительное отставание", level: "warn", time: "08:30" },
  { id: 5, carrier: "ТК «СевТранс»", text: "Все рейсы выполнены, нарушений нет", level: "ok", time: "08:00" },
];
const TK_METRICS = [
  { label: "Транспортных компаний", value: "4", sub: "2 региона", icon: "Truck" },
  { label: "Выполнение рейсов", value: "89%", sub: "план 323 / факт 294", icon: "Route", level: "warn" as SignalLevel },
  { label: "Критических нарушений", value: "2", sub: "требуют решения", icon: "AlertTriangle", level: "crit" as SignalLevel },
  { label: "Средний рейтинг ТК", value: "4,2", sub: "из 5.0", icon: "Star", level: "ok" as SignalLevel },
];

// ─── ВСПОМОГАТЕЛЬНЫЕ ─────────────────────────────────────────────────────────
const BLOCK_LABELS: Record<string, string> = { стройка: "Стройка", финансы: "Финансы", продажи: "Продажи" };

function levelClass(level: SignalLevel) {
  if (level === "crit") return { text: "status-crit", bg: "bg-status-crit", border: "border-status-crit", dot: "dot-crit" };
  if (level === "warn") return { text: "status-warn", bg: "bg-status-warn", border: "border-status-warn", dot: "dot-warn" };
  return { text: "status-ok", bg: "bg-status-ok", border: "border-status-ok", dot: "dot-ok" };
}
function levelLabel(level: SignalLevel) {
  if (level === "crit") return "Критично";
  if (level === "warn") return "Внимание";
  return "Норма";
}

function ProgressBar({ value, max = 100, level }: { value: number; max?: number; level: SignalLevel }) {
  const pct = Math.min((value / max) * 100, 100);
  const colors = { ok: "bg-green-500", warn: "bg-amber-500", crit: "bg-red-500" };
  return (
    <div className="relative h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${colors[level]}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function RatingDots({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= Math.round(value) ? "bg-blue-500" : "bg-muted"}`} />
      ))}
      <span className="text-[11px] font-mono ml-1.5 text-foreground">{value.toFixed(1)}</span>
    </div>
  );
}

// ─── ДАШБОРД 1: МОНИТОРИНГ СТРОЙКИ ───────────────────────────────────────────
function MonitoringDashboard() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [dismissedSignals, setDismissedSignals] = useState<number[]>([]);

  const filteredSignals = SIGNALS.filter(
    (s) =>
      !dismissedSignals.includes(s.id) &&
      (activeProject === null || s.project === PROJECTS.find((p) => p.id === activeProject)?.name) &&
      (activeBlock === null || s.block === activeBlock)
  );
  const filteredProgress = PROGRESS.filter(
    (p) => activeProject === null || p.project === PROJECTS.find((pr) => pr.id === activeProject)?.name
  );

  return (
    <div className="px-8 py-6 space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-4 gap-4">
        {METRICS.map((m, i) => {
          const cls = m.level ? levelClass(m.level) : null;
          return (
            <div key={i} className={`bg-card border rounded p-4 flex items-start gap-3 animate-fade-in ${cls ? `${cls.border} border-l-2` : "border-border"}`} style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
              <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${cls ? cls.bg : "bg-muted"}`}>
                <Icon name={m.icon} size={18} className={cls ? cls.text : "text-muted-foreground"} />
              </div>
              <div>
                <p className={`text-2xl font-bold leading-none ${cls ? cls.text : "text-foreground"}`}>{m.value}</p>
                <p className="text-[11px] font-medium text-foreground mt-1">{m.label}</p>
                <p className="text-[10px] text-muted-foreground">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>
        <div className="space-y-5">
          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">Объект:</span>
            {[{ id: null, name: "Все" }, ...PROJECTS.map(p => ({ id: p.id, name: p.name }))].map((opt) => (
              <button key={opt.id ?? "all"} onClick={() => setActiveProject(opt.id as number | null)}
                className="text-xs px-3 py-1 rounded border transition-colors"
                style={activeProject === opt.id ? { background: "hsl(220, 55%, 22%)", color: "#fff", borderColor: "hsl(220, 55%, 22%)" } : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                {opt.name}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Прогресс строительства</h2>
              <span className="text-[11px] text-muted-foreground">план / факт</span>
            </div>
            <div className="divide-y divide-border">
              {filteredProgress.map((row, i) => {
                const buildLevel: SignalLevel = row.fact < row.plan - 10 ? "crit" : row.fact < row.plan - 3 ? "warn" : "ok";
                const costLevel: SignalLevel = row.cost_fact > row.cost_plan * 1.05 ? "crit" : row.cost_fact > row.cost_plan * 1.02 ? "warn" : "ok";
                const salesLevel: SignalLevel = row.sales_fact < row.sales_plan * 0.7 ? "crit" : row.sales_fact < row.sales_plan * 0.85 ? "warn" : "ok";
                return (
                  <div key={i} className="px-5 py-4 animate-fade-in" style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-foreground">{row.project}</p>
                      <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${buildLevel === "crit" ? "bg-status-crit status-crit" : buildLevel === "warn" ? "bg-status-warn status-warn" : "bg-status-ok status-ok"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${buildLevel !== "ok" ? "animate-pulse-dot" : ""} ${buildLevel === "crit" ? "dot-crit" : buildLevel === "warn" ? "dot-warn" : "dot-ok"}`} />
                        {levelLabel(buildLevel)}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Стройка</span>
                          <span className="text-[11px] font-mono"><span className={levelClass(buildLevel).text}>{row.fact}%</span><span className="text-muted-foreground"> / {row.plan}%</span></span>
                        </div>
                        <ProgressBar value={row.fact} level={buildLevel} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Себест.</span>
                          <span className={`text-[11px] font-mono ${levelClass(costLevel).text}`}>{row.cost_fact.toLocaleString("ru")} ₽</span>
                        </div>
                        <ProgressBar value={row.cost_fact} max={row.cost_plan * 1.15} level={costLevel} />
                        <p className="text-[10px] text-muted-foreground mt-1">план {row.cost_plan.toLocaleString("ru")} ₽</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Продажи</span>
                          <span className="text-[11px] font-mono"><span className={levelClass(salesLevel).text}>{row.sales_fact}%</span><span className="text-muted-foreground"> / {row.sales_plan}%</span></span>
                        </div>
                        <ProgressBar value={row.sales_fact} level={salesLevel} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Objects table */}
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Объекты</h2>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Название", "Адрес", "Стадия", "ГИП"].map((h) => (
                    <th key={h} className="text-left px-5 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {PROJECTS.map((p) => (
                  <tr key={p.id} onClick={() => setActiveProject(activeProject === p.id ? null : p.id)}
                    className="cursor-pointer transition-colors hover:bg-muted/50"
                    style={activeProject === p.id ? { background: "hsl(220, 55%, 22%, 0.05)" } : {}}>
                    <td className="px-5 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.address}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.stage}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.manager}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right — Signals */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Сигналы отклонений</h2>
              <div className="flex gap-1">
                {["все", "стройка", "финансы", "продажи"].map((b) => (
                  <button key={b} onClick={() => setActiveBlock(b === "все" ? null : b)}
                    className="text-[10px] px-2 py-0.5 rounded transition-colors"
                    style={(b === "все" && activeBlock === null) || activeBlock === b
                      ? { background: "hsl(220, 55%, 22%)", color: "#fff" }
                      : { color: "hsl(var(--muted-foreground))" }}>
                    {b === "все" ? "Все" : BLOCK_LABELS[b]}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-border" style={{ maxHeight: 520, overflowY: "auto" }}>
              {filteredSignals.length === 0 && (
                <div className="px-5 py-8 text-center text-xs text-muted-foreground">
                  <Icon name="CheckCircle2" size={28} className="mx-auto mb-2 status-ok" />
                  Нет активных сигналов
                </div>
              )}
              {filteredSignals.map((s, i) => {
                const cls = levelClass(s.level);
                return (
                  <div key={s.id} className={`px-4 py-3.5 border-l-2 ${cls.border} animate-slide-in-right`}
                    style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${s.level !== "ok" ? "animate-pulse" : ""} ${cls.dot}`} />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-foreground leading-snug">{s.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{s.project} · {s.time}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${cls.bg} ${cls.text}`}>{levelLabel(s.level)}</span>
                            <span className="text-[10px] text-muted-foreground">{BLOCK_LABELS[s.block]}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => setDismissedSignals((prev) => [...prev, s.id])}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                        <Icon name="X" size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ДАШБОРД 2: УПРАВЛЯЕМОСТЬ ТК ─────────────────────────────────────────────
function TkDashboard() {
  const [activeCarrier, setActiveCarrier] = useState<number | null>(null);
  const [dismissedTk, setDismissedTk] = useState<number[]>([]);

  const filteredSignals = TK_SIGNALS.filter(
    s => !dismissedTk.includes(s.id) &&
    (activeCarrier === null || s.carrier === CARRIERS.find(c => c.id === activeCarrier)?.name)
  );
  const filteredCarriers = activeCarrier === null ? CARRIERS : CARRIERS.filter(c => c.id === activeCarrier);

  return (
    <div className="px-8 py-6 space-y-6">
      {/* KPI */}
      <div className="grid grid-cols-4 gap-4">
        {TK_METRICS.map((m, i) => {
          const cls = m.level ? levelClass(m.level) : null;
          return (
            <div key={i} className={`bg-card border rounded p-4 flex items-start gap-3 animate-fade-in ${cls ? `${cls.border} border-l-2` : "border-border"}`} style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
              <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${cls ? cls.bg : "bg-muted"}`}>
                <Icon name={m.icon} size={18} className={cls ? cls.text : "text-muted-foreground"} />
              </div>
              <div>
                <p className={`text-2xl font-bold leading-none ${cls ? cls.text : "text-foreground"}`}>{m.value}</p>
                <p className="text-[11px] font-medium text-foreground mt-1">{m.label}</p>
                <p className="text-[10px] text-muted-foreground">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 340px" }}>
        <div className="space-y-5">
          {/* Carrier filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">ТК:</span>
            {[{ id: null, name: "Все" }, ...CARRIERS.map(c => ({ id: c.id, name: c.name }))].map((opt) => (
              <button key={opt.id ?? "all"} onClick={() => setActiveCarrier(opt.id as number | null)}
                className="text-xs px-3 py-1 rounded border transition-colors"
                style={activeCarrier === opt.id ? { background: "hsl(220, 55%, 22%)", color: "#fff", borderColor: "hsl(220, 55%, 22%)" } : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                {opt.name}
              </button>
            ))}
          </div>

          {/* Carrier cards */}
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Показатели транспортных компаний</h2>
              <span className="text-[11px] text-muted-foreground">план / факт</span>
            </div>
            <div className="divide-y divide-border">
              {filteredCarriers.map((c, i) => {
                const tripLevel: SignalLevel = c.trips_fact / c.trips_plan < 0.75 ? "crit" : c.trips_fact / c.trips_plan < 0.9 ? "warn" : "ok";
                const fuelLevel: SignalLevel = c.fuel_fact / c.fuel_plan > 1.1 ? "crit" : c.fuel_fact / c.fuel_plan > 1.04 ? "warn" : "ok";
                const driverLevel: SignalLevel = c.drivers_active / c.drivers_total < 0.7 ? "crit" : c.drivers_active / c.drivers_total < 0.85 ? "warn" : "ok";
                const overallLevel: SignalLevel = [tripLevel, fuelLevel, driverLevel].includes("crit") ? "crit" : [tripLevel, fuelLevel, driverLevel].includes("warn") ? "warn" : "ok";
                return (
                  <div key={c.id} className="px-5 py-4 animate-fade-in" style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.type} · {c.region}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.violations > 0 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-status-warn status-warn">
                            {c.violations} нар.
                          </span>
                        )}
                        <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${overallLevel === "crit" ? "bg-status-crit status-crit" : overallLevel === "warn" ? "bg-status-warn status-warn" : "bg-status-ok status-ok"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${overallLevel !== "ok" ? "animate-pulse-dot" : ""} ${overallLevel === "crit" ? "dot-crit" : overallLevel === "warn" ? "dot-warn" : "dot-ok"}`} />
                          {levelLabel(overallLevel)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {/* Рейсы */}
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Рейсы</span>
                          <span className="text-[11px] font-mono">
                            <span className={levelClass(tripLevel).text}>{c.trips_fact}</span>
                            <span className="text-muted-foreground"> / {c.trips_plan}</span>
                          </span>
                        </div>
                        <ProgressBar value={c.trips_fact} max={c.trips_plan} level={tripLevel} />
                        <p className="text-[10px] text-muted-foreground mt-1">{Math.round(c.trips_fact / c.trips_plan * 100)}% от плана</p>
                      </div>
                      {/* Топливо */}
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Топливо</span>
                          <span className={`text-[11px] font-mono ${levelClass(fuelLevel).text}`}>{c.fuel_fact.toLocaleString("ru")} л</span>
                        </div>
                        <ProgressBar value={c.fuel_fact} max={c.fuel_plan * 1.2} level={fuelLevel} />
                        <p className="text-[10px] text-muted-foreground mt-1">план {c.fuel_plan.toLocaleString("ru")} л</p>
                      </div>
                      {/* Водители */}
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Водители</span>
                          <span className="text-[11px] font-mono">
                            <span className={levelClass(driverLevel).text}>{c.drivers_active}</span>
                            <span className="text-muted-foreground"> / {c.drivers_total}</span>
                          </span>
                        </div>
                        <ProgressBar value={c.drivers_active} max={c.drivers_total} level={driverLevel} />
                        <p className="text-[10px] text-muted-foreground mt-1">активных на линии</p>
                      </div>
                      {/* Рейтинг */}
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide block mb-2">Рейтинг</span>
                        <RatingDots value={c.rating} />
                        <p className="text-[10px] text-muted-foreground mt-1.5">надёжность ТК</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carriers table */}
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Список ТК</h2>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  {["Компания", "Тип техники", "Регион", "Рейсы ф/п", "Нарушения", "Рейтинг"].map((h) => (
                    <th key={h} className="text-left px-5 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CARRIERS.map((c) => {
                  const tripLevel: SignalLevel = c.trips_fact / c.trips_plan < 0.75 ? "crit" : c.trips_fact / c.trips_plan < 0.9 ? "warn" : "ok";
                  return (
                    <tr key={c.id} onClick={() => setActiveCarrier(activeCarrier === c.id ? null : c.id)}
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      style={activeCarrier === c.id ? { background: "hsl(220, 55%, 22%, 0.05)" } : {}}>
                      <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.type}</td>
                      <td className="px-5 py-3 text-muted-foreground">{c.region}</td>
                      <td className="px-5 py-3 font-mono">
                        <span className={levelClass(tripLevel).text}>{c.trips_fact}</span>
                        <span className="text-muted-foreground"> / {c.trips_plan}</span>
                      </td>
                      <td className="px-5 py-3">
                        {c.violations > 0
                          ? <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-status-warn status-warn">{c.violations}</span>
                          : <span className="text-[10px] status-ok">—</span>}
                      </td>
                      <td className="px-5 py-3"><RatingDots value={c.rating} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right — TK Signals */}
        <div>
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Сигналы по ТК</h2>
              <span className="text-[11px] text-muted-foreground">{filteredSignals.length} активных</span>
            </div>
            <div className="divide-y divide-border" style={{ maxHeight: 520, overflowY: "auto" }}>
              {filteredSignals.length === 0 && (
                <div className="px-5 py-8 text-center text-xs text-muted-foreground">
                  <Icon name="CheckCircle2" size={28} className="mx-auto mb-2 status-ok" />
                  Нет активных сигналов
                </div>
              )}
              {filteredSignals.map((s, i) => {
                const cls = levelClass(s.level);
                return (
                  <div key={s.id} className={`px-4 py-3.5 border-l-2 ${cls.border} animate-slide-in-right`}
                    style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${s.level !== "ok" ? "animate-pulse" : ""} ${cls.dot}`} />
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium text-foreground leading-snug">{s.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{s.carrier} · {s.time}</p>
                          <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-sm font-medium mt-1 ${cls.bg} ${cls.text}`}>{levelLabel(s.level)}</span>
                        </div>
                      </div>
                      <button onClick={() => setDismissedTk(prev => [...prev, s.id])}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                        <Icon name="X" size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────────────────────
const DASHBOARDS: { id: DashboardId; label: string; icon: string; sub: string }[] = [
  { id: "monitoring", label: "Мониторинг стройки", icon: "Building2", sub: "Прогресс объектов и сигналы" },
  { id: "tk", label: "Управляемость ТК", icon: "Truck", sub: "Транспортные компании" },
];

export default function Index() {
  const [activeDash, setActiveDash] = useState<DashboardId>("monitoring");

  return (
    <div className="min-h-screen flex bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col" style={{ background: "hsl(220, 28%, 14%)", borderRight: "1px solid hsl(220, 22%, 20%)" }}>
        <div className="px-5 pt-6 pb-5" style={{ borderBottom: "1px solid hsl(220, 22%, 20%)" }}>
          <div className="flex items-center gap-2.5 mb-0.5">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "hsl(214, 80%, 56%)" }}>
              <Icon name="Building" size={15} className="text-white" />
            </div>
            <span className="font-semibold text-sm tracking-wide" style={{ color: "hsl(210, 30%, 85%)" }}>ControlBuild</span>
          </div>
          <p className="text-[11px] pl-9 tracking-wide" style={{ color: "hsl(210, 20%, 42%)" }}>Управление стройкой</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {[
            { icon: "LayoutDashboard", label: "Дашборды", active: true },
            { icon: "Building2", label: "Объекты" },
            { icon: "Truck", label: "Транспорт" },
            { icon: "Bell", label: "Сигналы" },
            { icon: "BarChart2", label: "Аналитика" },
            { icon: "FileText", label: "Отчёты" },
            { icon: "Users", label: "Команда" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors"
              style={item.active ? { background: "hsl(214, 80%, 56%, 0.15)", color: "hsl(214, 80%, 72%)", fontWeight: 500 } : { color: "hsl(210, 20%, 55%)" }}>
              <Icon name={item.icon} size={16} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-3 pb-5 pt-4" style={{ borderTop: "1px solid hsl(220, 22%, 20%)" }}>
          <div className="flex items-center gap-2.5 px-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "hsl(220, 22%, 22%)" }}>
              <span className="text-[10px] font-semibold" style={{ color: "hsl(210, 30%, 80%)" }}>АК</span>
            </div>
            <div>
              <p className="text-[12px] font-medium" style={{ color: "hsl(210, 30%, 80%)" }}>А. Карпов</p>
              <p className="text-[10px]" style={{ color: "hsl(210, 20%, 40%)" }}>Директор по стройке</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border px-8 py-3.5" style={{ background: "hsl(216, 22%, 97%, 0.97)", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-base font-semibold text-foreground tracking-tight">
                {DASHBOARDS.find(d => d.id === activeDash)?.label}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">23 марта 2026 · Данные обновлены 09:17</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded border border-border transition-colors">
                <Icon name="RefreshCw" size={13} />
                Обновить
              </button>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-colors" style={{ background: "hsl(220, 55%, 22%)", color: "#fff" }}>
                <Icon name="Download" size={13} />
                Экспорт
              </button>
            </div>
          </div>

          {/* Dashboard switcher */}
          <div className="flex items-center gap-1.5">
            {DASHBOARDS.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDash(d.id)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all"
                style={activeDash === d.id
                  ? { background: "hsl(220, 55%, 22%)", color: "#fff" }
                  : { background: "transparent", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }
                }
              >
                <Icon name={d.icon} size={13} />
                {d.label}
              </button>
            ))}
          </div>
        </header>

        {/* Dashboard content */}
        {activeDash === "monitoring" && <MonitoringDashboard />}
        {activeDash === "tk" && <TkDashboard />}
      </main>
    </div>
  );
}
