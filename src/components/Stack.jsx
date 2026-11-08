import stack from "../data/stack.json";

function TechIcon({ name }) {
  if (name === "dart") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M13.5 2.5L4.5 11.5l6.5 6.5 9-9-6.5-6.5zM3.5 12.5l-.7.7a1.5 1.5 0 0 0 0 2.1l6.4 6.4.7-.7-6.4-6.4zm8.5 8.5l-.7.7 6.4 6.4a1.5 1.5 0 0 0 2.1 0l.7-.7-8.5-8.5v2.1z" />
      </svg>
    );
  }
  if (name === "javascript") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M3 3h18v18H3V3zm13.2 13.9c.7 0 1.2-.2 1.6-.7.4-.5.5-1.2.5-2.2v-1.6h-1.9v1.6c0 .8-.3 1.2-.9 1.2-.5 0-.8-.3-.8-.9v-3.7h-1.9v3.8c0 1.1.2 1.8.6 2.2.4.4 1.1.6 1.9.6zm-6.2 0c.7 0 1.2-.2 1.6-.6.4-.4.6-1.1.6-2v-4.9H10v4.9c0 .6-.1 1-.4 1.2-.2.2-.6.3-1.1.3-.4 0-.8-.1-1.1-.3l-.4 1.4c.6.3 1.3.5 2.2.5z" />
      </svg>
    );
  }
  if (name === "php") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 4C5.4 4 0 7.6 0 12s5.4 8 12 8 12-3.6 12-8-5.4-8-12-8zm-5.7 11.5l.8-4.2h1.8c.8 0 1.4.2 1.8.5.3.3.4.8.3 1.4-.1.8-.5 1.4-1.1 1.8-.6.3-1.3.5-2.2.5H6.3zm5.4 0l1.3-6.8h1.6l-.3 1.6c.4-.6.9-1.1 1.4-1.4.5-.3 1.1-.4 1.7-.4.9 0 1.5.3 1.9.8.4.5.5 1.3.3 2.2l-.8 4h-1.6l.8-3.9c.1-.5.1-.9-.1-1.1-.2-.2-.6-.4-1.1-.4-.6 0-1.1.2-1.5.6-.4.4-.7 1-.9 1.8l-.6 3H11.7zm6.7 0l.8-4.2h1.8c.8 0 1.4.2 1.8.5.3.3.4.8.3 1.4-.1.8-.5 1.4-1.1 1.8-.6.3-1.3.5-2.2.5h-1.6z"/>
      </svg>
    );
  }
  if (name === "htmlcss") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2L4 5l1.2 13.5L12 22l6.8-3.5L20 5l-8-3zm4.5 6.5h-7l.2 2.3h6.6l-.6 6.3-4.7 1.4-4.7-1.4-.3-3.7h2.2l.2 1.8 2.6.7 2.6-.7.3-3.2H8.3L7.7 6.2h9.1l-.3 2.3z"/>
      </svg>
    );
  }
  if (name === "sql") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    );
  }
  if (name === "flutter") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M14.31 2.34L3.15 13.5l3.2 3.2L17.51 5.54h-3.2zm-.04 10.32L9.43 17.5l4.84 4.84h3.2l-6.44-6.44 3.24-3.24z"/>
      </svg>
    );
  }
  if (name === "laravel") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2l9 5.2v10.4L12 23l-9-5.4V7.2L12 2zm0 2.3L5 8.3v7.4l7 4 7-4V8.3l-7-4zm0 3.5l4.5 2.6v5.2L12 18.2l-4.5-2.6v-5.2L12 7.8z"/>
      </svg>
    );
  }
  if (name === "react") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      </svg>
    );
  }
  if (name === "filament") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8"/>
        <path d="M12 8v8M8 12h8"/>
      </svg>
    );
  }
  if (name === "bootstrap") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M4 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4zm5.5 3v10h4.2c1.4 0 2.4-.3 3-1 .6-.6.9-1.5.9-2.6 0-.8-.2-1.5-.7-2-.4-.5-1.1-.8-1.9-.9.6-.2 1.1-.5 1.5-1 .4-.5.6-1.1.6-1.8 0-.9-.3-1.7-.8-2.2-.6-.5-1.5-.8-2.6-.8H9.5zm2.3 2h2c.6 0 1 .1 1.3.4.3.3.4.7.4 1.2 0 .5-.1.9-.4 1.2-.3.3-.8.4-1.4.4h-1.9V9zm0 4.6h2.2c.7 0 1.2.1 1.5.4.3.3.5.7.5 1.3 0 .6-.2 1-.5 1.3-.3.3-.8.4-1.5.4h-2.2v-3.4z"/>
      </svg>
    );
  }
  if (name === "mysql") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M19 9c-.6-.7-1.4-1.2-2.3-1.4-.4-.1-.8-.1-1.2 0-1 .3-1.8 1-2.2 2-.5 1-.4 2.2.1 3.2.7 1.2 2 2 3.4 2.1 1.4.1 2.8-.5 3.6-1.6.3-.4.5-.8.6-1.3.1-.7-.1-1.5-.5-2.1-.4-.4-.9-.7-1.5-.9zm-6.6 6.9c-.3.4-.6.8-1 1.2-1.3 1.2-3.1 1.8-4.9 1.6-1.8-.2-3.4-1.2-4.3-2.7-.9-1.5-1-3.3-.4-5 .6-1.6 1.9-2.9 3.5-3.5 1.6-.6 3.4-.4 4.9.4.9.5 1.6 1.3 2.1 2.2l-.2.1c-.8-.5-1.7-.8-2.7-.8-1.4 0-2.7.6-3.6 1.7-.9 1.1-1.2 2.6-.9 4 .3 1.4 1.3 2.5 2.6 3 1.3.5 2.8.3 4-.5.4-.3.7-.7.9-1.1l.1.3z"/>
      </svg>
    );
  }
  if (name === "postgresql") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 17.9c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-2-12h3c1.7 0 3 1.3 3 3s-1.3 3-3 3h-1.5v3H11V7.9zm1.5 4.5H14c.8 0 1.5-.7 1.5-1.5S14.8 9.4 14 9.4h-1.5v3z"/>
      </svg>
    );
  }
  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
      </svg>
    );
  }
  if (name === "vscode") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M17.5 2L6.3 11.2 2 8l-1 1.2 4.1 3.8L1 16.8 2 18l4.3-3.2L17.5 24l5.5-2.7V4.7L17.5 2zm1.5 5.8v10.4L13 14l6-6.2z"/>
      </svg>
    );
  }
  if (name === "androidstudio") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M16.6 6.5l1.8-3.1a.5.5 0 1 0-.9-.5l-1.9 3.2a10.8 10.8 0 0 0-7.2 0L6.5 2.9a.5.5 0 1 0-.9.5l1.8 3.1A8.9 8.9 0 0 0 3 13.5h18a8.9 8.9 0 0 0-4.4-7zm-9 4.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zm8.8 0a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4z"/>
      </svg>
    );
  }
  if (name === "figma") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M8 2h4v5H8a2.5 2.5 0 1 1 0-5zm4 5h4a2.5 2.5 0 1 1 0 5h-4V7zm0 5h4a2.5 2.5 0 1 1 0 5h-4v-5zm-4 0h4v5H8a2.5 2.5 0 1 1 0-5zm0 5h4v2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 1-2.5z"/>
      </svg>
    );
  }
  if (name === "postman") {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m16 8-8 4 4 1 1 4 3-9z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M21.4 3.6L12.5 20.2a.8.8 0 0 1-1.4 0L2.6 3.6a.8.8 0 0 1 .8-1.2l8.3 1.7a.8.8 0 0 0 .3 0l8.6-1.7a.8.8 0 0 1 .8 1.2zM12 4.3L4.6 4.9 12 18.7l7.4-13.8L12 4.3z"/>
    </svg>
  );
}

export default function Stack() {
  const totalCount = stack.categories.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  return (
    <section id="again" data-8b-section="again" aria-labelledby="again-title">
      <div className="again__stage">
        {/* Subtle Top Metadata Bar like the reference image */}
        <div className="again__topbar">
          <span className="again__kicker">PRIMARY STACK</span>
          <span className="again__meta">
            04 · {totalCount} technologies
          </span>
        </div>

        <div className="again__head">
          <h2 className="m-text-3" id="again-title">
            {stack.title}
            <span className="m-dot" aria-hidden="true" />
          </h2>
          <p className="m-text-5 again__lead">{stack.lead}</p>
        </div>

        {/* 4 Category Columns */}
        <div className="stack__columns">
          {stack.categories.map((category) => (
            <div className="stack__col" key={category.name}>
              <h3 className="stack__col-title">{category.name}</h3>
              <div className="stack__rows">
                {category.items.map((item, index) => {
                  const number = String(index + 1).padStart(2, "0");
                  return (
                    <div className="stack__row" key={item.name}>
                      <span className="stack__row-num">{number}</span>
                      <div className="stack__row-info">
                        <div className="stack__row-heading">
                          <span className="stack__row-name">{item.name}</span>
                          {item.primary && (
                            <span
                              className="stack__row-dot"
                              title="Primary"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <span className="stack__row-desc">{item.desc}</span>
                      </div>
                      <div className="stack__row-icon" aria-hidden="true">
                        <TechIcon name={item.icon} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
