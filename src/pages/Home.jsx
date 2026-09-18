import Layout from "../components/layout/Layout";
import Hero from "../components/home/Hero";
import About from "../components/home/About";
import Skills from "../components/home/Skills";
import FeaturedProjects from "../components/home/FeaturedProjects";
import ExperiencePreview from "../components/home/ExperiencePreview";
import ContactCTA from "../components/home/ContactCTA";
import PageWrapper from "../components/common/PageWrapper";
import Reveal from "../components/common/Reveal";

import SEO from "../components/common/SEO";

export default function Home() {
  return (
    <Layout>
      <SEO
        title="Kartikey Kumar | Full Stack Developer"
        description="Full Stack Developer skilled in React, Node.js, MongoDB, and modern web development."
      />
      <PageWrapper>
        <Hero />

        <Reveal>
          <About />
        </Reveal>

        <Reveal>
          <Skills />
        </Reveal>

        <Reveal>
          <FeaturedProjects />
        </Reveal>

        <Reveal>
          <ExperiencePreview />
        </Reveal>

        <Reveal>
          <ContactCTA />
        </Reveal>
      </PageWrapper>
    </Layout>
  );
}
