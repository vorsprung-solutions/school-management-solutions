import { useEffect, useState } from "react";

const useDomain = () => {
  const [identifier, setIdentifier] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("identifier");
    if (saved) {
      setIdentifier(saved);
      return;
    }

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname; 
      // e.g. "www.school1.neexg.com"

      const parts = hostname.split(".");

      let id = hostname; // default

      if (parts.length === 2) {
        // root domain like "neexg.com"
        id = hostname;
      } else if (parts.length > 2) {
        const first = parts[0];
        if (first === "www") {
          if (parts.length === 3) {
            // e.g. "www.neexg.com" → "neexg.com"
            id = parts.slice(1).join(".");
          } else {
            // e.g. "www.school1.neexg.com" → "school1"
            id = parts[1];
          }
        } else {
          // e.g. "neexg-school.vercel.app" → "neexg-school"
          id = first;
        }
      }

      setIdentifier(id);
      localStorage.setItem("identifier", id);
    }
  }, []);

  return identifier;
};

export default useDomain;
