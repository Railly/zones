"use client";

import { useClickSound } from "@/hooks/use-click-sound";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const THEMES = [
	{ value: "light", label: "Light" },
	{ value: "dark", label: "Dark" },
	{ value: "system", label: "System" },
];

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const playClick = useClickSound();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	if (!mounted) return null;

	return (
		<div className="flex items-center gap-1">
			{THEMES.map(({ value, label }) => (
				<button
					key={value}
					type="button"
					onClick={() => { setTheme(value); playClick(); }}
					className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border transition-colors cursor-pointer ${
						theme === value
							? "text-[var(--color-foreground)] border-[var(--color-muted)] bg-[var(--color-accent)]/[0.04]"
							: "text-[var(--color-muted-foreground)] border-transparent hover:text-[var(--color-foreground)] hover:border-[var(--color-border)]"
					}`}
				>
					{label}
				</button>
			))}
		</div>
	);
}
