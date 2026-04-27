import { PageWrapper } from "./PageWrapper";
import { useAppContext } from "../context/app-context";

export default function Page1() {
  const { labels } = useAppContext();
  return (
    <PageWrapper>
      {/* <div style={{ background: "var(--primary-1)", height: "100%" }}> */}
      {labels.page1}
      {/* </div> */}
    </PageWrapper>
  );
}
