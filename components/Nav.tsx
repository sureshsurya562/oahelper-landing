import { LINKS, VOICE } from "@/lib/config";

export default function Nav() {
  return (
    <header className="nav">
      <a className="logo" href={LINKS.home}>
        OA<span>Helper</span>
      </a>
      <a className="btn btn-primary" href={LINKS.browse}>
        {VOICE.cta}
      </a>
    </header>
  );
}
