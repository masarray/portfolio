import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import DesktopShell from "@/components/desktop/DesktopShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ari Sulistiono — Live Desktop Portfolio" },
      {
        name: "description",
        content:
          "Substation automation, IEC 61850, protocol diagnostics, AI tooling and audio systems — presented as a live macOS-style desktop.",
      },
      { property: "og:title", content: "Ari Sulistiono — Live Desktop Portfolio" },
      {
        property: "og:description",
        content:
          "Substation automation, IEC 61850, protocol diagnostics, AI tooling and audio systems — presented as a live macOS-style desktop.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  // Client-only mount: the desktop relies on window/canvas/RAF.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div style={{ width: "100vw", height: "100vh", background: "#05050b" }} />;
  }
  return <DesktopShell />;
}
