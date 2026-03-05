"use client";

import { useClickSound } from "@/hooks/use-click-sound";
import type { ViewMode } from "@/lib/store";
import { ThemeSwitcher } from "./theme-switcher";

const VIEWS: { mode: ViewMode; label: string; icon: string }[] = [
	{ mode: "stack", label: "Stack", icon: "|||" },
	{ mode: "scroll", label: "Scroll", icon: "=" },
	{ mode: "grid", label: "Grid", icon: "#" },
	{ mode: "compact", label: "Compact", icon: "o" },
];

export function ViewSwitcher({
	current,
	onChange,
	onAddZone,
	ambientMode,
	onToggleAmbient,
}: {
	current: ViewMode;
	onChange: (mode: ViewMode) => void;
	onAddZone: () => void;
	ambientMode: boolean;
	onToggleAmbient: () => void;
}) {
	const playClick = useClickSound();

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-2 gap-2 sm:gap-0 border-b border-[var(--color-border)]">
			<div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
				{VIEWS.map(({ mode, label, icon }) => (
					<button
						key={mode}
						type="button"
						onClick={() => { onChange(mode); playClick(); }}
						className={`font-mono text-[10px] uppercase tracking-widest px-2 sm:px-3 py-1.5 border transition-colors cursor-pointer shrink-0 ${
							current === mode
								? "text-[var(--color-foreground)] border-[var(--color-muted)] bg-[var(--color-accent)]/[0.04]"
								: "text-[var(--color-muted-foreground)] border-transparent hover:text-[var(--color-foreground)] hover:border-[var(--color-border)]"
						}`}
					>
						<span className="sm:hidden">{icon}</span>
						<span className="hidden sm:inline">{icon} {label}</span>
					</button>
				))}
			</div>
			<div className="flex items-center gap-2 sm:gap-3">
				<button
					type="button"
					onClick={() => { onToggleAmbient(); playClick(); }}
					className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border transition-colors cursor-pointer ${
						ambientMode
							? "text-[var(--color-foreground)] border-[var(--color-muted)] bg-[var(--color-accent)]/[0.04]"
							: "text-[var(--color-muted-foreground)] border-transparent hover:text-[var(--color-foreground)] hover:border-[var(--color-border)]"
					}`}
				>
					ambient
				</button>
				<div className="w-px h-4 bg-[var(--color-border)]" />
				<ThemeSwitcher />
				<button
					type="button"
					onClick={() => { onAddZone(); playClick(); }}
					className="font-mono text-[10px] uppercase tracking-widest px-2 sm:px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)] cursor-pointer transition-colors shrink-0"
				>
					+ add
				</button>
			</div>
		</div>
	);
}
