"use client";

import { useRef, useState, type CSSProperties } from "react";

/**
 * Meet the team — layout 1a ("overlapping row + sticker card") from the Meet the
 * Team design file. The avatars overlap in one row, the middle one on top; hovering
 * (or tapping / focusing) one lifts it, dims the rest, and pops a tilted sticker
 * card above it with the name, role and LinkedIn.
 *
 * Avatars: 1, 3, 4 are the women's; 2 and 5 the men's, alternated so neighbours differ.
 * `linkedin` stays empty until the profiles are shared — the link only renders when set.
 */
type Member = { name: string; role: string; avatar: number; tint: string; linkedin: string };

const TEAM: Member[] = [
  { name: "Shyam Saktavath", role: "Founder", avatar: 2, tint: "#c6dbf3", linkedin: "" },
  { name: "Gowthami", role: "Designer", avatar: 1, tint: "#f7d3b5", linkedin: "" },
  { name: "Janvi", role: "Designer", avatar: 3, tint: "#f5c6d6", linkedin: "" },
  { name: "Suraj", role: "Developer", avatar: 5, tint: "#d9cdf4", linkedin: "" },
  { name: "Thanmay", role: "Developer", avatar: 2, tint: "#bfe7c7", linkedin: "" },
  { name: "Gayathri", role: "Product", avatar: 4, tint: "#f3e9a8", linkedin: "" },
  { name: "Sai Vivek", role: "Product", avatar: 5, tint: "#b7dcf6", linkedin: "" },
  { name: "Pradiptha", role: "Growth", avatar: 2, tint: "#d7ee9f", linkedin: "" },
  { name: "Thamman", role: "Growth", avatar: 5, tint: "#f7dcae", linkedin: "" },
];

/** Each sticker card's tilt, from the design. */
const TILT = [-3, 2, -2, 3, -1, 2, -3, 3, -2];

export default function Team() {
  const [on, setOn] = useState<number | null>(null);
  // Touch fires a hover right before the click; only a real mouse should preview.
  const pointer = useRef<string>("mouse");
  const mid = (TEAM.length - 1) / 2;

  return (
    <section className="tm" aria-labelledby="tm-title">
      <div className="tm-in">
        <div className="tm-title">
          <span className="eyebrow">
            <i aria-hidden />
            Meet our team
          </span>
          <h2 id="tm-title">
            The people behind <em className="serif">OAHelper.</em>
          </h2>
          <span className="tm-hint">
            <span className="hover">Hover an avatar to say hi</span>
            <span className="tap">Tap an avatar to say hi</span>
          </span>
        </div>

        <ul
          className="tm-row"
          data-any={on !== null ? "" : undefined}
          onPointerDown={(e) => (pointer.current = e.pointerType)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setOn(null)}
        >
          {TEAM.map((m, i) => (
            <li
              key={m.name}
              className={`tm-av${on === i ? " is-on" : ""}`}
              style={{ zIndex: on === i ? 20 : 9 - Math.abs(i - mid) }}
              onPointerEnter={(e) => e.pointerType === "mouse" && setOn(i)}
              // Keyboard focus previews; a tap's focus doesn't, or its click would toggle it shut.
              onFocus={(e) => (e.target as HTMLElement).matches(":focus-visible") && setOn(i)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setOn(null)}
            >
              <div className="tm-pop">
                <div className="tm-card" style={{ background: m.tint, "--tilt": `${TILT[i]}deg` } as CSSProperties}>
                  <b>{m.name}</b>
                  <span>{m.role}</span>
                  {m.linkedin && (
                    <a href={m.linkedin} target="_blank" rel="noopener noreferrer" tabIndex={on === i ? 0 : -1}>
                      <i aria-hidden>in</i>
                      LinkedIn ↗
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                className="tm-face"
                style={{ background: m.tint }}
                aria-label={`${m.name}, ${m.role}`}
                aria-expanded={on === i}
                onClick={() => (pointer.current === "mouse" ? setOn(i) : setOn((v) => (v === i ? null : i)))}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/team/avatar-${m.avatar}.png`} alt="" width={108} height={108} loading="lazy" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
