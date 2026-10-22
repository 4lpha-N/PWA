import "./Footer.scss";

export function VlFooter() {
  return (
    <footer className="vl-footer">
      <span>© 2026 Lorem Ipsum</span>
      <nav aria-label="Fußnavigation">
        <ul className="vl-footer__nav">
          {["Impressum", "Datenschutz", "Kontakt"].map((item) => (
            <li key={item}>
              <a
                className="vl-footer__link"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
