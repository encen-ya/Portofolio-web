import { useState } from "react";
import footer from "../data/footer.json";
import FooterRidges from "./FooterRidges";
import { ArrowIcon } from "./Icons";

export default function Footer() {
  const [status, setStatus] = useState(footer.newsletter.idle);

  const onSubscribe = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const valid = form.checkValidity();
    setStatus(valid ? footer.newsletter.success : footer.newsletter.error);
    if (valid) form.reset();
  };

  return (
    <footer id="footer" data-8b-section="footer">
      <p
        className="m-text-2 footer__bye"
        style={{ "--len": String(footer.word.length) }}
      >
        <span className="footer__word">{footer.word}</span>
      </p>
      <div className="footer__grid">
        <nav className="footer__col" aria-label="Footer">
          <p className="m-text-6 footer__label">{footer.columns.explore}</p>
          {footer.explore.map((link) => (
            <a className="m-link-2" href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="footer__col">
          <p className="m-text-6 footer__label">{footer.columns.talk}</p>
          {footer.talk.map((link) => (
            <a
              className="m-link-2"
              href={link.href}
              key={link.href}
              {...(link.href.startsWith("http")
                ? { target: "_blank", rel: "noopener" }
                : {})}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="footer__col">
          <p className="m-text-6 footer__label">{footer.columns.follow}</p>
          {footer.follow.map((link) => (
            <a
              className="m-link-2"
              href={link.href}
              key={link.href}
              target="_blank"
              rel="noopener"
            >
              {link.label}
            </a>
          ))}
        </div>
        <form className="footer__news" noValidate onSubmit={onSubscribe}>
          <label className="m-text-7" htmlFor="news-email">
            {footer.newsletter.label}
            <span className="m-dot" aria-hidden="true" />
          </label>
          <div className="footer__field">
            <input
              className="m-field"
              id="news-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={footer.newsletter.placeholder}
              required
            />
            <button
              className="m-icon"
              type="submit"
              aria-label={footer.newsletter.submitLabel}
            >
              <ArrowIcon />
            </button>
          </div>
          <p className="m-text-6 footer__note" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
      <div className="footer__legal m-text-6">
        <p>
          {footer.legal.copyright}
          <a
            href={footer.legal.credit.url}
            style={{ color: "inherit" }}
            data-8b-credit
          >
            {footer.legal.credit.label}
          </a>
        </p>
        <p className="footer__made">
          {footer.legal.location}
          <HeartDots />
        </p>
      </div>
      <FooterRidges seed={23} ridges={7} />
    </footer>
  );
}

/** A white heart printed in the same ordered dither as the footer range. */
function HeartDots() {
  return (
    <svg className="footer__heart" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <pattern
          id="footer-heart-dots"
          width="2.6"
          height="2.6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.3" cy="1.3" r="1.1" fill="#ffffff" />
        </pattern>
      </defs>
      <path
        d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 5.3 3 1.7-1.9 3.2-3 5.3-3 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"
        fill="url(#footer-heart-dots)"
      />
    </svg>
  );
}