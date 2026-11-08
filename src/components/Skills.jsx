import skills from "../data/skills.json";

export default function Skills() {
  return (
    <section
      id="capabilities"
      data-8b-section="capabilities"
      aria-labelledby="capabilities-title"
    >
      <div className="capabilities__head">
        <h2
          className="m-text-3"
          id="capabilities-title"
          data-8b-motion="rise"
        >
          {skills.title}
          <span className="m-dot" aria-hidden="true" />
        </h2>
        <p className="m-text-5 capabilities__lead">{skills.lead}</p>
      </div>
      <ol
        className="capabilities__deck"
        data-8b-items=":scope > .service"
        data-8b-fixed="4"
      >
        {skills.items.map((service) => (
          <li className="service m-surface" key={service.title}>
            <div className="service__text">
              <h3 className="m-text-4">{service.title}</h3>
              <p className="m-text-5 service__line">{service.description}</p>
              <ul className="service__tags" data-8b-items=":scope > li">
                {service.tags.map((tag) => (
                  <li className="m-badge" key={tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="service__media" data-8b-motion="iris" data-8b-enter="86%">
              <img
                src={service.image.src}
                width={service.image.width}
                height={service.image.height}
                alt={service.image.alt}
                loading="lazy"
              />
            </div>
            <span className="service__shade" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </section>
  );
}