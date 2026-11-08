import projects from "../data/projects.json";

export default function Projects() {
  return (
    <section
      id="projects"
      data-8b-section="projects"
      aria-labelledby="projects-title"
    >
      <div className="projects__stage">
        <div className="projects__head">
          <h2 className="m-text-3" id="projects-title" data-8b-motion="rise">
            {projects.title}
            <span className="m-dot" aria-hidden="true" />
          </h2>
          <p className="m-text-5 projects__lead">{projects.lead}</p>
        </div>

        <div className="projects__body">
          <div
            className="projects__frame"
            data-8b-items=":scope > img"
            data-8b-fixed="4"
          >
            {projects.items.map((project) => (
              <img
                className="projects__shot"
                key={project.image.src}
                src={project.image.src}
                width={project.image.width}
                height={project.image.height}
                alt={project.image.alt}
                loading="lazy"
              />
            ))}
          </div>

          <ol
            className="projects__list"
            data-8b-items=":scope > .story"
            data-8b-fixed="4"
          >
            {projects.items.map((project, index) => (
              <li className="story" key={project.name}>
                <p className="m-text-6 story__meta">
                  <span>{project.tag}</span> · Project{" "}
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="m-text-4 story__title">{project.name}</h3>
                <p className="m-text story__text">{project.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
