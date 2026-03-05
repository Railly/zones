"use client";

import type { ZoneGroup } from "@/lib/group-zones";
import {
	getAmbientInlineGradient,
	getTimeOfDay,
} from "@/lib/time-of-day";
import * as m from "motion/react-m";

export function GroupedZoneRow({
	group,
	homeId,
	isScrubbing,
	ambientMode,
	displayTime,
}: {
	group: ZoneGroup;
	homeId: string;
	isScrubbing: boolean;
	ambientMode?: boolean;
	displayTime?: Date;
}) {
	const isHomeGroup = group.offset === 0;
	const deltaSign = group.offset > 0 ? "+" : "";
	const deltaStr =
		group.offset !== 0 ? `${deltaSign}${group.offset}h` : "";

	const ambientGradient =
		ambientMode && displayTime
			? getAmbientInlineGradient(getTimeOfDay(displayTime, group.tz))
			: undefined;

	return (
		<m.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
			style={ambientGradient ? { backgroundImage: ambientGradient } : undefined}
			className={`group flex items-center justify-between px-3 sm:px-5 md:px-8 py-1 border-b border-[var(--color-border)] transition-colors flex-1 min-h-0 overflow-hidden ${
				isHomeGroup
					? "border-l-2 border-l-[var(--color-foreground)] bg-[var(--color-foreground)]/[0.02]"
					: "border-l-2 border-l-transparent hover:bg-[var(--color-foreground)]/[0.02]"
			}`}
		>
			<div className="flex flex-col justify-center gap-0.5 min-w-0 flex-1">
				<div
					className="font-[family-name:var(--font-geist-pixel-square)] font-bold text-[var(--color-foreground)] tracking-wider uppercase leading-none truncate"
					style={{
						fontSize: "clamp(14px, 3.5vw, 48px)",
					}}
				>
					{group.zones.map((z) => z.label).join(", ")}
				</div>
				<div className="flex items-center gap-1.5 sm:gap-2">
					<div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
						{group.zones.map((zone) => (
							<span
								key={zone.id}
								className={`fi fi-${zone.countryCode} rounded`}
								style={{
									fontSize:
										group.zones.length > 2
											? "clamp(1.8rem, 4vw, 4.5rem)"
											: "clamp(2.2rem, 6vw, 6.5rem)",
									lineHeight: 1,
								}}
							/>
						))}
					</div>
					{isHomeGroup && (
						<span
							className="font-mono uppercase tracking-widest text-[var(--color-muted-foreground)] border border-[var(--color-border)] px-1 py-0.5 shrink-0"
							style={{ fontSize: "clamp(7px, 1vw, 10px)" }}
						>
							home
						</span>
					)}
					{deltaStr && (
						<m.span
							key={deltaStr}
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className={`font-[family-name:var(--font-geist-pixel-square)] font-bold tracking-wider shrink-0 ${
								group.offset > 0
									? "text-[var(--color-delta-positive)]"
									: "text-[var(--color-delta-negative)]"
							}`}
							style={{
								fontSize: "clamp(13px, 3vw, 28px)",
							}}
						>
							{deltaStr}
						</m.span>
					)}
					{group.dayDelta !== 0 && (
						<span
							className={`font-[family-name:var(--font-geist-pixel-square)] font-bold shrink-0 ${
								group.dayDelta > 0
									? "text-[var(--color-delta-positive)]"
									: "text-[var(--color-delta-negative)]"
							}`}
							style={{
								fontSize: "clamp(11px, 2.5vw, 22px)",
							}}
						>
							{group.dayDelta > 0 ? "+1d" : "-1d"}
						</span>
					)}
				</div>
			</div>
			<div className="flex items-baseline gap-1 sm:gap-2 shrink-0">
				<div
					className={`font-[family-name:var(--font-geist-pixel-square)] font-bold tabular-nums tracking-wider transition-opacity ${
						isScrubbing && !isHomeGroup ? "opacity-80" : ""
					}`}
					style={{
						fontSize: "clamp(32px, 10vw, 130px)",
						lineHeight: 1,
					}}
				>
					{group.timeStr}
				</div>
				{group.period && (
					<span
						className="font-[family-name:var(--font-geist-pixel-square)] font-bold text-[var(--color-muted-foreground)] tracking-wider"
						style={{
							fontSize: "clamp(11px, 2.5vw, 32px)",
							lineHeight: 1,
						}}
					>
						{group.period}
					</span>
				)}
			</div>
		</m.div>
	);
}
