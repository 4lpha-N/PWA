import { PageWrapper } from "./_PageWrapper";
import { useAppContext } from "../context/app-context";

export default function Home() {
  const { labels } = useAppContext();
  return (
    <PageWrapper>
      {/* <div style={{ background: "var(--primary)", height: "100%" }}> */}
      <div>{labels.home}</div>
      {/* </div> */}
    </PageWrapper>
  );
}
