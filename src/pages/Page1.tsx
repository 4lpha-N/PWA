import { PageWrapper } from "./PageWrapper";
import { useAppContext } from "../context/app-context";
import { Grid, Box } from "@mui/material";
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
        {Array.from({ length: 2 }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
            <Backlight blur={15}>
              <MagicCard
                gradientSize={100}
                mode="gradient"
                gradientColor="var(--primary)"
                gradientFrom="var(--primary)"
                gradientTo="var(--primary)"
              >
                <Box
                  component="img"
                  src={OPShip}
                  alt="OP Ship"
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    // "&:hover": {
                    //   transform: "scale(1.25)",
                    // },
                  }}
                />
              </MagicCard>
            </Backlight>
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <Backlight blur={15}>
            <MagicCard
              gradientSize={100}
              mode="gradient"
              gradientColor="var(--primary)"
              gradientFrom="var(--primary)"
              gradientTo="var(--primary)"
            >
              <Box
                component="img"
                src={OPShip}
                alt="OP Ship"
                sx={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  // "&:hover": {
                  //   transform: "scale(1.25)",
                  // },
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
