import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "lean ai",
    short_name: "lean ai",
    description: "Triaje y reventa de stock asistido por IA",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f6fb",
    theme_color: "#7c5cff",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
