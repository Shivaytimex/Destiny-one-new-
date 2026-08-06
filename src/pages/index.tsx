import Head from "next/head";
import { useEffect, useState } from "react";

const defaultExperience = "/actual-app/index.html?previewAccess=1&preview=home";

/**
 * Visual-parity bridge for the latest reviewed DestinyOne experience.
 *
 * The maintainable Next.js routes remain available independently (start at
 * /preview or /web-home). This root route intentionally loads the verified
 * static web export so product review never drifts from the latest approved UI.
 */
export default function ActualDestinyOnePage() {
  const [experienceUrl, setExperienceUrl] = useState(defaultExperience);

  useEffect(() => {
    setExperienceUrl(
      window.location.search
        ? `/actual-app/index.html${window.location.search}`
        : defaultExperience,
    );
  }, []);

  return (
    <>
      <Head>
        <title>DestinyOne</title>
        <meta
          name="description"
          content="Meaningful connections. Extraordinary futures."
        />
      </Head>
      <iframe
        title="DestinyOne application"
        src={experienceUrl}
        className="fixed inset-0 h-full w-full border-0 bg-[#fffaf7]"
        allow="camera; microphone; geolocation; clipboard-read; clipboard-write"
      />
    </>
  );
}
