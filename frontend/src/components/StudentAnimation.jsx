import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  GraduationCap,
  BookOpen,
  Users,
  Trophy,
  Star,
  Sparkles,
} from "lucide-react";
import { C, grad } from "../theme/tokens";
import { useOnScreen } from "../hooks/useOnScreen";
import GlassCard from "./GlassCard";

/**
 * StudentAnimation
 * -----------------
 * A lightweight, dependency-free "students studying / collaborating / celebrating"
 * illustration for hero sections, empty states, or success screens.
 *
 * Built with pure CSS keyframes (see the "StudentAnimation keyframes" block in
 * src/index.css) instead of Framer Motion, so it adds zero extra bytes to the
 * bundle. Swap in Framer Motion later by replacing the `sa-bounce`/`sa-ring`/
 * `sa-confetti` classes with <motion.div> equivalents if you want spring physics.
 *
 * CUSTOMIZE COLORS
 *   Colors come from `C` and `grad` in src/theme/tokens.js so this stays in sync
 *   with the rest of the site. Outside this project, delete that import and
 *   replace with plain hex values, or override by passing a `style` prop that
 *   sets the CSS custom properties used below (--sa-speed only affects timing;
 *   colors are inline styles, so just edit the `grad.card1..4` / `C.blue` refs).
 *
 * CUSTOMIZE SPEED
 *   Pass `speed` (default 1). It's wired to the `--sa-speed` CSS variable, which
 *   every keyframe duration divides by (calc(Xs / var(--sa-speed))), so
 *   speed={2} runs twice as fast, speed={0.5} runs at half speed.
 *
 * CUSTOMIZE TRIGGERS
 *   - `autoCelebrate` (default true): fires the confetti burst once, the first
 *     time the component scrolls into view (via IntersectionObserver, so it
 *     never wastes CPU animating off-screen).
 *   - `loop` (default true): keeps the idle bounce/float motion running forever.
 *     Set to false to freeze after the entrance animation — useful on
 *     low-power devices or when the component is decorative background content.
 *   - Users can always replay the celebration by clicking the "Celebrate" button
 *     (calls the same `burst()` function `autoCelebrate` uses internally).
 *   - Respects `prefers-reduced-motion: reduce` automatically (see index.css).
 */
export default function StudentAnimation({
  className = "",
  speed = 1,
  loop = true,
  autoCelebrate = true,
}) {
  const rootRef = useRef(null);
  const [burstKey, setBurstKey] = useState(0);

  // Trigger the entrance animation only once, the first time the scene is
  // actually visible on screen — avoids animating (and paying layout/paint
  // cost) for content the user hasn't scrolled to yet. Reuses the same
  // IntersectionObserver hook the rest of the app uses (src/hooks/useOnScreen.js).
  const inView = useOnScreen(rootRef);

  // Fire the confetti burst once the scene comes into view (if enabled).
  useEffect(() => {
    if (inView && autoCelebrate) setBurstKey((k) => k + 1);
  }, [inView, autoCelebrate]);

  const badges = [
    {
      icon: BookOpen,
      label: "Studying",
      sub: "Focused sessions",
      grad: grad.card1,
      corner: "top-2 -left-2 md:left-2",
    },
    {
      icon: Users,
      label: "Collaborating",
      sub: "Study groups",
      grad: grad.card2,
      corner: "top-6 -right-2 md:right-2",
    },
    {
      icon: Trophy,
      label: "Celebrating",
      sub: "Goals reached",
      grad: grad.card3,
      corner: "bottom-4 -left-2 md:left-6",
    },
    {
      icon: Star,
      label: "Rated 4.9",
      sub: "By students",
      grad: grad.card4,
      corner: "bottom-0 -right-2 md:right-6",
    },
  ];

  // 12 confetti pieces, positioned deterministically around a circle so the
  // burst looks organic without relying on Math.random() (keeps renders
  // stable and avoids layout thrash from re-randomizing on every re-render).
  const confetti = useMemo(() => {
    const colors = [C.blue, C.cyan, C.orange, "#7C5CFF"];
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 70 + (i % 3) * 26;
      return {
        id: i,
        tx: `${Math.cos(angle) * distance}px`,
        ty: `${Math.sin(angle) * distance}px`,
        rot: `${(i * 47) % 360}deg`,
        delay: `${(i % 4) * 0.06}s`,
        color: colors[i % colors.length],
        size: 6 + (i % 3) * 2,
      };
    });
  }, []);

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      style={{ "--sa-speed": speed }}
    >
      <div className="relative h-[320px] sm:h-[380px] md:h-[440px] max-w-md mx-auto">
        {/* soft background glow, matches the site's hero gradient language */}
        <div
          className="absolute inset-6 rounded-[32px]"
          style={{ background: grad.primary, opacity: 0.1 }}
        />

        {/* center celebration badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            {inView && (
              <span
                className="absolute w-28 h-28 md:w-32 md:h-32 rounded-full sa-ring"
                style={{ background: grad.primary }}
                aria-hidden="true"
              />
            )}
            <div
              className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center ${inView && loop ? "sa-bounce" : ""}`}
              style={{
                background: grad.primary,
                boxShadow: "0 20px 45px rgba(41,82,227,0.35)",
              }}
            >
              <GraduationCap size={40} color="#fff" />
            </div>

            {/* confetti burst — remounted (via key) each time burstKey changes so the
                CSS animation restarts from 0% on replay */}
            {burstKey > 0 && (
              <div
                key={burstKey}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              >
                {confetti.map((p) => (
                  <span
                    key={p.id}
                    className="sa-confetti absolute top-1/2 left-1/2 rounded-sm"
                    style={{
                      width: p.size,
                      height: p.size,
                      background: p.color,
                      "--tx": p.tx,
                      "--ty": p.ty,
                      "--rot": p.rot,
                      "--delay": p.delay,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* floating badges — same GlassCard + float-card pattern used in Hero.jsx,
            each staggered with its own fade-up + float delay for an organic feel */}
        {badges.map(
          ({ icon: Icon, label, sub, grad: badgeGrad, corner }, i) => (
            <GlassCard
              key={label}
              className={`absolute ${corner} p-3 w-36 sm:w-40 float-card ${inView ? "fade-up" : "opacity-0"}`}
              style={{
                "--r": `${i % 2 === 0 ? -3 : 3}deg`,
                animationDelay: `${i * 0.6}s`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: badgeGrad }}
                >
                  <Icon size={16} color="#fff" />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-xs font-semibold truncate"
                    style={{ color: C.ink }}
                  >
                    {label}
                  </div>
                  <div
                    className="text-[11px] truncate"
                    style={{ color: C.muted }}
                  >
                    {sub}
                  </div>
                </div>
              </div>
            </GlassCard>
          ),
        )}
      </div>

      {/* manual trigger: replay the celebration on demand */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => setBurstKey((k) => k + 1)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-transform hover:scale-105 active:scale-95"
          style={{
            color: "#fff",
            background: grad.cta,
            boxShadow: "0 8px 20px rgba(255,106,43,0.3)",
          }}
        >
          <Sparkles size={14} /> Celebrate
        </button>
      </div>
    </div>
  );
}
