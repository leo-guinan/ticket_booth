import { useEffect } from "react";
import * as Fathom from "fathom-client";

export function FathomProvider({ siteId, children }: { siteId: string; children: React.ReactNode }) {
  useEffect(() => {
    Fathom.load(siteId, {
      includedDomains: [window.location.hostname],
    });

    function onRouteChange() {
      Fathom.trackPageview();
    }

    window.addEventListener("popstate", onRouteChange);
    return () => window.removeEventListener("popstate", onRouteChange);
  }, [siteId]);

  return <>{children}</>;
}
