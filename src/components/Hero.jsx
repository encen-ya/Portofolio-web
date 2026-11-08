import { Fragment, useRef } from "react";
import hero from "../data/hero.json";
import useHeroNameMotion from "../hooks/useHeroNameMotion";
import HeroSky from "./HeroSky";

function NameLine({ line, lineIndex }) {
  let charIndex = 0;

  return (
    <span className={`hero__line hero__line--${lineIndex + 1}`} aria-hidden="true">
      {line.split(" ").map((word, wordIndex, words) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className="hero__word">
            {[...word].map((character) => {
              const index = charIndex++;
              return (
                <span className="hero__char-mask" key={`${character}-${index}`}>
                  <span
                    className="hero__char-enter"
                    style={{ "--i": index, "--line": lineIndex }}
                  >
                    <span className="hero__char" data-char={character}>
                      {character}
                    </span>
                  </span>
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? (
            <span className="hero__space" aria-hidden="true" />
          ) : null}
        </Fragment>
      ))}
    </span>
  );
}

export default function Hero() {
  const nameRef = useRef(null);
  useHeroNameMotion(nameRef);

  return (
    <section id="hero" data-8b-section="hero" aria-labelledby="hero-title">
      <HeroSky />
      <div className="hero__sky-scrim" aria-hidden="true" />

      <h1
        ref={nameRef}
        className="hero__name"
        id="hero-title"
        aria-label={hero.name.full}
      >
        {hero.name.lines.map((line, index) => (
          <NameLine key={line} line={line} lineIndex={index} />
        ))}
      </h1>

      <figure className="hero__avatar">
        <img
          src={hero.photo.src}
          width={hero.photo.width}
          height={hero.photo.height}
          alt={hero.photo.alt}
          fetchPriority="high"
          draggable={false}
        />
        <span className="hero__avatar-dot" aria-hidden="true" />
      </figure>

      <p className="hero__hook">
        <span className="hero__hook-dot" aria-hidden="true" />
        {hero.hook}
      </p>
    </section>
  );
}