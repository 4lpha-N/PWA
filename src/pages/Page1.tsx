import { PageWrapper } from "./_PageWrapper";
import { AnimeInfoScraper } from "@/components/custom/AnimeInfoScraper";
import { RequestRole } from "@/components/custom/RequestRole";

export default function Page1() {
  return (
    <PageWrapper>
      {/* ── Sonderrechte beantragen ── */}
      <div style={{ padding: "24px 0" }}>
        <RequestRole />
      </div>

      {/* ── Anime Info Scraper ── */}
      <AnimeInfoScraper />
    </PageWrapper>
  );
}
