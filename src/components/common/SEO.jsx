import { Helmet } from "react-helmet-async";

export default function SEO({
  title,
  description,
}) {
  return (
    <Helmet>
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />

      <meta
        name="keywords"
        content="
        Kartikey Kumar,
        Frontend Developer,
        React Developer,
        JavaScript Developer,
        Tailwind CSS,
        Web Developer,
        Portfolio,
        React Portfolio,
        Full Stack Developer
        "
      />

      <meta
        name="author"
        content="Kartikey Kumar"
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:url"
        content="https://your-domain.vercel.app"
      />

      <meta
        property="og:image"
        content="/og-image.jpg"
      />

      <meta
        name="twitter:card"
        content="summary_large_image"
      />
    </Helmet>
  );
}