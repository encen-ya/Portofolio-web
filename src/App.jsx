import About from "./components/About";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Journal from "./components/Journal";
import Navigation from "./components/Navigation";
import Skills from "./components/Skills";
import Stack from "./components/Stack";
import Work from "./components/Work";
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
        <Work />
        <Stack />
        <Skills />
        <Journal />
      </main>
      <Footer />
    </>
  );
}