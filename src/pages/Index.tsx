import { useState } from "react";
import Icon from "@/components/ui/icon";

const PROJECTS = [
  { id: 1, name: "ЖК «Северный парк»", address: "ул. Лесная, 12", stage: "Монолит — 14 эт.", manager: "Карпов А.В." },
  { id: 2, name: "ЖК «Речной квартал»", address: "пр. Набережный, 5", stage: "Фасад — секц. Б", manager: "Никитина О.С." },
  { id: 3, name: "БЦ «Орион»", address: "ул. Промышленная, 3", stage: "Инженерия — 4 эт.", manager: "Власов Д.Е." },
];

type SignalLevel = "ok" | "warn" | "crit";

interface Signal {
  id: number;
  project: string;
  block: "стройка" | "финансы" | "продажи";
  text: string;
  level: SignalLevel;
  time: string;
  responsible: string;
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

const BLOCK_LABELS: Record<string, string> = {
  стройка: "Стройка",
  финансы: "Финансы",
  продажи: "Продажи",
};

const PROGRESS = [
  { project: "ЖК «Северный парк»", plan: 62, fact: 48, cost_plan: 1840, cost_fact: 1974, sales_plan: 71, sales_fact: 58 },
  { project: "ЖК «Речной квартал»", plan: 81, fact: 80, cost_plan: 2100, cost_fact: 2251, sales_plan: 88, sales_fact: 72 },
  { project: "БЦ «Орион»", plan: 55, fact: 54, cost_plan: 3200, cost_fact: 3190, sales_plan: 40, sales_fact: 28 },
];

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

export default function Index() {
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
            { icon: "LayoutDashboard", label: "Дашборд", active: true },
            { icon: "Building2", label: "Объекты" },
            { icon: "Bell", label: "Сигналы" },
            { icon: "BarChart2", label: "Аналитика" },
            { icon: "FileText", label: "Отчёты" },
            { icon: "Users", label: "Команда" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors"
              style={item.active
                ? { background: "hsl(214, 80%, 56%, 0.15)", color: "hsl(214, 80%, 72%)", fontWeight: 500 }
                : { color: "hsl(210, 20%, 55%)" }
              }
            >
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
        <header className="sticky top-0 z-10 border-b border-border px-8 py-3.5 flex items-center justify-between" style={{ background: "hsl(216, 22%, 97%, 0.97)", backdropFilter: "blur(8px)" }}>
          <div>
            <h1 className="text-base font-semibold text-foreground tracking-tight">Мониторинг объектов</h1>
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
        </header>

        <div className="px-8 py-6 space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4">
            {METRICS.map((m, i) => {
              const cls = m.level ? levelClass(m.level) : null;
              return (
                <div
                  key={i}
                  className={`bg-card border rounded p-4 flex items-start gap-3 animate-fade-in ${cls ? `${cls.border} border-l-2` : "border-border"}`}
                  style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                >
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
            {/* Left */}
            <div className="space-y-5">
              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">Объект:</span>
                {[{ id: null, name: "Все" }, ...PROJECTS.map(p => ({ id: p.id, name: p.name }))].map((opt) => (
                  <button
                    key={opt.id ?? "all"}
                    onClick={() => setActiveProject(opt.id as number | null)}
                    className="text-xs px-3 py-1 rounded border transition-colors"
                    style={activeProject === opt.id
                      ? { background: "hsl(220, 55%, 22%)", color: "#fff", borderColor: "hsl(220, 55%, 22%)" }
                      : { borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))" }
                    }
                  >
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
                              <span className="text-[11px] font-mono">
                                <span className={levelClass(buildLevel).text}>{row.fact}%</span>
                                <span className="text-muted-foreground"> / {row.plan}%</span>
                              </span>
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
                              <span className="text-[11px] font-mono">
                                <span className={levelClass(salesLevel).text}>{row.sales_fact}%</span>
                                <span className="text-muted-foreground"> / {row.sales_plan}%</span>
                              </span>
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
                      <tr
                        key={p.id}
                        onClick={() => setActiveProject(activeProject === p.id ? null : p.id)}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        style={activeProject === p.id ? { background: "hsl(220, 55%, 22%, 0.05)" } : {}}
                      >
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
                      <button
                        key={b}
                        onClick={() => setActiveBlock(b === "все" ? null : b)}
                        className="text-[10px] px-2 py-0.5 rounded transition-colors"
                        style={(b === "все" && activeBlock === null) || activeBlock === b
                          ? { background: "hsl(220, 55%, 22%)", color: "#fff" }
                          : { color: "hsl(var(--muted-foreground))" }
                        }
                      >
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
                      <div
                        key={s.id}
                        className={`px-4 py-3.5 border-l-2 ${cls.border} animate-slide-in-right`}
                        style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cls.dot} ${s.level !== "ok" ? "animate-pulse-dot" : ""}`} />
                              <span className={`text-[10px] font-semibold uppercase tracking-wide ${cls.text}`}>
                                {levelLabel(s.level)} · {BLOCK_LABELS[s.block]}
                              </span>
                            </div>
                            <p className="text-[12px] font-medium text-foreground leading-snug">{s.text}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{s.project}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-muted-foreground">Ответств.: {s.responsible}</span>
                              <span className="text-[10px] text-muted-foreground">· {s.time}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => setDismissedSignals((prev) => [...prev, s.id])}
                            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                          >
                            <Icon name="X" size={13} />
                          </button>
                        </div>
                        {s.level !== "ok" && (
                          <button className="mt-2.5 text-[10px] font-medium flex items-center gap-1" style={{ color: "hsl(214, 80%, 52%)" }}>
                            <Icon name="ArrowRight" size={11} />
                            Перейти к объекту
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-card border border-border rounded px-5 py-4">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium mb-3">Статусная система</p>
                <div className="space-y-2">
                  {[
                    { level: "crit" as SignalLevel, desc: "Критическое отклонение — требует решения сегодня" },
                    { level: "warn" as SignalLevel, desc: "Предупреждение — мониторинг усилен" },
                    { level: "ok" as SignalLevel, desc: "Норма — в пределах допуска" },
                  ].map((item) => {
                    const cls = levelClass(item.level);
                    return (
                      <div key={item.level} className="flex items-start gap-2.5">
                        <span className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${cls.dot}`} />
                        <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}