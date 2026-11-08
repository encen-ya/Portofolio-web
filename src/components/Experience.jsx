import experience from "../data/experience.json";

export default function Experience() {
  return (
    <section
      id="experience"
      data-8b-section="experience"
      aria-labelledby="experience-title"
    >
      <div className="experience__stage">
        <div className="experience__head">
          <h2 className="m-text-3" id="experience-title">
            {experience.title}
            <span className="m-dot" aria-hidden="true" />
          </h2>
          <p className="m-text-5 experience__lead">{experience.lead}</p>
        </div>

        <div className="experience__list">
          {experience.items.map((item) => (
            <div className="experience__row" key={item.number}>
              <div className="experience__num">{item.number}</div>
              <div className="experience__content">
                <div className="experience__top">
                  <span className="experience__cat">{item.category}</span>
                  <span className="experience__period">
                    <span className="experience__dot" aria-hidden="true" />
                    {item.period}
                  </span>
                </div>
                <h3 className="experience__role">{item.role}</h3>
                <p className="experience__desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

