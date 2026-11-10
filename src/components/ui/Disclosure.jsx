import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * Komponen Disclosure aksesibel (pola WAI-ARIA Disclosure).
 * - Memakai elemen native <button type="button"> (mendukung Enter & Space).
 * - Menghubungkan tombol dan panel lewat aria-expanded dan aria-controls.
 * - Konten tertutup disembunyikan dengan atribut HTML hidden.
 * - Animasi tinggi panel menghormati prefers-reduced-motion melalui CSS.
 */
export default function Disclosure({
  id,
  title,
  summary = null,
  badge = null,
  icon = null,
  defaultOpen = false,
  className = "",
  buttonClassName = "",
  panelClassName = "",
  children,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const reactId = useId();
  const safeId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");
  const panelId = id || `disclosure-panel-${safeId}`;

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComp = icon;
    return <IconComp className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />;
  };

  return (
    <div className={`min-w-0 ${className}`.trim()}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`disclosure-trigger w-full text-left flex items-center justify-between gap-3 px-4 py-3 rounded-2xl min-w-0 ${buttonClassName}`.trim()}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {renderIcon()}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-slate-100 [overflow-wrap:anywhere] break-words">
                {title}
              </span>
              {badge && <span className="shrink-0">{badge}</span>}
            </div>
            {summary && (
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug [overflow-wrap:anywhere] break-words">
                {summary}
              </p>
            )}
          </div>
        </div>

        <ChevronDown
          className={`disclosure-chevron w-4 h-4 shrink-0 text-slate-400 ${
            isOpen ? "rotate-180 text-[#5df0a8]" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      <div id={panelId} hidden={!isOpen} className="disclosure-panel">
        <div className="disclosure-panel-inner">
          <div className={`pt-2.5 min-w-0 ${panelClassName}`.trim()}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
