import About from "./components/About";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navigation from "./components/Navigation";
import Projects from "./components/Projects";
import Stack from "./components/Stack";
import useSiteMotion from "./hooks/useSiteMotion";

export default function App() {
  useSiteMotion();

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Stack />
        <Experience />
      </main>
      <Footer />
    </>
  );
}
