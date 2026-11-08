import projects from "../data/projects.json";

export default function Work() {
  return (
    <section id="work" data-8b-section="work" aria-labelledby="work-title">
      <div className="work__plate" aria-hidden="true" />
      <div className="work__stage">
        <div className="work__head">
          <h2 className="m-text-3" id="work-title">
            {projects.title}
            <span className="m-dot" aria-hidden="true" />
          </h2>
          <p className="m-text-5 work__lead">{projects.lead}</p>
        </div>
        <div className="work__window">
          <ul className="work__track" data-8b-items=":scope > .case" data-8b-fixed="3">
            {projects.items.map((project) => (
              <li className="case" key={project.name}>
                <div className="case__media">
                  <img
                    className="case__img"
                    src={project.image.src}
                    width={project.image.width}
                    height={project.image.height}
                    alt={project.image.alt}
                    loading="lazy"
                  />
                </div>
                <span className="m-badge case__tag">{project.tag}</span>
                <div className="case__text">
                  <h3 className="m-text-4 case__name">{project.name}</h3>
                  <p className="m-text-5 case__line">{project.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}