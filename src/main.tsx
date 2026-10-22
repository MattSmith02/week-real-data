import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TheWeekArticle from "./TheWeekArticle";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div
      className="min-h-screen bg-[#F4F0EA] text-[#0A0A0A]"
      style={{ fontFamily: "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif" }}
    >
      <TheWeekArticle version="real" />
    </div>
  </StrictMode>,
);
