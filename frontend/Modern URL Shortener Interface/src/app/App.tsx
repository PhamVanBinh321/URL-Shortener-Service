import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { LinksPage } from "./components/LinksPage";
import { LinkDetail } from "./components/LinkDetail";
import { AnalyticsPage } from "./components/AnalyticsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "dashboard" | "links" | "linkDetail" | "analytics">("landing");
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);

  const handleViewLinkDetail = (linkId: number) => {
    setSelectedLinkId(linkId);
    setCurrentPage("linkDetail");
  };

  return (
    <div className="size-full">
      {currentPage === "landing" ? (
        <LandingPage onNavigateToDashboard={() => setCurrentPage("dashboard")} />
      ) : currentPage === "dashboard" ? (
        <Dashboard 
          onNavigateToLanding={() => setCurrentPage("landing")} 
          onNavigateToLinks={() => setCurrentPage("links")}
          onNavigateToAnalytics={() => setCurrentPage("analytics")}
        />
      ) : currentPage === "links" ? (
        <LinksPage 
          onNavigateToLanding={() => setCurrentPage("landing")}
          onNavigateToHome={() => setCurrentPage("dashboard")}
          onViewLinkDetail={handleViewLinkDetail}
          onNavigateToAnalytics={() => setCurrentPage("analytics")}
        />
      ) : currentPage === "analytics" ? (
        <AnalyticsPage
          onNavigateToLanding={() => setCurrentPage("landing")}
          onNavigateToHome={() => setCurrentPage("dashboard")}
          onNavigateToLinks={() => setCurrentPage("links")}
        />
      ) : (
        <LinkDetail 
          onBack={() => setCurrentPage("links")}
          linkId={selectedLinkId || 1}
        />
      )}
    </div>
  );
}