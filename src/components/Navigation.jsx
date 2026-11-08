import { useEffect, useRef, useState } from "react";
import navigation from "../data/navigation.json";
import { CloseIcon } from "./Icons";

const menuLinks = [...navigation.links, navigation.contactLink];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const closeRef = useRef(null);
  const menuRef = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      window.motionKit?.wheel?.stop();
    } else {
      if (wasOpen.current) toggleRef.current?.focus();
      window.motionKit?.wheel?.start();
    }
    wasOpen.current = open;
  }, [open]);

  const closeMenu = () => setOpen(false);

  const onMenuKeyDown = (event) => {
    if (event.key === "Escape") {
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;

    const items = [...menuRef.current.querySelectorAll("a, button")];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <header id="navigation" className="nav" data-8b-section="navigation">
      <a className="nav__brand" href="#hero" aria-label="KV, back to the top">
        {navigation.brand}
        <span className="m-dot" aria-hidden="true" />
      </a>
      <nav className="nav__links" aria-label="Main">
        <ul data-8b-items=":scope > li">
          {navigation.links.map((link) => (
            <li key={link.href}>
              <a className="m-link-2" href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        ref={toggleRef}
        className="m-btn-2 nav__menu"
        type="button"
        aria-expanded={open}
        aria-controls="menu"
        onClick={() => setOpen(true)}
      >
        <span className="m-btn__label">{navigation.menuLabel}</span>
      </button>
      <div
        ref={menuRef}
        className="menu"
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        onKeyDown={onMenuKeyDown}
      >
        <div className="menu__top">
          <button
            ref={closeRef}
            className="m-icon menu__close"
            type="button"
            aria-label="Close the menu"
            onClick={closeMenu}
          >
            <CloseIcon />
          </button>
        </div>
        <ul className="menu__list" data-8b-items=":scope > li">
          {menuLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={closeMenu}>
                {link.label}
                <span className="m-dot" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
        <p className="m-text menu__foot">{navigation.menuNote}</p>
      </div>
    </header>
  );
}