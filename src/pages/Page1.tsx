import { PageWrapper } from "./_PageWrapper";
// import { useAppContext } from "../context/app-context";
import { Grid, Box, useMediaQuery } from "@mui/material";
import { Backlight } from "@/components/ui/backlight";
import { MagicCard } from "@/components/ui/magic-card";
import OPShip from "../assets/op-ship.jpg";
import Font from "@/components/custom/Font";
// import FontsDevPage from "@/components/dev/fonts";

interface MagicCardProps {
  gradientSize: number;
  mode: "gradient" | undefined;
  gradientColor: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function Page1() {
  // const { labels } = useAppContext();
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

  const cards = [
    {
      id: 1,
      image: OPShip,
      offset: { xs: 0, sm: 1, md: 2 },
    },
    {
      id: 2,
      image: OPShip,
      offset: { xs: 0, sm: 2, md: 2 },
    },
  ];

  return (
    <PageWrapper>
      {/* <div>{labels.page1}</div> */}
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {cards.map((card) => (
          <Grid
            key={card.id}
            size={{ xs: 6, sm: 4, md: 3 }}
            offset={card.offset}
          >
            <Backlight
              blur={backlightProps.blur}
              saturate={backlightProps.saturate}
              contrast={backlightProps.contrast}
              borderRadius={backlightProps.borderRadius}
              disabled={false}
              startAnimation={{ enabled: true, duration: 2000 }}
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
      </Grid>
      <Font type="headline" size="xxl" weight={700} style={{ marginTop: 40 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
        urna eu tincidunt consectetur, nisi nisl aliquam enim, vitae porta
        sapien enim nec dui. Pellentesque habitant morbi tristique senectus et
        netus et malesuada fames ac turpis egestas. Nullam ac erat at erat
        dictum cursus. Etiam euismod, urna eu tincidunt consectetur, nisi nisl
        aliquam enim, vitae porta sapien enim nec dui. Pellentesque habitant
        morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        Nullam ac erat at erat dictum cursus. Etiam euismod urna eu tincidunt.
      </Font>
      {/* <div style={{ marginTop: 40 }}>
        <FontsDevPage />
      </div> */}
    </PageWrapper>
  );
}
