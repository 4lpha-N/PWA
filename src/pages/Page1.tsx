import { PageWrapper } from "./PageWrapper";
import { useAppContext } from "../context/app-context";
import { Grid } from "@mui/material";
import { Backlight } from "@/components/ui/backlight";
import { MagicCard } from "@/components/ui/magic-card";
import OPShip from "../assets/op-ship.jpg";

export default function Page1() {
  const { labels } = useAppContext();
  return (
    <PageWrapper>
      {/* <div style={{ background: "var(--primary-1)", height: "100%" }}> */}
      {labels.page1}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Backlight>
            <MagicCard
              gradientSize={100}
              mode="gradient"
              gradientColor="var(--primary)"
              gradientFrom="var(--primary)"
              gradientTo="var(--primary)"
            >
              <img
                src={OPShip}
                alt="OP Ship"
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                }}
              />
            </MagicCard>
          </Backlight>
        </Grid>
      </Grid>
      <Backlight />
      {/* </div> */}
    </PageWrapper>
  );
}
