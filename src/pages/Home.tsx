import { PageWrapper } from "./_PageWrapper";
// import { useAuth } from "@/hooks/useAuth";
import { useAppContext } from "../context/app-context";
// import FirestoreTest from "@/components/dev/firestoreTest";

export default function Home() {
  // const { currentUser } = useAuth();
  const { labels } = useAppContext();

  return (
    <PageWrapper>
      {/* <div style={{ background: "var(--primary)", height: "100%" }}> */}
      <div>{labels.home}</div>
      {/* <FirestoreTest /> */}
      {/* </div> */}
    </PageWrapper>
  );
}
