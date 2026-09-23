"use client";

import { useEffect, useRef } from "react";

/**
 * Follower cursor, ported from the design. Three modes:
 *   dot    — a 10px mint bead, the resting state
 *   link   — a 30px mint ring over any plain link or button
 *   label  — a mint pill carrying an element's `data-cursor` text
 *
 * The pill is offset to the right of the pointer rather than centred on it, so
 * the real cursor stays visible and nothing is obscured while reading a card.
 * Fine pointers only: on touch there is nothing to follow.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = root.current;
    const bead = dot.current;
    const lab = label.current;
    if (!host || !bead || !lab) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mx = 0;
    let my = 0;
    let cx: number | null = null;
    let cy = 0;
    let inDoc = false;
    let mode = "dot";
    let text = "";
    let shown = "";

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      inDoc = true;
    };
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) inDoc = false;
    };
    const onOver = (e: Event) => {
      const t = e.target as Element | null;
      const hit = t && typeof t.closest === "function" ? t.closest("[data-cursor], a, button") : null;
      text = hit ? hit.getAttribute("data-cursor") || "" : "";
      mode = hit ? (text ? "label" : "link") : "dot";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseout", onOut);
    document.addEventListener("pointerover", onOver);

    let raf = 0;
    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;

      host.style.opacity = inDoc ? "1" : "0";
      if (cx == null) {
        cx = mx;
        cy = my;
      }
      const e = 1 - Math.exp(-dt * 18);
      cx += (mx - cx) * e;
      cy += (my - cy) * e;
      host.style.transform = `translate3d(${cx}px,${cy}px,0)`;

      const key = `${mode}|${text}`;
      if (key === shown) return;
      shown = key;
      const d = bead.style;
      if (mode === "label") {
        lab.textContent = text;
        d.width = `${Math.ceil(lab.scrollWidth) + 28}px`;
        d.height = "32px";
        d.margin = "-16px 0 0 16px";
        d.background = "#bfe7c7";
        d.borderColor = "#151515";
        lab.style.opacity = "1";
      } else if (mode === "link") {
        d.width = "30px";
        d.height = "30px";
        d.margin = "-15px 0 0 -15px";
        d.background = "transparent";
        d.borderColor = "#bfe7c7";
        lab.style.opacity = "0";
      } else {
        d.width = "10px";
        d.height = "10px";
        d.margin = "-5px 0 0 -5px";
        d.background = "#bfe7c7";
        d.borderColor = "#151515";
        lab.style.opacity = "0";
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("pointerover", onOver);
    };
  }, []);

  return (
    <div className="cur" ref={root} aria-hidden>
      <div className="cur-dot" ref={dot}>
        <span className="cur-label" ref={label} />
      </div>
    </div>
  );
}
