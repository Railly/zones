"use client";

import { useCallback, useEffect, useRef } from "react";
import { useWebHaptics } from "web-haptics/react";

const TOTAL_LINES = 97;
const MIN = -720;
const MAX = 720;

function useScrubSound() {
	const audioCtxRef = useRef<AudioContext | null>(null);

	const playTick = useCallback(() => {
		if (!audioCtxRef.current) {
			audioCtxRef.current = new AudioContext();
		}
		const ctx = audioCtxRef.current;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.type = "sine";
		osc.frequency.value = 1800;
		gain.gain.setValueAtTime(0.07, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
		osc.start(ctx.currentTime);
		osc.stop(ctx.currentTime + 0.04);
	}, []);

	return playTick;
}

export function TimeScrubber({
	scrubberMinutes,
	setScrubberMinutes,
	resetScrubber,
	isScrubbing,
	use24h,
	toggleTimeFormat,
}: {
	scrubberMinutes: number;
	setScrubberMinutes: (v: number) => void;
	resetScrubber: () => void;
	isScrubbing: boolean;
	use24h: boolean;
	toggleTimeFormat: () => void;
}) {
	const { trigger } = useWebHaptics();
	const playTick = useScrubSound();
	const lastSnap = useRef(scrubberMinutes);
	const containerRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);

	const offsetHours = scrubberMinutes / 60;
	const sign = offsetHours >= 0 ? "+" : "";
	const progress = (scrubberMinutes - MIN) / (MAX - MIN);

	useEffect(() => {
		if (scrubberMinutes !== lastSnap.current) {
			lastSnap.current = scrubberMinutes;
			trigger("selection");
			playTick();
		}
	}, [scrubberMinutes, trigger, playTick]);

	function getMinutesFromPointer(clientX: number) {
		if (!containerRef.current) return 0;
		const rect = containerRef.current.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
		const raw = MIN + ratio * (MAX - MIN);
		return Math.round(raw / 30) * 30;
	}

	function handlePointerDown(e: React.PointerEvent) {
		isDragging.current = true;
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
		setScrubberMinutes(getMinutesFromPointer(e.clientX));
	}

	function handlePointerMove(e: React.PointerEvent) {
		if (!isDragging.current) return;
		setScrubberMinutes(getMinutesFromPointer(e.clientX));
	}

	function handlePointerUp() {
		isDragging.current = false;
	}

	return (
		<div className="border-t border-[var(--color-border)] px-3 sm:px-6 py-4 sm:py-5 md:px-10 md:py-6 bg-[var(--color-background)]">
			<div className="relative flex items-center justify-between mb-3 h-7">
				<div className="flex items-center gap-2 sm:gap-3">
					<span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)] hidden sm:inline">
						time travel
					</span>
					<button
						type="button"
						onClick={() => {
							toggleTimeFormat();
							trigger("light");
							playTick();
						}}
						className="font-mono text-[10px] uppercase tracking-widest border px-2.5 py-1 transition-colors text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)] cursor-pointer"
					>
						{use24h ? "24H" : "AM/PM"}
					</button>
				</div>
				<span className="absolute left-1/2 -translate-x-1/2 font-[family-name:var(--font-geist-pixel-square)] text-base text-[var(--color-foreground)] uppercase">
					{isScrubbing
						? `${sign}${offsetHours.toFixed(offsetHours % 1 === 0 ? 0 : 1)}H`
						: "NOW"}
				</span>
				<div className="flex items-center gap-2 sm:gap-3">
					<button
						type="button"
						onClick={() => {
							resetScrubber();
							trigger("light");
							playTick();
						}}
						className={`font-mono text-[10px] uppercase tracking-widest border px-2.5 py-1 transition-colors ${
							isScrubbing
								? "text-[var(--color-muted-foreground)] border-[var(--color-border)] hover:text-[var(--color-foreground)] hover:border-[var(--color-muted)] cursor-pointer"
								: "text-transparent border-transparent pointer-events-none"
						}`}
						aria-hidden={!isScrubbing}
						tabIndex={isScrubbing ? 0 : -1}
					>
						reset
					</button>
					<span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)] hidden sm:inline">
						drag to scrub
					</span>
				</div>
			</div>

			<div
				ref={containerRef}
				className="relative h-10 cursor-ew-resize select-none touch-none"
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onDoubleClick={() => {
					resetScrubber();
					trigger("medium");
					playTick();
				}}
			>
				<div className="absolute inset-0 flex items-end justify-between px-0">
					{Array.from({ length: TOTAL_LINES }).map((_, i) => {
						const isMajor = i % 12 === 0;
						const isMid = i % 6 === 0 && !isMajor;
						const lineProgress = i / (TOTAL_LINES - 1);
						const distFromThumb = Math.abs(lineProgress - progress);
						const glow = Math.max(0, 1 - distFromThumb * 6);

						return (
							<div
								key={`line-${i}`}
								className="flex flex-col items-center"
								style={{ width: "1px" }}
							>
								<div
									style={{
										width: "1px",
										height: isMajor ? "24px" : isMid ? "16px" : "10px",
										background: `color-mix(in srgb, var(--fg) ${Math.round((0.06 + glow * 0.35) * 100)}%, transparent)`,
										transition: "background 0.15s ease",
									}}
								/>
							</div>
						);
					})}
				</div>

				<div
					className="absolute top-0 h-full pointer-events-none"
					style={{
						left: `${progress * 100}%`,
						transform: "translateX(-50%)",
					}}
				>
					<div className="w-[3px] h-full bg-[var(--color-foreground)] shadow-[0_0_8px_var(--color-foreground)/30]" />
				</div>

				<div
					className="absolute bottom-0 pointer-events-none"
					style={{
						left: `${0.5 * 100}%`,
						transform: "translateX(-50%)",
					}}
				>
					<div className="w-px h-3 bg-[var(--color-muted)]" />
				</div>
			</div>
		</div>
	);
}
