import stack from "../data/stack.json";

function CategoryIcon({ name }) {
  if (name === "code") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    );
  }
  if (name === "layers") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }
  if (name === "database") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

export default function Stack() {
  return (
    <section id="again" data-8b-section="again" aria-labelledby="again-title">
      <div className="again__stage">
        <div className="again__head">
          <h2 className="m-text-3" id="again-title">
            {stack.title}
            <span className="m-dot" aria-hidden="true" />
          </h2>
          <p className="m-text-5 again__lead">{stack.lead}</p>
        </div>

        <div className="stack__grid">
          {stack.categories.map((category, index) => (
            <div
              className="stack__card"
              key={category.name}
              style={{ "--i": index }}
            >
              <div className="stack__card-header">
                <div className="stack__icon-box">
                  <CategoryIcon name={category.icon} />
                </div>
                <div className="stack__header-info">
                  <h3 className="stack__category-title">{category.name}</h3>
                  <span className="stack__count-badge">
                    {category.items.length} Tech
                  </span>
                </div>
              </div>

              <ul className="stack__list">
                {category.items.map((item) => (
                  <li className="stack__item" key={item.name}>
                    <span className="stack__dot" aria-hidden="true" />
                    <div className="stack__item-body">
                      <strong className="stack__item-name">{item.name}</strong>
                      <span className="stack__item-desc">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
