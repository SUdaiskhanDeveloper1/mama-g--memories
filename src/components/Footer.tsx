import Link from "next/link";
import { T } from "@/lib/i18n";
import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr-in">
        <div>
          <p className="ftr-name">{SITE.person}</p>
          <p className="ftr-dates">{SITE.born} — {SITE.passed}</p>
          <p className="ftr-line"><T k="footer.line" /></p>
          <p className="ftr-contact"><T k="footer.contact" /> <a href="tel:+923153633503" dir="ltr"><b>0315-3633503</b></a>.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/life"><T k="nav.life" /></Link>
          <Link href="/memories"><T k="nav.memories" /></Link>
          <Link href="/gallery"><T k="nav.gallery" /></Link>
          <Link href="/quotes"><T k="footer.quotes" /></Link>
          <Link href="/tell"><T k="nav.tell" /></Link>
          {/* <Link href="/admin" rel="nofollow"><T k="footer.admin" /></Link> */}
        </nav>
      </div>
    </footer>
  );
}
