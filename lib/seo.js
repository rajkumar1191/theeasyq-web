export const defaultSEO = {
  title: "EasyQ – Book OPD Tokens Instantly",
  description:
    "EasyQ lets you book hospital tokens from your phone, skip long queues, and see doctors in 15 minutes. Trusted by top hospitals for fast, secure OPD visits.",
  keywords:
    "hospital token booking, OPD appointment, healthcare app, skip queues, doctor appointment",
  author: "EasyQ Team",
  siteUrl: "https://theeasyq.com",
  image: "https://theeasyq.com/assets/img/logo.png",
  twitterHandle: "@EasyQApp",
};

export function generateMetaTags({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = defaultSEO.image,
  url = defaultSEO.siteUrl,
  type = "website",
  author = defaultSEO.author,
  publishedTime,
  modifiedTime,
} = {}) {
  return {
    title,
    description,
    keywords,
    author,
    openGraph: {
      title,
      description,
      url,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      site_name: "EasyQ",
      ...(publishedTime && { article: { published_time: publishedTime } }),
      ...(modifiedTime && { article: { modified_time: modifiedTime } }),
    },
    twitter: {
      handle: defaultSEO.twitterHandle,
      site: defaultSEO.twitterHandle,
      cardType: "summary_large_image",
      title,
      description,
      image,
    },
    canonical: url,
  };
}

export function generateStructuredData({
  type = "Organization",
  name = "EasyQ",
  description = defaultSEO.description,
  url = defaultSEO.siteUrl,
  logo = defaultSEO.image,
  ...props
}) {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url,
    ...(logo && { logo }),
    ...props,
  };

  if (type === "BlogPosting") {
    return {
      ...baseData,
      publisher: {
        "@type": "Organization",
        name: "EasyQ",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
    };
  }

  return baseData;
}
