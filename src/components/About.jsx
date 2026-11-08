import about from "../data/about.json";
import AboutOrbit from "./AboutOrbit";

export default function About() {
  return (
    <section id="about" data-8b-section="about" aria-labelledby="about-title">
      <div className="about__head">
        <h2 className="m-text-3 about__title" id="about-title" data-8b-motion="rise">
          {about.title}
          <span className="m-dot" aria-hidden="true" />
        </h2>
        <div className="about__body">
          <div className="about__text">
            {about.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="m-text-5 about__lead"
                data-8b-motion="ink"
                data-8b-split="words"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div
            className="about__visual"
            data-8b-motion="arrive"
            data-8b-enter="82%"
          >
            <AboutOrbit />
          </div>
        </div>
      </div>
    </section>
  );
}