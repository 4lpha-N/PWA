import { PageWrapper } from "./_PageWrapper";
import { useAppContext } from "../context/app-context";
import { Grid, Box, useMediaQuery } from "@mui/material";
import { Backlight } from "@/components/ui/backlight";
import { MagicCard } from "@/components/ui/magic-card";
import OPShip from "../assets/op-ship.jpg";

interface MagicCardProps {
  gradientSize: number;
  mode: "gradient" | undefined;
  gradientColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function Page1() {
  const { labels } = useAppContext();
  const isMobile = useMediaQuery("(max-width:599px)");

  const magicCardProps: MagicCardProps = {
    gradientSize: isMobile ? 50 : 100,
    mode: "gradient",
    gradientColor: "var(--primary)",
    gradientFrom: "var(--primary)",
    gradientTo: "var(--primary)",
  };

  const backlightProps = {
    blur: 17,
    saturate: 3,
    contrast: 1,
    borderRadius: 15,
  };

  return (
    <PageWrapper>
      {/* <div style={{ background: "var(--primary-1)", height: "100%" }}> */}
      <div>{labels.page1}</div>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {Array.from({ length: 2 }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3 }}>
            <Backlight
              blur={backlightProps.blur}
              saturate={backlightProps.saturate}
              contrast={backlightProps.contrast}
              borderRadius={backlightProps.borderRadius}
              disabled={false}
            >
              <MagicCard
                gradientSize={magicCardProps.gradientSize}
                mode={magicCardProps.mode}
                gradientColor={magicCardProps.gradientColor}
                gradientFrom={magicCardProps.gradientFrom}
                gradientTo={magicCardProps.gradientTo}
              >
                <Box
                  component="img"
                  src={OPShip}
                  alt="OP Ship"
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    // transition: "transform 0.3s ease",
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
          <Backlight
            blur={backlightProps.blur}
            saturate={backlightProps.saturate}
            contrast={backlightProps.contrast}
            borderRadius={backlightProps.borderRadius}
          >
            <MagicCard
              gradientSize={magicCardProps.gradientSize}
              mode={magicCardProps.mode}
              gradientColor={magicCardProps.gradientColor}
              gradientFrom={magicCardProps.gradientFrom}
              gradientTo={magicCardProps.gradientTo}
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
      {/* </div> */}
    </PageWrapper>
  );
}
