import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── ТИПЫ ─────────────────────────────────────────────────────────────────────
type SignalLevel = "ok" | "warn" | "crit";
type DashboardId = "monitoring" | "tk" | "finance" | "objects";
type FinanceSection = "holding" | "mkd" | "tc";

// ─── ДАННЫЕ: МОНИТОРИНГ СТРОЙКИ (МКД) ────────────────────────────────────────
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

// ─── ДАННЫЕ: УПРАВЛЯЕМОСТЬ ТК (ТОРГОВЫЕ КОМПЛЕКСЫ) ───────────────────────────
interface TradingCenter {
  id: number; name: string; address: string; area: number; openYear: number;
  occupancy_plan: number; occupancy_fact: number;
  revenue_plan: number; revenue_fact: number;
  traffic_plan: number; traffic_fact: number;
  arrears: number; incidents: number;
}
const TRADING_CENTERS: TradingCenter[] = [
  { id: 1, name: "ТЦ «Галактика»", address: "пр. Победы, 15", area: 42000, openYear: 2018, occupancy_plan: 95, occupancy_fact: 91, revenue_plan: 18400, revenue_fact: 17200, traffic_plan: 85000, traffic_fact: 79000, arrears: 1240, incidents: 1 },
  { id: 2, name: "ТЦ «Меридиан»", address: "ул. Центральная, 3", area: 28500, openYear: 2021, occupancy_plan: 98, occupancy_fact: 98, revenue_plan: 12600, revenue_fact: 13100, traffic_plan: 56000, traffic_fact: 59200, arrears: 0, incidents: 0 },
  { id: 3, name: "ТЦ «Атриум Парк»", address: "шоссе Северное, 88", area: 61000, openYear: 2015, occupancy_plan: 92, occupancy_fact: 78, revenue_plan: 24800, revenue_fact: 19100, traffic_plan: 110000, traffic_fact: 87000, arrears: 4380, incidents: 4 },
  { id: 4, name: "ТЦ «Нордик»", address: "ул. Лесная, 44", area: 18000, openYear: 2023, occupancy_plan: 88, occupancy_fact: 85, revenue_plan: 7200, revenue_fact: 7050, traffic_plan: 32000, traffic_fact: 30500, arrears: 340, incidents: 0 },
];
interface TcSignal { id: number; tc: string; text: string; level: SignalLevel; time: string; }
const TC_SIGNALS: TcSignal[] = [
  { id: 1, tc: "ТЦ «Атриум Парк»", text: "Заполняемость 78% — критическое снижение ниже порога 80%", level: "crit", time: "09:22" },
  { id: 2, tc: "ТЦ «Атриум Парк»", text: "Выручка ниже плана на 23% — требуется разбор причин", level: "crit", time: "09:10" },
  { id: 3, tc: "ТЦ «Атриум Парк»", text: "Дебиторская задолженность 4 380 тыс. — превышен лимит", level: "crit", time: "08:55" },
  { id: 4, tc: "ТЦ «Галактика»", text: "Заполняемость 91% — незначительное снижение", level: "warn", time: "08:40" },
  { id: 5, tc: "ТЦ «Нордик»", text: "Трафик 95% от плана — в норме", level: "ok", time: "08:20" },
  { id: 6, tc: "ТЦ «Меридиан»", text: "Все показатели выше плана — объект лидер", level: "ok", time: "08:00" },
];
const TC_METRICS = [
  { label: "Торговых комплексов", value: "4", sub: "151 500 м²", icon: "Store" },
  { label: "Средняя заполняемость", value: "88%", sub: "план 93%", icon: "LayoutGrid", level: "warn" as SignalLevel },
  { label: "Выручка факт", value: "56,4 млн", sub: "план 63 млн · −10,5%", icon: "TrendingDown", level: "crit" as SignalLevel },
  { label: "Дебиторская задолж.", value: "5,96 млн", sub: "2 объекта с просрочкой", icon: "AlertCircle", level: "warn" as SignalLevel },
];

// ─── ДАННЫЕ: ФИНАНСЫ ──────────────────────────────────────────────────────────
const MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const CUR_MONTH = 2; // март (0-based)

// Холдинг — сводный
const HOLDING_MONTHS = {
  revenue: { plan: [142, 138, 155, 162, 175, 188, 195, 201, 178, 165, 158, 172], fact: [138, 131, 143, null, null, null, null, null, null, null, null, null] },
  costs:   { plan: [98,  95,  108, 112, 119, 128, 131, 138, 122, 114, 109, 118], fact: [101, 99,  112, null, null, null, null, null, null, null, null, null] },
  profit:  { plan: [44,  43,  47,  50,  56,  60,  64,  63,  56,  51,  49,  54], fact: [37,  32,  31,  null, null, null, null, null, null, null, null, null] },
};
const HOLDING_KPI = [
  { label: "Выручка YTD", plan: 435, fact: 412, unit: "млн ₽", icon: "TrendingUp" },
  { label: "Затраты YTD", plan: 301, fact: 312, unit: "млн ₽", icon: "Receipt" },
  { label: "Прибыль YTD", plan: 134, fact: 100, unit: "млн ₽", icon: "Wallet" },
  { label: "Маржа", plan: 30.8, fact: 24.3, unit: "%", icon: "Percent" },
];

// МКД — стройка
const MKD_PROJECTS_FIN = [
  { name: "ЖК «Северный парк»", budget_plan: 2840, budget_fact: 2310, cost_plan: 1840, cost_fact: 1974, sales_plan: 1820, sales_fact: 1420, cash_gap: -280 },
  { name: "ЖК «Речной квартал»", budget_plan: 3650, budget_fact: 3100, cost_plan: 2100, cost_fact: 2251, sales_plan: 2800, sales_fact: 2210, cash_gap: -120 },
  { name: "БЦ «Орион»", budget_plan: 5200, budget_fact: 4890, cost_plan: 3200, cost_fact: 3190, sales_plan: 3800, sales_fact: 2410, cash_gap: -680 },
];
const MKD_MONTHS = {
  costs:  { plan: [195, 188, 210, 225, 242, 260, 265, 270, 248, 231, 218, 238], fact: [212, 218, 224, null, null, null, null, null, null, null, null, null] },
  sales:  { plan: [320, 310, 345, 360, 385, 410, 425, 440, 395, 370, 355, 385], fact: [298, 285, 312, null, null, null, null, null, null, null, null, null] },
};
const MKD_KPI = [
  { label: "Бюджет проектов", plan: 11690, fact: 10300, unit: "млн ₽", icon: "FolderOpen" },
  { label: "Затраты факт YTD", plan: 654, fact: 654, unit: "млн ₽", icon: "HardHat" },
  { label: "Поступления YTD", plan: 975, fact: 895, unit: "млн ₽", icon: "ArrowDownCircle" },
  { label: "Кассовый разрыв", plan: 0, fact: -1080, unit: "млн ₽", icon: "AlertTriangle" },
];

// ТК — торговые комплексы
const TC_FIN_OBJECTS = [
  { name: "ТЦ «Галактика»", rent_plan: 18400, rent_fact: 17200, opex_plan: 4200, opex_fact: 4380, noi_plan: 14200, noi_fact: 12820, occupancy: 91, arrears: 1240 },
  { name: "ТЦ «Меридиан»", rent_plan: 12600, rent_fact: 13100, opex_plan: 2800, opex_fact: 2720, noi_plan: 9800, noi_fact: 10380, occupancy: 98, arrears: 0 },
  { name: "ТЦ «Атриум Парк»", rent_plan: 24800, rent_fact: 19100, opex_plan: 6100, opex_fact: 6450, noi_plan: 18700, noi_fact: 12650, occupancy: 78, arrears: 4380 },
  { name: "ТЦ «Нордик»", rent_plan: 7200, rent_fact: 7050, opex_plan: 1850, opex_fact: 1890, noi_plan: 5350, noi_fact: 5160, occupancy: 85, arrears: 340 },
];
const TC_FIN_MONTHS = {
  rent:   { plan: [62, 60, 63, 65, 68, 71, 72, 73, 65, 63, 60, 64], fact: [59, 56, 56, null, null, null, null, null, null, null, null, null] },
  opex:   { plan: [14, 14, 15, 15, 16, 17, 17, 17, 15, 15, 14, 15], fact: [15, 15, 16, null, null, null, null, null, null, null, null, null] },
  noi:    { plan: [48, 46, 48, 50, 52, 54, 55, 56, 50, 48, 46, 49], fact: [44, 41, 40, null, null, null, null, null, null, null, null, null] },
};
const TC_FIN_KPI = [
  { label: "Арендная выручка YTD", plan: 185, fact: 171, unit: "млн ₽", icon: "Store" },
  { label: "OPEX YTD", plan: 43, fact: 46, unit: "млн ₽", icon: "Settings" },
  { label: "NOI YTD", plan: 142, fact: 125, unit: "млн ₽", icon: "TrendingUp" },
  { label: "Дебиторская задолж.", plan: 0, fact: 5960, unit: "тыс. ₽", icon: "AlertCircle" },
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
function deltaLevel(plan: number, fact: number, higherIsBetter = true): SignalLevel {
  const ratio = fact / plan;
  if (higherIsBetter) return ratio < 0.85 ? "crit" : ratio < 0.95 ? "warn" : "ok";
  return ratio > 1.1 ? "crit" : ratio > 1.04 ? "warn" : "ok";
}
function fmt(v: number | null, decimals = 0) {
  if (v === null) return "—";
  return v.toLocaleString("ru", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function deltaPct(plan: number, fact: number) {
  const d = ((fact - plan) / plan) * 100;
  return (d >= 0 ? "+" : "") + d.toFixed(1) + "%";
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

// Мини-спарклайн (SVG)
function Sparkline({ planData, factData, height = 40 }: { planData: (number | null)[]; factData: (number | null)[]; height?: number }) {
  const width = 220;
  const pad = 4;
  const allVals = [...planData, ...factData].filter(v => v !== null) as number[];
  if (allVals.length === 0) return null;
  const min = Math.min(...allVals) * 0.92;
  const max = Math.max(...allVals) * 1.04;
  const range = max - min || 1;
  const pts = planData.length;
  const xStep = (width - pad * 2) / (pts - 1);
  const y = (v: number) => pad + ((max - v) / range) * (height - pad * 2);
  const planPts = planData.map((v, i) => v !== null ? `${pad + i * xStep},${y(v)}` : null).filter(Boolean).join(" ");
  const factPts = factData.map((v, i) => v !== null ? `${pad + i * xStep},${y(v as number)}` : null).filter(Boolean).join(" ");
  const curX = pad + CUR_MONTH * xStep;
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={planPts} fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,2" opacity="0.5" />
      <polyline points={factPts} fill="none" stroke="hsl(214,80%,56%)" strokeWidth="1.5" />
      <line x1={curX} y1={pad} x2={curX} y2={height - pad} stroke="hsl(var(--border))" strokeWidth="1" strokeDasharray="2,2" />
    </svg>
  );
}

// KPI карточка
function KpiCard({ label, plan, fact, unit, icon, delay = 0 }: { label: string; plan: number; fact: number; unit: string; icon: string; delay?: number }) {
  const lvl = deltaLevel(plan, fact, unit !== "%" || fact >= 0 ? true : false);
  const cls = levelClass(lvl);
  const isNegative = fact < 0;
  return (
    <div className={`bg-card border rounded p-4 flex items-start gap-3 animate-fade-in ${cls.border} border-l-2`}
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}>
      <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 ${cls.bg}`}>
        <Icon name={icon} size={18} className={cls.text} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-end gap-2 flex-wrap">
          <span className={`text-2xl font-bold leading-none ${isNegative ? "status-crit" : cls.text}`}>
            {isNegative ? "−" : ""}{fmt(Math.abs(fact), unit === "%" ? 1 : 0)}
          </span>
          <span className="text-[11px] text-muted-foreground mb-0.5">{unit}</span>
        </div>
        <p className="text-[11px] font-medium text-foreground mt-1 truncate">{label}</p>
        {plan > 0 && (
          <p className={`text-[10px] mt-0.5 font-medium ${lvl === "ok" ? "status-ok" : lvl === "warn" ? "status-warn" : "status-crit"}`}>
            {deltaPct(plan, fact)} к плану · пл. {fmt(plan, unit === "%" ? 1 : 0)} {unit}
          </p>
        )}
      </div>
    </div>
  );
}

// Строка таблицы план/факт
function PfRow({ label, plan, fact, unit = "млн ₽", higherIsBetter = true, indent = false }: {
  label: string; plan: number; fact: number; unit?: string; higherIsBetter?: boolean; indent?: boolean;
}) {
  const lvl = deltaLevel(plan, fact, higherIsBetter);
  const cls = levelClass(lvl);
  const diff = fact - plan;
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className={`px-5 py-2.5 text-xs text-foreground ${indent ? "pl-10" : ""}`}>{label}</td>
      <td className="px-5 py-2.5 text-xs font-mono text-right text-muted-foreground">{fmt(plan)} {unit}</td>
      <td className="px-5 py-2.5 text-xs font-mono text-right">
        <span className={cls.text}>{fmt(fact)} {unit}</span>
      </td>
      <td className="px-5 py-2.5 text-xs font-mono text-right">
        <span className={`${cls.text} font-semibold`}>{deltaPct(plan, fact)}</span>
      </td>
      <td className="px-5 py-2.5 text-xs font-mono text-right">
        <span className={diff >= 0 ? (higherIsBetter ? "status-ok" : "status-crit") : (higherIsBetter ? "status-crit" : "status-ok")}>
          {diff >= 0 ? "+" : ""}{fmt(diff)} {unit}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <div className={`w-2 h-2 rounded-full ${cls.dot} ${lvl !== "ok" ? "animate-pulse" : ""}`} />
      </td>
    </tr>
  );
}

// Мини-chart блок
function MonthChart({ title, planData, factData, unit = "млн ₽" }: {
  title: string; planData: (number | null)[]; factData: (number | null)[]; unit?: string;
}) {
  const maxPlan = Math.max(...(planData.filter(v => v !== null) as number[]));
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-medium text-foreground">{title}</span>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="inline-block w-5 border-t border-dashed border-muted-foreground" />план</span>
          <span className="flex items-center gap-1"><span className="inline-block w-5 border-t-2 border-blue-500" />факт</span>
        </div>
      </div>
      <div className="flex items-end gap-0.5" style={{ height: 56 }}>
        {MONTHS.map((m, i) => {
          const p = planData[i];
          const f = factData[i];
          const isFuture = f === null;
          const pH = p !== null ? (p / maxPlan) * 46 : 0;
          const fH = f !== null ? (f / maxPlan) * 46 : 0;
          const fLvl: SignalLevel = f !== null && p !== null ? deltaLevel(p, f) : "ok";
          const barColor = { ok: "#22c55e", warn: "#f59e0b", crit: "#ef4444" }[fLvl];
          return (
            <div key={m} className="flex-1 flex flex-col items-center gap-0.5 group relative">
              <div className="flex items-end gap-px w-full justify-center" style={{ height: 46 }}>
                <div className="w-2/5 rounded-t-sm opacity-25 bg-muted-foreground" style={{ height: pH }} />
                {!isFuture ? (
                  <div className="w-2/5 rounded-t-sm" style={{ height: fH, background: barColor }} />
                ) : (
                  <div className="w-2/5 rounded-t-sm bg-muted/40" style={{ height: pH }} />
                )}
              </div>
              <span className={`text-[8px] ${i === CUR_MONTH ? "text-foreground font-bold" : "text-muted-foreground"}`}>{m}</span>
              {!isFuture && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-popover border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-10 transition-opacity">
                  <div className="text-muted-foreground">п: {fmt(p as number)} {unit}</div>
                  <div className={levelClass(fLvl).text}>ф: {fmt(f as number)} {unit}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ДАШБОРД 1: МОНИТОРИНГ СТРОЙКИ ───────────────────────────────────────────
function MonitoringDashboard() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [dismissedSignals, setDismissedSignals] = useState<number[]>([]);

  const filteredSignals = SIGNALS.filter(
    s => !dismissedSignals.includes(s.id) &&
    (activeProject === null || s.project === PROJECTS.find(p => p.id === activeProject)?.name) &&
    (activeBlock === null || s.block === activeBlock)
  );
  const filteredProgress = PROGRESS.filter(
    p => activeProject === null || p.project === PROJECTS.find(pr => pr.id === activeProject)?.name
  );

  return (
    <div className="px-8 py-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {METRICS.map((m, i) => {
          const cls = m.level ? levelClass(m.level) : null;
          return (
            <div key={i} className={`bg-card border rounded p-4 flex items-start gap-3 animate-fade-in ${cls ? `${cls.border} border-l-2` : "border-border"}`}
              style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">Объект:</span>
            {[{ id: null, name: "Все" }, ...PROJECTS.map(p => ({ id: p.id, name: p.name }))].map(opt => (
              <button key={opt.id ?? "all"} onClick={() => setActiveProject(opt.id as number | null)}
                className="text-xs px-3 py-1 rounded border transition-colors"
                style={activeProject === opt.id ? { background: "hsl(220, 55%, 22%)", color: "#fff", borderColor: "hsl(220, 55%, 22%)" } : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                {opt.name}
              </button>
            ))}
          </div>

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


        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Сигналы отклонений</h2>
              <div className="flex gap-1">
                {["все", "стройка", "финансы", "продажи"].map(b => (
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
                      <button onClick={() => setDismissedSignals(prev => [...prev, s.id])}
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
  const [activeTc, setActiveTc] = useState<number | null>(null);
  const [dismissedTk, setDismissedTk] = useState<number[]>([]);

  const filteredSignals = TC_SIGNALS.filter(
    s => !dismissedTk.includes(s.id) &&
    (activeTc === null || s.tc === TRADING_CENTERS.find(c => c.id === activeTc)?.name)
  );
  const filteredTc = activeTc === null ? TRADING_CENTERS : TRADING_CENTERS.filter(c => c.id === activeTc);

  return (
    <div className="px-8 py-6 space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {TC_METRICS.map((m, i) => {
          const cls = m.level ? levelClass(m.level) : null;
          return (
            <div key={i} className={`bg-card border rounded p-4 flex items-start gap-3 animate-fade-in ${cls ? `${cls.border} border-l-2` : "border-border"}`}
              style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}>
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
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">ТК:</span>
            {[{ id: null, name: "Все" }, ...TRADING_CENTERS.map(c => ({ id: c.id, name: c.name }))].map(opt => (
              <button key={opt.id ?? "all"} onClick={() => setActiveTc(opt.id as number | null)}
                className="text-xs px-3 py-1 rounded border transition-colors"
                style={activeTc === opt.id ? { background: "hsl(220, 55%, 22%)", color: "#fff", borderColor: "hsl(220, 55%, 22%)" } : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                {opt.name}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Ключевые показатели ТК</h2>
              <span className="text-[11px] text-muted-foreground">план / факт</span>
            </div>
            <div className="divide-y divide-border">
              {filteredTc.map((c, i) => {
                const occLevel = deltaLevel(c.occupancy_plan, c.occupancy_fact);
                const revLevel = deltaLevel(c.revenue_plan, c.revenue_fact);
                const trafLevel = deltaLevel(c.traffic_plan, c.traffic_fact);
                const overallLevel: SignalLevel = [occLevel, revLevel].includes("crit") ? "crit" : [occLevel, revLevel].includes("warn") ? "warn" : "ok";
                return (
                  <div key={c.id} className="px-5 py-4 animate-fade-in" style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-[11px] text-muted-foreground">{c.address} · {c.area.toLocaleString("ru")} м² · с {c.openYear} г.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.arrears > 0 && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-status-warn status-warn">
                            деб. {(c.arrears / 1000).toFixed(1)} млн
                          </span>
                        )}
                        <div className={`flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${overallLevel === "crit" ? "bg-status-crit status-crit" : overallLevel === "warn" ? "bg-status-warn status-warn" : "bg-status-ok status-ok"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${overallLevel !== "ok" ? "animate-pulse-dot" : ""} ${overallLevel === "crit" ? "dot-crit" : overallLevel === "warn" ? "dot-warn" : "dot-ok"}`} />
                          {levelLabel(overallLevel)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Заполняемость</span>
                          <span className="text-[11px] font-mono"><span className={levelClass(occLevel).text}>{c.occupancy_fact}%</span><span className="text-muted-foreground"> / {c.occupancy_plan}%</span></span>
                        </div>
                        <ProgressBar value={c.occupancy_fact} level={occLevel} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Выручка, тыс. ₽</span>
                          <span className={`text-[11px] font-mono ${levelClass(revLevel).text}`}>{c.revenue_fact.toLocaleString("ru")}</span>
                        </div>
                        <ProgressBar value={c.revenue_fact} max={c.revenue_plan * 1.1} level={revLevel} />
                        <p className="text-[10px] text-muted-foreground mt-1">план {c.revenue_plan.toLocaleString("ru")} тыс.</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Трафик, чел.</span>
                          <span className="text-[11px] font-mono"><span className={levelClass(trafLevel).text}>{c.traffic_fact.toLocaleString("ru")}</span></span>
                        </div>
                        <ProgressBar value={c.traffic_fact} max={c.traffic_plan} level={trafLevel} />
                        <p className="text-[10px] text-muted-foreground mt-1">план {c.traffic_plan.toLocaleString("ru")}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


        </div>

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
                          <p className="text-[10px] text-muted-foreground mt-0.5">{s.tc} · {s.time}</p>
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

// ─── ДАШБОРД 3: ФИНАНСЫ ───────────────────────────────────────────────────────
function FinanceDashboard() {
  const [section, setSection] = useState<FinanceSection>("holding");

  const SECTIONS: { id: FinanceSection; label: string; icon: string }[] = [
    { id: "holding", label: "Холдинг (сводно)", icon: "LayoutDashboard" },
    { id: "mkd", label: "МКД / Стройка", icon: "Building2" },
    { id: "tc", label: "Торговые комплексы", icon: "Store" },
  ];

  return (
    <div className="px-8 py-6 space-y-6">
      {/* Section tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-4">
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mr-2">Раздел:</span>
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className="flex items-center gap-2 px-4 py-1.5 rounded text-xs font-medium transition-all"
            style={section === s.id
              ? { background: "hsl(220, 55%, 22%)", color: "#fff" }
              : { background: "transparent", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}>
            <Icon name={s.icon} size={13} />
            {s.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Icon name="Calendar" size={13} />
          Январь — Март 2026 · YTD
        </div>
      </div>

      {/* ── ХОЛДИНГ ── */}
      {section === "holding" && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {HOLDING_KPI.map((k, i) => <KpiCard key={i} {...k} delay={i * 60} />)}
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
            <div className="space-y-5">
              {/* P&L таблица */}
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">P&L — план / факт YTD</h2>
                  <span className="text-[11px] text-muted-foreground font-mono">млн ₽</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Статья</th>
                      <th className="text-right px-5 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">План</th>
                      <th className="text-right px-5 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Факт</th>
                      <th className="text-right px-5 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">% к плану</th>
                      <th className="text-right px-5 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">Откл.</th>
                      <th className="px-4 py-2.5 w-8" />
                    </tr>
                  </thead>
                  <tbody>
                    <PfRow label="Выручка — МКД" plan={250} fact={224} />
                    <PfRow label="Выручка — ТК" plan={185} fact={171} indent />
                    <PfRow label="Прочие доходы" plan={0} fact={17} higherIsBetter />
                    <tr className="border-b border-border bg-muted/20">
                      <td className="px-5 py-2.5 text-xs font-semibold text-foreground">Итого выручка</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-right font-semibold text-muted-foreground">435 млн ₽</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-right font-semibold status-warn">412 млн ₽</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-right font-semibold status-warn">−5,3%</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-right font-semibold status-crit">−23 млн ₽</td>
                      <td />
                    </tr>
                    <PfRow label="Затраты — МКД" plan={230} fact={246} higherIsBetter={false} />
                    <PfRow label="Затраты — ТК" plan={43} fact={46} higherIsBetter={false} indent />
                    <PfRow label="Общехол. расходы" plan={28} fact={20} higherIsBetter={false} />
                    <tr className="border-b border-border bg-muted/20">
                      <td className="px-5 py-2.5 text-xs font-semibold text-foreground">Итого затраты</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-right font-semibold text-muted-foreground">301 млн ₽</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-right font-semibold status-crit">312 млн ₽</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-right font-semibold status-crit">+3,7%</td>
                      <td className="px-5 py-2.5 text-xs font-mono text-right font-semibold status-crit">+11 млн ₽</td>
                      <td />
                    </tr>
                    <tr className="bg-muted/10">
                      <td className="px-5 py-3 text-sm font-bold text-foreground">Прибыль</td>
                      <td className="px-5 py-3 text-sm font-mono text-right font-bold text-muted-foreground">134 млн ₽</td>
                      <td className="px-5 py-3 text-sm font-mono text-right font-bold status-crit">100 млн ₽</td>
                      <td className="px-5 py-3 text-sm font-mono text-right font-bold status-crit">−25,4%</td>
                      <td className="px-5 py-3 text-sm font-mono text-right font-bold status-crit">−34 млн ₽</td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Charts */}
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Динамика по месяцам</h2>
                </div>
                <div className="px-5 py-4 grid grid-cols-3 gap-6">
                  <MonthChart title="Выручка, млн ₽" planData={HOLDING_MONTHS.revenue.plan} factData={HOLDING_MONTHS.revenue.fact} />
                  <MonthChart title="Затраты, млн ₽" planData={HOLDING_MONTHS.costs.plan} factData={HOLDING_MONTHS.costs.fact} />
                  <MonthChart title="Прибыль, млн ₽" planData={HOLDING_MONTHS.profit.plan} factData={HOLDING_MONTHS.profit.fact} />
                </div>
              </div>
            </div>

            {/* Отклонения */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Ключевые отклонения</h2>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { text: "Выручка МКД ниже плана на 26 млн ₽ — низкий темп продаж в 2 проектах", level: "crit" as SignalLevel, tag: "МКД" },
                    { text: "Выручка ТЦ «Атриум Парк» ниже плана на 23% — снижение заполняемости", level: "crit" as SignalLevel, tag: "ТК" },
                    { text: "Затраты МКД превышают план на 16 млн ₽ — удорожание материалов", level: "warn" as SignalLevel, tag: "МКД" },
                    { text: "Дебиторская задолженность ТК: 5,96 млн ₽ — 2 арендатора", level: "warn" as SignalLevel, tag: "ТК" },
                    { text: "Маржа холдинга 24,3% vs план 30,8% — требует решения", level: "crit" as SignalLevel, tag: "Холдинг" },
                    { text: "Общехолдинговые расходы ниже плана на 8 млн ₽ — экономия", level: "ok" as SignalLevel, tag: "Холдинг" },
                    { text: "ТЦ «Меридиан» — выручка выше плана на 3,9%", level: "ok" as SignalLevel, tag: "ТК" },
                  ].map((d, i) => {
                    const cls = levelClass(d.level);
                    return (
                      <div key={i} className={`px-4 py-3 border-l-2 ${cls.border}`}>
                        <div className="flex items-start gap-2">
                          <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${d.level !== "ok" ? "animate-pulse" : ""} ${cls.dot}`} />
                          <div>
                            <p className="text-[11px] text-foreground leading-snug">{d.text}</p>
                            <div className="flex gap-1.5 mt-1">
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${cls.bg} ${cls.text}`}>{levelLabel(d.level)}</span>
                              <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-sm border border-border">{d.tag}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── МКД ── */}
      {section === "mkd" && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {MKD_KPI.map((k, i) => <KpiCard key={i} {...k} delay={i * 60} />)}
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
            <div className="space-y-5">
              {/* По объектам */}
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Финансы по объектам МКД</h2>
                  <span className="text-[11px] text-muted-foreground font-mono">млн ₽</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["Объект", "Бюджет (п/ф)", "Затраты (п/ф)", "Поступления (п/ф)", "Кассовый разрыв", ""].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MKD_PROJECTS_FIN.map((p, i) => {
                      const budgetLvl = deltaLevel(p.budget_plan, p.budget_fact);
                      const costLvl = deltaLevel(p.cost_plan, p.cost_fact, false);
                      const salesLvl = deltaLevel(p.sales_plan, p.sales_fact);
                      const gapLvl: SignalLevel = p.cash_gap < -500 ? "crit" : p.cash_gap < -100 ? "warn" : "ok";
                      return (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-xs font-medium text-foreground">{p.name}</td>
                          <td className="px-4 py-3 text-xs font-mono">
                            <span className={levelClass(budgetLvl).text}>{fmt(p.budget_fact)}</span>
                            <span className="text-muted-foreground"> / {fmt(p.budget_plan)}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono">
                            <span className={levelClass(costLvl).text}>{fmt(p.cost_fact)}</span>
                            <span className="text-muted-foreground"> / {fmt(p.cost_plan)}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono">
                            <span className={levelClass(salesLvl).text}>{fmt(p.sales_fact)}</span>
                            <span className="text-muted-foreground"> / {fmt(p.sales_plan)}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono">
                            <span className={levelClass(gapLvl).text}>{fmt(p.cash_gap)} млн</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className={`w-2 h-2 rounded-full ${levelClass(gapLvl).dot} ${gapLvl !== "ok" ? "animate-pulse" : ""}`} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Динамика */}
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Динамика затрат и поступлений МКД</h2>
                </div>
                <div className="px-5 py-4 grid grid-cols-2 gap-8">
                  <MonthChart title="Затраты, млн ₽" planData={MKD_MONTHS.costs.plan} factData={MKD_MONTHS.costs.fact} />
                  <MonthChart title="Поступления от продаж, млн ₽" planData={MKD_MONTHS.sales.plan} factData={MKD_MONTHS.sales.fact} />
                </div>
              </div>
            </div>

            {/* Правая колонка — структура затрат */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Структура затрат YTD</h2>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {[
                    { label: "Материалы", plan: 280, fact: 310 },
                    { label: "Работы подрядчиков", plan: 185, fact: 192 },
                    { label: "Транспорт и механизм.", plan: 68, fact: 71 },
                    { label: "Проектирование", plan: 45, fact: 42 },
                    { label: "Аренда техники", plan: 38, fact: 40 },
                    { label: "Прочее", plan: 38, fact: 35 },
                  ].map((row, i) => {
                    const lvl = deltaLevel(row.plan, row.fact, false);
                    const cls = levelClass(lvl);
                    const total = 654;
                    const pct = Math.round((row.fact / total) * 100);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-foreground">{row.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">{pct}%</span>
                            <span className={`text-[11px] font-mono font-medium ${cls.text}`}>{fmt(row.fact)}</span>
                            <span className="text-[10px] text-muted-foreground">/ {fmt(row.plan)}</span>
                          </div>
                        </div>
                        <ProgressBar value={row.fact} max={row.plan * 1.2} level={lvl} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Кассовые разрывы</h2>
                </div>
                <div className="divide-y divide-border">
                  {MKD_PROJECTS_FIN.map((p, i) => {
                    const gapLvl: SignalLevel = p.cash_gap < -500 ? "crit" : p.cash_gap < -100 ? "warn" : "ok";
                    const cls = levelClass(gapLvl);
                    return (
                      <div key={i} className={`px-4 py-3 border-l-2 ${cls.border}`}>
                        <p className="text-[11px] font-medium text-foreground">{p.name}</p>
                        <p className={`text-lg font-bold font-mono mt-0.5 ${cls.text}`}>{fmt(p.cash_gap)} млн ₽</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${cls.bg} ${cls.text}`}>{levelLabel(gapLvl)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ТК ── */}
      {section === "tc" && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {TC_FIN_KPI.map((k, i) => <KpiCard key={i} {...k} delay={i * 60} />)}
          </div>

          <div className="grid gap-6" style={{ gridTemplateColumns: "1fr 320px" }}>
            <div className="space-y-5">
              {/* Таблица объектов */}
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">Финансы по торговым комплексам</h2>
                  <span className="text-[11px] text-muted-foreground font-mono">тыс. ₽ / мес.</span>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {["ТК", "Аренда (п/ф)", "OPEX (п/ф)", "NOI (п/ф)", "Заполн.", "Дебит.", ""].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {TC_FIN_OBJECTS.map((tc, i) => {
                      const rentLvl = deltaLevel(tc.rent_plan, tc.rent_fact);
                      const opexLvl = deltaLevel(tc.opex_plan, tc.opex_fact, false);
                      const noiLvl = deltaLevel(tc.noi_plan, tc.noi_fact);
                      const occLvl = deltaLevel(90, tc.occupancy);
                      return (
                        <tr key={i} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-xs font-medium text-foreground">{tc.name}</td>
                          <td className="px-4 py-3 text-xs font-mono">
                            <span className={levelClass(rentLvl).text}>{fmt(tc.rent_fact)}</span>
                            <span className="text-muted-foreground"> / {fmt(tc.rent_plan)}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono">
                            <span className={levelClass(opexLvl).text}>{fmt(tc.opex_fact)}</span>
                            <span className="text-muted-foreground"> / {fmt(tc.opex_plan)}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono">
                            <span className={levelClass(noiLvl).text}>{fmt(tc.noi_fact)}</span>
                            <span className="text-muted-foreground"> / {fmt(tc.noi_plan)}</span>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono">
                            <span className={levelClass(occLvl).text}>{tc.occupancy}%</span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {tc.arrears > 0
                              ? <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-status-warn status-warn">{(tc.arrears / 1000).toFixed(1)} млн</span>
                              : <span className="text-[10px] status-ok">—</span>}
                          </td>
                          <td className="px-3 py-3">
                            <div className={`w-2 h-2 rounded-full ${levelClass(noiLvl).dot} ${noiLvl !== "ok" ? "animate-pulse" : ""}`} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Динамика */}
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Динамика ТК по месяцам</h2>
                </div>
                <div className="px-5 py-4 grid grid-cols-3 gap-6">
                  <MonthChart title="Аренда, млн ₽" planData={TC_FIN_MONTHS.rent.plan} factData={TC_FIN_MONTHS.rent.fact} />
                  <MonthChart title="OPEX, млн ₽" planData={TC_FIN_MONTHS.opex.plan} factData={TC_FIN_MONTHS.opex.fact} />
                  <MonthChart title="NOI, млн ₽" planData={TC_FIN_MONTHS.noi.plan} factData={TC_FIN_MONTHS.noi.fact} />
                </div>
              </div>

              {/* NOI сравнение */}
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">NOI — план / факт по объектам</h2>
                  <span className="text-[11px] text-muted-foreground">тыс. ₽ / мес.</span>
                </div>
                <div className="px-5 py-4 space-y-4">
                  {TC_FIN_OBJECTS.map((tc, i) => {
                    const lvl = deltaLevel(tc.noi_plan, tc.noi_fact);
                    const cls = levelClass(lvl);
                    const maxNoi = Math.max(...TC_FIN_OBJECTS.map(t => t.noi_plan)) * 1.05;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] text-foreground font-medium">{tc.name}</span>
                          <div className="flex items-center gap-2 text-[11px] font-mono">
                            <span className={cls.text}>{fmt(tc.noi_fact)}</span>
                            <span className="text-muted-foreground">/ {fmt(tc.noi_plan)}</span>
                            <span className={`font-semibold ${cls.text}`}>{deltaPct(tc.noi_plan, tc.noi_fact)}</span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                          <div className="absolute top-0 left-0 h-full bg-muted-foreground/20 rounded-full" style={{ width: `${(tc.noi_plan / maxNoi) * 100}%` }} />
                          <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${lvl === "ok" ? "bg-green-500" : lvl === "warn" ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${(tc.noi_fact / maxNoi) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Правая — Арендаторы с долгами + детализация NOI */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Дебиторская задолженность</h2>
                </div>
                <div className="divide-y divide-border">
                  {[
                    { tc: "ТЦ «Атриум Парк»", tenant: "ООО «МегаСпорт»", amount: 2180, days: 47, level: "crit" as SignalLevel },
                    { tc: "ТЦ «Атриум Парк»", tenant: "ИП Журавлёв А.В.", amount: 1240, days: 31, level: "crit" as SignalLevel },
                    { tc: "ТЦ «Атриум Парк»", tenant: "ООО «ФудКорт+»", amount: 960, days: 18, level: "warn" as SignalLevel },
                    { tc: "ТЦ «Галактика»", tenant: "ООО «КиноМакс»", amount: 1240, days: 22, level: "warn" as SignalLevel },
                    { tc: "ТЦ «Нордик»", tenant: "ИП Прохоров К.С.", amount: 340, days: 8, level: "warn" as SignalLevel },
                  ].map((d, i) => {
                    const cls = levelClass(d.level);
                    return (
                      <div key={i} className={`px-4 py-3 border-l-2 ${cls.border}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[11px] font-medium text-foreground">{d.tenant}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{d.tc}</p>
                          </div>
                          <div className="text-right">
                            <p className={`text-[13px] font-bold font-mono ${cls.text}`}>{(d.amount / 1000).toFixed(2)} млн</p>
                            <p className="text-[10px] text-muted-foreground">{d.days} дн.</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-medium ${cls.bg} ${cls.text}`}>{levelLabel(d.level)}</span>
                          <span className="text-[10px] text-muted-foreground">{d.days > 30 ? "просрочка" : "контроль"}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-card border border-border rounded overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">OPEX по статьям</h2>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {[
                    { label: "Эксплуатация", plan: 18, fact: 20 },
                    { label: "Охрана", plan: 9, fact: 9 },
                    { label: "Клининг", plan: 6, fact: 7 },
                    { label: "Коммунальные", plan: 7, fact: 8 },
                    { label: "Маркетинг ТК", plan: 3, fact: 2 },
                  ].map((row, i) => {
                    const lvl = deltaLevel(row.plan, row.fact, false);
                    const cls = levelClass(lvl);
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] text-foreground">{row.label}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-mono font-medium ${cls.text}`}>{fmt(row.fact)}</span>
                            <span className="text-[10px] text-muted-foreground">/ {fmt(row.plan)} млн</span>
                          </div>
                        </div>
                        <ProgressBar value={row.fact} max={row.plan * 1.3} level={lvl} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ДАННЫЕ: ОБЪЕКТЫ ──────────────────────────────────────────────────────────
type ObjType = "жк" | "бц" | "тц";
interface House {
  id: number; name: string; floors: number; sections: number;
  progress: number; stage: string; deadline: string; status: SignalLevel;
}
interface Queue {
  id: number; name: string; houses: House[];
}
interface MkdObject {
  id: number; type: "жк" | "бц"; name: string; address: string; city: string;
  manager: string; totalArea: number; totalFlats?: number;
  queues?: Queue[];
  houses?: House[];
}
interface TcPremise {
  id: number; num: string; floor: number; area: number;
  tenant: string | null; category: string;
  rent: number; arrears: number; contractEnd: string; status: SignalLevel;
}
interface TcObject {
  id: number; type: "тц"; name: string; address: string; city: string;
  manager: string; totalArea: number; openYear: number;
  premises: TcPremise[];
}
type AnyObject = MkdObject | TcObject;

const OBJECTS_DATA: AnyObject[] = [
  {
    id: 1, type: "жк", name: "ЖК «Северный парк»", address: "ул. Лесная, 12", city: "Екатеринбург",
    manager: "Карпов А.В.", totalArea: 84500, totalFlats: 1240,
    queues: [
      {
        id: 1, name: "Очередь 1",
        houses: [
          { id: 1, name: "Дом 1 (корп. А)", floors: 18, sections: 3, progress: 100, stage: "Сдан", deadline: "2023-12", status: "ok" },
          { id: 2, name: "Дом 2 (корп. Б)", floors: 18, sections: 3, progress: 100, stage: "Сдан", deadline: "2024-03", status: "ok" },
        ]
      },
      {
        id: 2, name: "Очередь 2",
        houses: [
          { id: 3, name: "Дом 3 (корп. В)", floors: 22, sections: 4, progress: 48, stage: "Монолит — 14 эт.", deadline: "2025-12", status: "crit" },
          { id: 4, name: "Дом 4 (корп. Г)", floors: 22, sections: 4, progress: 15, stage: "Фундамент", deadline: "2026-06", status: "warn" },
        ]
      },
      {
        id: 3, name: "Очередь 3",
        houses: [
          { id: 5, name: "Дом 5 (корп. Д)", floors: 14, sections: 2, progress: 0, stage: "Проектирование", deadline: "2027-09", status: "ok" },
        ]
      }
    ]
  },
  {
    id: 2, type: "жк", name: "ЖК «Речной квартал»", address: "пр. Набережный, 5", city: "Пермь",
    manager: "Никитина О.С.", totalArea: 62000, totalFlats: 890,
    queues: [
      {
        id: 1, name: "Очередь 1",
        houses: [
          { id: 6, name: "Дом 1", floors: 16, sections: 2, progress: 100, stage: "Сдан", deadline: "2023-06", status: "ok" },
          { id: 7, name: "Дом 2", floors: 16, sections: 2, progress: 80, stage: "Фасад — секц. Б", deadline: "2025-09", status: "warn" },
        ]
      },
      {
        id: 2, name: "Очередь 2",
        houses: [
          { id: 8, name: "Дом 3", floors: 20, sections: 3, progress: 30, stage: "Монолит — 6 эт.", deadline: "2026-12", status: "ok" },
          { id: 9, name: "Дом 4", floors: 20, sections: 3, progress: 5, stage: "Подземная часть", deadline: "2027-06", status: "ok" },
        ]
      }
    ]
  },
  {
    id: 3, type: "бц", name: "БЦ «Орион»", address: "ул. Промышленная, 3", city: "Екатеринбург",
    manager: "Власов Д.Е.", totalArea: 38000,
    houses: [
      { id: 10, name: "Блок А (офисы)", floors: 12, sections: 1, progress: 54, stage: "Инженерия — 4 эт.", deadline: "2026-03", status: "warn" },
      { id: 11, name: "Блок Б (паркинг)", floors: 4, sections: 1, progress: 85, stage: "Отделка", deadline: "2025-12", status: "ok" },
    ]
  },
  {
    id: 4, type: "тц", name: "ТЦ «Галактика»", address: "пр. Победы, 15", city: "Екатеринбург",
    manager: "Семёнов И.Р.", totalArea: 42000, openYear: 2018,
    premises: [
      { id: 1, num: "А-101", floor: 1, area: 420, tenant: "Магнит", category: "Продукты", rent: 210, arrears: 0, contractEnd: "2026-12", status: "ok" },
      { id: 2, num: "А-102", floor: 1, area: 280, tenant: "ДНС", category: "Электроника", rent: 196, arrears: 0, contractEnd: "2027-06", status: "ok" },
      { id: 3, num: "А-103", floor: 1, area: 180, tenant: "Кофейня Бодрость", category: "Фудкорт", rent: 126, arrears: 0, contractEnd: "2025-11", status: "warn" },
      { id: 4, num: "А-201", floor: 2, area: 650, tenant: "Спортмастер", category: "Спорт", rent: 325, arrears: 1240, contractEnd: "2026-09", status: "warn" },
      { id: 5, num: "А-202", floor: 2, area: 320, tenant: null, category: "Свободно", rent: 0, arrears: 0, contractEnd: "—", status: "warn" },
      { id: 6, num: "А-203", floor: 2, area: 240, tenant: "Детский мир", category: "Дети", rent: 168, arrears: 0, contractEnd: "2027-03", status: "ok" },
      { id: 7, num: "А-301", floor: 3, area: 1200, tenant: "Кинотеатр Синема", category: "Развлечения", rent: 480, arrears: 0, contractEnd: "2028-01", status: "ok" },
      { id: 8, num: "А-302", floor: 3, area: 380, tenant: "Фитнес-клуб Flex", category: "Спорт", rent: 190, arrears: 0, contractEnd: "2026-08", status: "ok" },
    ]
  },
  {
    id: 5, type: "тц", name: "ТЦ «Атриум Парк»", address: "шоссе Северное, 88", city: "Пермь",
    manager: "Белова Т.А.", totalArea: 61000, openYear: 2015,
    premises: [
      { id: 9, num: "Б-001", floor: 1, area: 1800, tenant: "Лента", category: "Гипермаркет", rent: 540, arrears: 0, contractEnd: "2027-12", status: "ok" },
      { id: 10, num: "Б-101", floor: 1, area: 450, tenant: "ООО «МегаСпорт»", category: "Спорт", rent: 270, arrears: 2180, contractEnd: "2026-06", status: "crit" },
      { id: 11, num: "Б-102", floor: 1, area: 380, tenant: "ИП Журавлёв А.В.", category: "Одежда", rent: 228, arrears: 1240, contractEnd: "2025-12", status: "crit" },
      { id: 12, num: "Б-103", floor: 1, area: 220, tenant: "ООО «ФудКорт+»", category: "Фудкорт", rent: 132, arrears: 960, contractEnd: "2026-03", status: "warn" },
      { id: 13, num: "Б-201", floor: 2, area: 680, tenant: null, category: "Свободно", rent: 0, arrears: 0, contractEnd: "—", status: "crit" },
      { id: 14, num: "Б-202", floor: 2, area: 520, tenant: null, category: "Свободно", rent: 0, arrears: 0, contractEnd: "—", status: "crit" },
      { id: 15, num: "Б-203", floor: 2, area: 410, tenant: "Mothercare", category: "Дети", rent: 246, arrears: 0, contractEnd: "2026-11", status: "ok" },
      { id: 16, num: "Б-301", floor: 3, area: 900, tenant: "Боулинг Play", category: "Развлечения", rent: 315, arrears: 0, contractEnd: "2027-08", status: "ok" },
    ]
  },
  {
    id: 6, type: "тц", name: "ТЦ «Меридиан»", address: "ул. Центральная, 3", city: "Пермь",
    manager: "Козин Г.В.", totalArea: 28500, openYear: 2021,
    premises: [
      { id: 17, num: "В-101", floor: 1, area: 520, tenant: "Пятёрочка", category: "Продукты", rent: 260, arrears: 0, contractEnd: "2028-03", status: "ok" },
      { id: 18, num: "В-102", floor: 1, area: 310, tenant: "M.Video", category: "Электроника", rent: 217, arrears: 0, contractEnd: "2027-09", status: "ok" },
      { id: 19, num: "В-201", floor: 2, area: 420, tenant: "H&M", category: "Одежда", rent: 294, arrears: 0, contractEnd: "2027-06", status: "ok" },
      { id: 20, num: "В-202", floor: 2, area: 280, tenant: "Золотое яблоко", category: "Красота", rent: 196, arrears: 0, contractEnd: "2026-12", status: "ok" },
    ]
  },
  {
    id: 7, type: "тц", name: "ТЦ «Нордик»", address: "ул. Лесная, 44", city: "Екатеринбург",
    manager: "Рябов С.К.", totalArea: 18000, openYear: 2023,
    premises: [
      { id: 21, num: "Г-101", floor: 1, area: 380, tenant: "ВкусВилл", category: "Продукты", rent: 190, arrears: 0, contractEnd: "2027-01", status: "ok" },
      { id: 22, num: "Г-102", floor: 1, area: 220, tenant: "Rendez-Vous", category: "Обувь", rent: 154, arrears: 0, contractEnd: "2026-09", status: "ok" },
      { id: 23, num: "Г-103", floor: 1, area: 180, tenant: "ИП Прохоров К.С.", category: "Одежда", rent: 108, arrears: 340, contractEnd: "2026-06", status: "warn" },
      { id: 24, num: "Г-201", floor: 2, area: 340, tenant: null, category: "Свободно", rent: 0, arrears: 0, contractEnd: "—", status: "warn" },
    ]
  },
];

const OBJ_TYPE_LABELS: Record<ObjType, string> = { жк: "ЖК", бц: "БЦ", тц: "ТЦ" };
const OBJ_TYPE_ICONS: Record<ObjType, string> = { жк: "Building2", бц: "Briefcase", тц: "Store" };

// ─── КОМПОНЕНТ: ОБЪЕКТЫ ───────────────────────────────────────────────────────
function ObjectsDashboard() {
  const [selectedObj, setSelectedObj] = useState<number | null>(null);
  const [selectedQueue, setSelectedQueue] = useState<number | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<ObjType | "all">("all");

  const filtered = filterType === "all" ? OBJECTS_DATA : OBJECTS_DATA.filter(o => o.type === filterType);
  const activeObj = selectedObj !== null ? OBJECTS_DATA.find(o => o.id === selectedObj) ?? null : null;

  function resetDrill() { setSelectedObj(null); setSelectedQueue(null); setSelectedHouse(null); }

  const isMkd = (o: AnyObject): o is MkdObject => o.type !== "тц";
  const isTc = (o: AnyObject): o is TcObject => o.type === "тц";

  // Хлебные крошки
  function Breadcrumb() {
    if (!activeObj) return null;
    const queueObj = isMkd(activeObj) && selectedQueue !== null && activeObj.queues
      ? activeObj.queues.find(q => q.id === selectedQueue) : null;
    const houseObj = queueObj
      ? queueObj.houses.find(h => h.id === selectedHouse)
      : isMkd(activeObj) && activeObj.houses && selectedHouse !== null
        ? activeObj.houses.find(h => h.id === selectedHouse) : null;
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <button onClick={resetDrill} className="hover:text-foreground transition-colors">Объекты</button>
        <Icon name="ChevronRight" size={12} />
        <button onClick={() => { setSelectedQueue(null); setSelectedHouse(null); }} className="hover:text-foreground transition-colors text-foreground font-medium">{activeObj.name}</button>
        {queueObj && <><Icon name="ChevronRight" size={12} /><button onClick={() => setSelectedHouse(null)} className="hover:text-foreground transition-colors text-foreground font-medium">{queueObj.name}</button></>}
        {houseObj && <><Icon name="ChevronRight" size={12} /><span className="text-foreground font-medium">{houseObj.name}</span></>}
      </div>
    );
  }

  // Детальная карточка дома
  function HouseDetail({ house }: { house: House }) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Этажей", value: String(house.floors), icon: "Layers" },
            { label: "Секций", value: String(house.sections), icon: "LayoutGrid" },
            { label: "Готовность", value: `${house.progress}%`, icon: "CheckCircle2", level: house.status },
          ].map((c, i) => {
            const cls = c.level ? levelClass(c.level) : null;
            return (
              <div key={i} className={`bg-card border rounded p-4 ${cls ? `border-l-2 ${cls.border}` : "border-border"}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon name={c.icon} size={15} className="text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{c.label}</span>
                </div>
                <p className={`text-2xl font-bold ${cls ? cls.text : "text-foreground"}`}>{c.value}</p>
              </div>
            );
          })}
        </div>
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Прогресс строительства</h3>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{house.stage}</span>
              <span className={`text-sm font-bold font-mono ${levelClass(house.status).text}`}>{house.progress}%</span>
            </div>
            <ProgressBar value={house.progress} level={house.status} />
            <div className="flex items-center justify-between mt-3 text-[11px] text-muted-foreground">
              <span>Срок сдачи: <span className="text-foreground font-medium">{house.deadline}</span></span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${levelClass(house.status).bg} ${levelClass(house.status).text}`}>{levelLabel(house.status)}</span>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Плановые этапы</h3>
          </div>
          <div className="divide-y divide-border">
            {[
              { stage: "Нулевой цикл / фундамент", done: house.progress >= 10 },
              { stage: "Монолит / конструктив", done: house.progress >= 40 },
              { stage: "Фасад и кровля", done: house.progress >= 65 },
              { stage: "Инженерные системы", done: house.progress >= 75 },
              { stage: "Отделка и благоустройство", done: house.progress >= 90 },
              { stage: "Приёмка и сдача", done: house.progress >= 100 },
            ].map((s, i) => (
              <div key={i} className="px-5 py-2.5 flex items-center gap-3">
                <Icon name={s.done ? "CheckCircle2" : "Circle"} size={15} className={s.done ? "status-ok" : "text-muted-foreground"} />
                <span className={`text-xs ${s.done ? "text-foreground" : "text-muted-foreground"}`}>{s.stage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Детальная карточка объекта МКД
  function MkdDetail({ obj }: { obj: MkdObject }) {
    if (selectedHouse !== null) {
      const allHouses = obj.queues
        ? obj.queues.flatMap(q => q.houses)
        : obj.houses ?? [];
      const house = allHouses.find(h => h.id === selectedHouse);
      if (house) return <HouseDetail house={house} />;
    }

    const allHouses = obj.queues ? obj.queues.flatMap(q => q.houses) : obj.houses ?? [];
    const queueList = obj.queues ?? [];
    const isBc = obj.type === "бц";

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Тип", value: OBJ_TYPE_LABELS[obj.type], icon: OBJ_TYPE_ICONS[obj.type] },
            { label: "Город", value: obj.city, icon: "MapPin" },
            { label: isBc ? "Корпусов" : "Домов", value: String(allHouses.length), icon: "Building2" },
            { label: "Общая площадь", value: `${obj.totalArea.toLocaleString("ru")} м²`, icon: "Square" },
          ].map((c, i) => (
            <div key={i} className="bg-card border border-border rounded p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <Icon name={c.icon} size={14} className="text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{c.label}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{c.value}</p>
            </div>
          ))}
        </div>

        {/* Очереди → дома (ЖК) */}
        {!isBc && queueList.map(queue => (
          <div key={queue.id} className="bg-card border border-border rounded overflow-hidden">
            <button
              className="w-full px-5 py-3.5 border-b border-border flex items-center justify-between hover:bg-muted/30 transition-colors"
              onClick={() => setSelectedQueue(selectedQueue === queue.id ? null : queue.id)}>
              <div className="flex items-center gap-2">
                <Icon name="Layers" size={15} className="text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">{queue.name}</h3>
                <span className="text-[11px] text-muted-foreground">· {queue.houses.length} дом{queue.houses.length > 1 ? "а" : ""}</span>
              </div>
              <Icon name={selectedQueue === queue.id ? "ChevronUp" : "ChevronDown"} size={15} className="text-muted-foreground" />
            </button>
            {(selectedQueue === queue.id || queueList.length === 1) && (
              <div className="divide-y divide-border">
                {queue.houses.map(house => (
                  <button key={house.id} className="w-full px-5 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                    onClick={() => { setSelectedQueue(queue.id); setSelectedHouse(house.id); }}>
                    <div className={`w-2 h-2 rounded-full shrink-0 ${house.status !== "ok" ? "animate-pulse" : ""} ${levelClass(house.status).dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{house.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{house.stage}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-bold font-mono ${levelClass(house.status).text}`}>{house.progress}%</p>
                      <p className="text-[10px] text-muted-foreground">{house.floors} эт. · {house.sections} секц.</p>
                    </div>
                    <div className="w-24 shrink-0">
                      <ProgressBar value={house.progress} level={house.status} />
                      <p className="text-[10px] text-muted-foreground mt-1">сдача: {house.deadline}</p>
                    </div>
                    <Icon name="ChevronRight" size={14} className="text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Блоки БЦ (без очередей) */}
        {isBc && (
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Корпуса / блоки</h3>
            </div>
            <div className="divide-y divide-border">
              {(obj.houses ?? []).map(house => (
                <button key={house.id} className="w-full px-5 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                  onClick={() => setSelectedHouse(house.id)}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${house.status !== "ok" ? "animate-pulse" : ""} ${levelClass(house.status).dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">{house.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{house.stage}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-bold font-mono ${levelClass(house.status).text}`}>{house.progress}%</p>
                    <p className="text-[10px] text-muted-foreground">{house.floors} эт.</p>
                  </div>
                  <div className="w-24 shrink-0">
                    <ProgressBar value={house.progress} level={house.status} />
                    <p className="text-[10px] text-muted-foreground mt-1">сдача: {house.deadline}</p>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Детальная карточка ТЦ
  function TcDetail({ obj }: { obj: TcObject }) {
    const [floorFilter, setFloorFilter] = useState<number | "all">("all");
    const floors = [...new Set(obj.premises.map(p => p.floor))].sort();
    const filtered = floorFilter === "all" ? obj.premises : obj.premises.filter(p => p.floor === floorFilter);
    const total = obj.premises.length;
    const occupied = obj.premises.filter(p => p.tenant !== null).length;
    const totalArea = obj.premises.reduce((s, p) => s + p.area, 0);
    const totalRent = obj.premises.reduce((s, p) => s + p.rent, 0);
    const totalArrears = obj.premises.reduce((s, p) => s + p.arrears, 0);

    const CATEGORIES: Record<string, string> = {
      "Продукты": "🛒", "Электроника": "💻", "Фудкорт": "🍔", "Спорт": "⚽",
      "Одежда": "👕", "Обувь": "👟", "Дети": "🧸", "Развлечения": "🎬",
      "Красота": "💄", "Гипермаркет": "🏬", "Свободно": "—",
    };

    return (
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Помещений всего", value: String(total), icon: "LayoutGrid" },
            { label: "Занято / свободно", value: `${occupied} / ${total - occupied}`, icon: "Store", level: deltaLevel(total, occupied) },
            { label: "Арендная площадь", value: `${totalArea.toLocaleString("ru")} м²`, icon: "Square" },
            { label: "Аренда / мес.", value: `${(totalRent / 1000).toFixed(0)} тыс. ₽`, icon: "TrendingUp", level: "ok" as SignalLevel },
          ].map((c, i) => {
            const cls = c.level ? levelClass(c.level) : null;
            return (
              <div key={i} className={`bg-card border rounded p-4 ${cls ? `border-l-2 ${cls.border}` : "border-border"}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon name={c.icon} size={14} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{c.label}</span>
                </div>
                <p className={`text-xl font-bold ${cls ? cls.text : "text-foreground"}`}>{c.value}</p>
              </div>
            );
          })}
        </div>

        {totalArrears > 0 && (
          <div className="bg-status-warn border border-amber-200 rounded px-4 py-2.5 flex items-center gap-2.5">
            <Icon name="AlertCircle" size={15} className="status-warn shrink-0" />
            <p className="text-xs status-warn font-medium">Дебиторская задолженность: <span className="font-bold">{(totalArrears / 1000).toFixed(2)} млн ₽</span> по {obj.premises.filter(p => p.arrears > 0).length} арендаторам</p>
          </div>
        )}

        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Помещения</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground mr-1">Этаж:</span>
              {(["all", ...floors] as (number | "all")[]).map(f => (
                <button key={f} onClick={() => setFloorFilter(f)}
                  className="text-[10px] px-2 py-0.5 rounded transition-colors"
                  style={floorFilter === f ? { background: "hsl(220, 55%, 22%)", color: "#fff" } : { color: "hsl(var(--muted-foreground))" }}>
                  {f === "all" ? "Все" : `${f} эт.`}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Номер", "Этаж", "Площадь", "Арендатор", "Категория", "Аренда/мес.", "Долг", "Договор до", ""].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(p => {
                const cls = levelClass(p.status);
                return (
                  <tr key={p.id} className={`hover:bg-muted/30 transition-colors ${p.tenant === null ? "opacity-60" : ""}`}>
                    <td className="px-4 py-2.5 font-mono font-medium text-foreground">{p.num}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{p.floor}</td>
                    <td className="px-4 py-2.5 font-mono text-muted-foreground">{p.area.toLocaleString("ru")} м²</td>
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      {p.tenant ?? <span className="text-muted-foreground italic text-[11px]">Свободно</span>}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] text-muted-foreground">{CATEGORIES[p.category] ?? ""} {p.category}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono">
                      {p.rent > 0 ? <span className="text-foreground">{p.rent} тыс.</span> : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-4 py-2.5 font-mono">
                      {p.arrears > 0
                        ? <span className={`font-semibold ${cls.text}`}>{(p.arrears / 1000).toFixed(2)} млн</span>
                        : <span className="text-muted-foreground text-[11px]">—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground text-[11px]">{p.contractEnd}</td>
                    <td className="px-3 py-2.5">
                      {p.status !== "ok" && <div className={`w-2 h-2 rounded-full animate-pulse ${cls.dot}`} />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-6">
      {!activeObj ? (
        // ── СПИСОК ОБЪЕКТОВ ──
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Тип:</span>
            {(["all", "жк", "бц", "тц"] as const).map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className="text-xs px-3 py-1 rounded border transition-colors"
                style={filterType === t ? { background: "hsl(220, 55%, 22%)", color: "#fff", borderColor: "hsl(220, 55%, 22%)" } : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }}>
                {t === "all" ? "Все" : OBJ_TYPE_LABELS[t]}
              </button>
            ))}
            <span className="ml-auto text-[11px] text-muted-foreground">{filtered.length} объектов</span>
          </div>

          <div className="grid gap-3">
            {filtered.map(obj => {
              const isTcObj = isTc(obj);
              const mkdObj = isMkd(obj) ? obj : null;
              const tcObj = isTcObj ? obj : null;
              const allHouses = mkdObj?.queues ? mkdObj.queues.flatMap(q => q.houses) : mkdObj?.houses ?? [];
              const critHouses = allHouses.filter(h => h.status === "crit").length;
              const warnHouses = allHouses.filter(h => h.status === "warn").length;
              const freePremises = tcObj?.premises.filter(p => p.tenant === null).length ?? 0;
              const critPremises = tcObj?.premises.filter(p => p.status === "crit").length ?? 0;
              const overallLevel: SignalLevel = critHouses > 0 || critPremises > 0 ? "crit" : warnHouses > 0 || freePremises > 1 ? "warn" : "ok";
              const cls = levelClass(overallLevel);

              return (
                <button key={obj.id} onClick={() => { setSelectedObj(obj.id); setSelectedQueue(null); setSelectedHouse(null); }}
                  className={`w-full text-left bg-card border rounded-lg px-5 py-4 hover:shadow-md transition-all border-l-4 ${cls.border}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded flex items-center justify-center shrink-0 mt-0.5 ${cls.bg}`}>
                        <Icon name={OBJ_TYPE_ICONS[obj.type]} size={18} className={cls.text} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cls.bg} ${cls.text}`}>{OBJ_TYPE_LABELS[obj.type]}</span>
                          <h3 className="text-sm font-semibold text-foreground">{obj.name}</h3>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{obj.address}, {obj.city}</p>
                        <p className="text-[11px] text-muted-foreground">Ответственный: {obj.manager}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 shrink-0 text-right">
                      {mkdObj && (
                        <>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{mkdObj.type === "бц" ? "Блоков" : "Домов"}</p>
                            <p className="text-lg font-bold text-foreground">{allHouses.length}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Очередей</p>
                            <p className="text-lg font-bold text-foreground">{mkdObj.queues?.length ?? "—"}</p>
                          </div>
                          {critHouses > 0 && <div>
                            <p className="text-[10px] status-crit uppercase tracking-wide">Критично</p>
                            <p className="text-lg font-bold status-crit">{critHouses}</p>
                          </div>}
                          {warnHouses > 0 && <div>
                            <p className="text-[10px] status-warn uppercase tracking-wide">Внимание</p>
                            <p className="text-lg font-bold status-warn">{warnHouses}</p>
                          </div>}
                        </>
                      )}
                      {tcObj && (
                        <>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Помещений</p>
                            <p className="text-lg font-bold text-foreground">{tcObj.premises.length}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Свободно</p>
                            <p className={`text-lg font-bold ${freePremises > 0 ? "status-warn" : "status-ok"}`}>{freePremises}</p>
                          </div>
                          {tcObj.premises.some(p => p.arrears > 0) && <div>
                            <p className="text-[10px] status-warn uppercase tracking-wide">Долги</p>
                            <p className="text-lg font-bold status-warn">{(tcObj.premises.reduce((s, p) => s + p.arrears, 0) / 1000).toFixed(1)} млн</p>
                          </div>}
                        </>
                      )}
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Площадь</p>
                        <p className="text-sm font-semibold text-foreground">{obj.totalArea.toLocaleString("ru")} м²</p>
                      </div>
                      <Icon name="ChevronRight" size={18} className="text-muted-foreground ml-2" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        // ── ДЕТАЛЬНАЯ СТРАНИЦА ОБЪЕКТА ──
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Breadcrumb />
            <button onClick={resetDrill} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded transition-colors">
              <Icon name="ArrowLeft" size={13} />
              Назад к списку
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${levelClass(
              (() => {
                if (isMkd(activeObj)) {
                  const h = activeObj.queues ? activeObj.queues.flatMap(q => q.houses) : activeObj.houses ?? [];
                  return h.some(x => x.status === "crit") ? "crit" : h.some(x => x.status === "warn") ? "warn" : "ok";
                }
                return isTc(activeObj) && activeObj.premises.some(p => p.status === "crit") ? "crit" : "ok";
              })()
            ).bg}`}>
              <Icon name={OBJ_TYPE_ICONS[activeObj.type]} size={20} className={levelClass(
                (() => {
                  if (isMkd(activeObj)) {
                    const h = activeObj.queues ? activeObj.queues.flatMap(q => q.houses) : activeObj.houses ?? [];
                    return h.some(x => x.status === "crit") ? "crit" : h.some(x => x.status === "warn") ? "warn" : "ok";
                  }
                  return isTc(activeObj) && activeObj.premises.some(p => p.status === "crit") ? "crit" : "ok";
                })()
              ).text} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{activeObj.name}</h2>
              <p className="text-[11px] text-muted-foreground">{activeObj.address}, {activeObj.city} · {activeObj.manager}</p>
            </div>
          </div>

          {isMkd(activeObj) && <MkdDetail obj={activeObj} />}
          {isTc(activeObj) && <TcDetail obj={activeObj} />}
        </div>
      )}
    </div>
  );
}

// ─── ГЛАВНЫЙ КОМПОНЕНТ ────────────────────────────────────────────────────────
const DASHBOARDS: { id: DashboardId; label: string; icon: string }[] = [
  { id: "monitoring", label: "Мониторинг стройки", icon: "Building2" },
  { id: "tk", label: "Управляемость ТК", icon: "Store" },
  { id: "finance", label: "Финансы", icon: "BarChart2" },
  { id: "objects", label: "Объекты", icon: "FolderOpen" },
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
            { icon: "LayoutDashboard", label: "Дашборды", dash: ["monitoring", "tk", "finance"] as DashboardId[] },
            { icon: "FolderOpen", label: "Объекты", dash: ["objects"] as DashboardId[] },
            { icon: "Bell", label: "Сигналы", dash: [] as DashboardId[] },
            { icon: "BarChart2", label: "Аналитика", dash: [] as DashboardId[] },
            { icon: "FileText", label: "Отчёты", dash: [] as DashboardId[] },
            { icon: "Users", label: "Команда", dash: [] as DashboardId[] },
          ].map(item => {
            const active = item.dash.includes(activeDash);
            return (
              <button key={item.label}
                onClick={() => { if (item.dash.length > 0) setActiveDash(item.dash[0]); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors"
                style={active ? { background: "hsl(214, 80%, 56%, 0.15)", color: "hsl(214, 80%, 72%)", fontWeight: 500 } : { color: "hsl(210, 20%, 55%)" }}>
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            );
          })}
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
                {activeDash === "objects" ? "Объекты" : DASHBOARDS.find(d => d.id === activeDash)?.label}
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
            {DASHBOARDS.map(d => (
              <button key={d.id} onClick={() => setActiveDash(d.id)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded text-xs font-medium transition-all"
                style={activeDash === d.id
                  ? { background: "hsl(220, 55%, 22%)", color: "#fff" }
                  : { background: "transparent", color: "hsl(var(--muted-foreground))", border: "1px solid hsl(var(--border))" }}>
                <Icon name={d.icon} size={13} />
                {d.label}
              </button>
            ))}
          </div>
        </header>

        {activeDash === "monitoring" && <MonitoringDashboard />}
        {activeDash === "tk" && <TkDashboard />}
        {activeDash === "finance" && <FinanceDashboard />}
        {activeDash === "objects" && <ObjectsDashboard />}
      </main>
    </div>
  );
}