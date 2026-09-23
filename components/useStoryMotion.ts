"use client";

import { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Scroll map (timeline time == pinned progress):
 * 0.00–0.12 hero · 0.12–0.28 company storm · 0.28–0.46 noise→signal
 */
export function useStoryMotion(root: RefObject<HTMLElement | null>, stackSize: number) {
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      ScrollTrigger.config({ ignoreMobileResize: true });

      const mm = gsap.matchMedia();
      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          mobile: "(max-width: 767px)",
          fine: "(pointer: fine)",
        },
        (ctx) => {
          const { motion, mobile, fine } = ctx.conditions as Record<string, boolean>;
          if (!motion) return;

          const q = gsap.utils.selector(el);
          const one = (s: string) => q(s)[0] as HTMLElement;
          const W = () => window.innerWidth;
          const H = () => window.innerHeight;
          const rnd = gsap.utils.random;

          gsap.set(q(".oa-tilt"), { transformPerspective: 1100 });

          /* ---------- Scene 0 ambient: never a static first frame ---------- */
          gsap.set(q(".oa-tilt"), { rotationX: 10, rotationY: mobile ? -6 : -12 });
          gsap.to(q(".oa-float"), { y: -12, rotation: 0.6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
          q(".drift-name").forEach((n, i) =>
            gsap.to(n, {
              x: rnd(-40, 40),
              y: rnd(-24, 24),
              duration: rnd(5, 9),
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              delay: i * 0.25,
            })
          );

          let removePointer = () => {};
          if (fine && !mobile) {
            const tilt = one(".oa-tilt");
            const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3" });
            const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3" });
            const dx = gsap.quickTo(one(".drift"), "x", { duration: 1.2, ease: "power3" });
            const dy = gsap.quickTo(one(".drift"), "y", { duration: 1.2, ease: "power3" });
            const onMove = (e: PointerEvent) => {
              const nx = e.clientX / W() - 0.5;
              const ny = e.clientY / H() - 0.5;
              rx(10 - ny * 14);
              ry(-12 + nx * 20);
              dx(-nx * 30);
              dy(-ny * 20);
            };
            window.addEventListener("pointermove", onMove, { passive: true });
            removePointer = () => window.removeEventListener("pointermove", onMove);
          }

          /* ---------- Pinned story ---------- */
          const tl = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => "+=" + H() * (mobile ? 1.5 : 2.2),
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });

          const anchor = one(".oa-anchor");
          const heroOffset = () => parseFloat(getComputedStyle(anchor).top) || 0;

          /* Scene 1: company storm → collapse (0.12–0.28) */
          tl.to(q(".hero-copy, .scroll-hint, .ticker"), { autoAlpha: 0, y: -40, duration: 0.04 }, 0.12)
            .to(q(".drift"), { autoAlpha: 0, scale: 1.25, duration: 0.05 }, 0.12)
            .to(anchor, { y: () => -heroOffset(), scale: mobile ? 0.66 : 0.52, duration: 0.05 }, 0.12)
            .to(q(".oa-head-company"), { autoAlpha: 0, duration: 0.01 }, 0.13)
            .fromTo(q(".oa-head-search"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0.135);

          const names = q(".storm-name").filter((n) => getComputedStyle(n).display !== "none");
          const seeds = names.map((_, i) => ({
            angle: (i / names.length) * Math.PI * 2 + rnd(-0.25, 0.25),
            r: rnd(0.3, 0.48),
            z: rnd(-600, 180),
            ry: rnd(-50, 50),
          }));
          names.forEach((n, i) => {
            const s = seeds[i];
            const sx = () => Math.cos(s.angle) * W() * s.r;
            const sy = () => Math.sin(s.angle) * H() * s.r * 1.1;
            // slow at first, then faster and faster as they get pulled in
            const pull = 0.18 + 0.022 * Math.sqrt(i / Math.max(1, names.length - 1));
            tl.fromTo(
              n,
              { x: sx, y: sy, z: s.z - 300, rotationY: s.ry, autoAlpha: 0, scale: 0.7 },
              { x: () => sx() * 0.92, y: () => sy() * 0.92, z: s.z, autoAlpha: 1, scale: 1, duration: 0.04, ease: "power1.out" },
              0.13 + i * 0.0015
            ).to(n, { x: 0, y: 0, z: 0, rotationY: 0, scale: 0.15, autoAlpha: 0, duration: 0.045, ease: "power3.in" }, pull);
          });

          tl.fromTo(q(".s1-l1"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.03 }, 0.14)
            .to(q(".s1-l1"), { autoAlpha: 0, y: -20, duration: 0.02 }, 0.215)
            .to(q(".oa-head-search"), { autoAlpha: 0, duration: 0.01 }, 0.24)
            .to(q(".oa-head-company"), { autoAlpha: 1, duration: 0.01 }, 0.243)
            .to(anchor, { scale: mobile ? 0.84 : 0.74, duration: 0.03, ease: "back.out(2.2)" }, 0.24)
            .fromTo(q(".s1-l2"), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.03 }, 0.235)
            .fromTo(q(".s1-proof"), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.03 }, 0.25);

          /* Scene 2: random pile → clean stack (0.28–0.45) */
          tl.to(q(".s1-l2, .s1-proof"), { autoAlpha: 0, y: -30, duration: 0.03 }, 0.28)
            .to(anchor, { z: -900, rotationX: 35, autoAlpha: 0, duration: 0.035, ease: "power2.in" }, 0.28)
            .fromTo(q(".s2-head"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.03 }, 0.295)
            .fromTo(q(".s2-left .s2-label, .s2-left .s2-pre"), { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.03 }, 0.3)
            .fromTo(q(".s2-right .s2-label, .s2-right .s2-pre"), { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.03 }, 0.31);

          const layer = one(".s2");
          // Layout offsets (not getBoundingClientRect) so in-flight transforms don't skew the targets.
          const center = (slot: HTMLElement) => {
            let x = slot.offsetWidth / 2;
            let y = slot.offsetHeight / 2;
            for (let n: HTMLElement | null = slot; n && n !== layer; n = n.offsetParent as HTMLElement | null) {
              x += n.offsetLeft;
              y += n.offsetTop;
            }
            return { x: x - layer.offsetWidth / 2, y: y - layer.offsetHeight / 2 };
          };
          const pileSlot = one('[data-slot="pile"]');
          const stackSlot = one('[data-slot="stack"]');
          const cards = q(".qcard");
          const spread = mobile ? 0.6 : 1;
          const cardSeeds = cards.map(() => ({
            x: rnd(-80, 80) * spread,
            y: rnd(-45, 45) * spread,
            rot: rnd(-38, 38),
            rx: rnd(-25, 25),
            ry: rnd(-35, 35),
            z: rnd(-80, 80),
          }));

          cards.forEach((c, i) => {
            const s = cardSeeds[i];
            tl.fromTo(
              c,
              {
                x: () => center(pileSlot).x + s.x,
                y: () => center(pileSlot).y + s.y - H() * 0.7,
                z: s.z,
                rotation: s.rot * 2,
                rotationX: s.rx,
                rotationY: s.ry,
                autoAlpha: 0,
              },
              {
                y: () => center(pileSlot).y + s.y,
                rotation: s.rot,
                autoAlpha: 1,
                duration: 0.03,
                ease: "power2.out",
              },
              0.3 + i * 0.0018
            );
          });

          const flying = q(".qcard.to-stack");
          flying.forEach((c, j) => {
            tl.to(
              c,
              {
                x: () => center(stackSlot).x,
                y: () => center(stackSlot).y + (stackSize / 2 - j) * (mobile ? 3 : 5),
                z: j * 6,
                rotation: 0,
                rotationX: 0,
                rotationY: 0,
                duration: 0.03,
                ease: "back.out(1.3)",
              },
              0.345 + j * 0.005
            ).to(c.querySelector(".qcard-on"), { autoAlpha: 1, duration: 0.01 }, 0.365 + j * 0.005);
          });
          tl.to(q(".qcard.stay"), { autoAlpha: 0.4, filter: "blur(1.5px)", duration: 0.03 }, 0.37)
            .fromTo(q(".qcard-fresh"), { autoAlpha: 0, y: 10, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.02, ease: "back.out(2)" }, 0.415);

          /* Hold the final frame for a beat before the pin releases */
          tl.set({}, {}, 0.47);

          return () => removePointer();
        }
      );
    },
    { scope: root }
  );
}
