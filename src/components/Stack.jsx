import stack from "../data/stack.json";

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
        <div className="again__swing">
          <ul className="again__wheel" data-8b-items=":scope > .partner">
            {stack.items.map((item) => (
              <li className="partner" key={item.name}>
                <div className="partner__card">
                  <span className="m-badge partner__year">{item.tag}</span>
                  <div className="partner__text">
                    <h3 className="m-text-4 partner__name">{item.name}</h3>
                    <p className="m-text partner__line">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}