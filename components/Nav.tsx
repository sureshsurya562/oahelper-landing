"use client";

import { useEffect, useState } from "react";
import { CTA, LINKS, NAV_LINKS } from "@/lib/config";

/**
 * Fixed glass capsule. The page alternates dark and paper sections, so the bar
 * carries its own surface rather than inverting — one treatment reads on both.
 */
export default function Nav() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* The mobile sheet is a layer over the page, so it closes on Escape. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${stuck ? " is-stuck" : ""}${open ? " is-open" : ""}`}>
      <div className="nav-in">
        <a className="nav-logo" href={LINKS.home} aria-label="OA Helper home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/oahelper-logo-white.png" alt="OA Helper" width={762} height={180} />
        </a>

        <nav className="nav-links" aria-label="Main">
          {NAV_LINKS.map((l) => (
            <a href={l.href} key={l.label}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-end">
          {/* Log in serves returning users; Start free is the one new visitors need. */}
          <a className="nav-login" href={CTA.navLogin.href}>
            {CTA.navLogin.label}
          </a>
          <a className="nav-cta" href={CTA.navStart.href} data-cursor="Free">
            {CTA.navStart.label}
            <span aria-hidden>→</span>
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            <i aria-hidden />
            <i aria-hidden />
          </button>
        </div>
      </div>

      <div className="nav-sheet" id="nav-sheet" hidden={!open}>
        {NAV_LINKS.map((l) => (
          <a href={l.href} key={l.label} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
        <a className="nav-sheet-login" href={CTA.navLogin.href}>
          {CTA.navLogin.label}
        </a>
        <a className="nav-cta is-wide" href={CTA.navStart.href}>
          {CTA.navStart.label}
          <span aria-hidden>→</span>
        </a>
      </div>
    </header>
  );
}
