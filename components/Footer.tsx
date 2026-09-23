import { LINKS } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} OA Helper</span>
      <a href={LINKS.home}>oahelper.in</a>
    </footer>
  );
}
