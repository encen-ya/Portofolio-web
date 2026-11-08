import journal from "../data/journal.json";

export default function Journal() {
  return (
    <section id="journal" data-8b-section="journal" aria-labelledby="journal-title">
      <div className="journal__head">
        <h2 className="m-text-3" id="journal-title" data-8b-motion="rise">
          {journal.title}
          <span className="m-dot" aria-hidden="true" />
        </h2>
      </div>
      <div className="journal__body">
        <div className="journal__frame" data-8b-items=":scope > img" data-8b-fixed="4">
          {journal.images.map((image) => (
            <img
              className="journal__shot"
              key={image.src}
              src={image.src}
              width={image.width}
              height={image.height}
              alt={image.alt}
              loading="lazy"
            />
          ))}
        </div>
        <ol className="journal__list" data-8b-items=":scope > .story" data-8b-fixed="4">
          {journal.stories.map((story) => (
            <li className="story" key={story.title}>
              <p className="m-text-6 story__meta">
                <span>{story.category}</span> ·{" "}
                <time dateTime={story.date}>{story.dateLabel}</time> · {story.readTime}
              </p>
              <h3 className="m-text-7">{story.title}</h3>
              <p className="m-text story__text">{story.excerpt}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}