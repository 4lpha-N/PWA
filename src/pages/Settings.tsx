import { PageWrapper } from "./_PageWrapper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { ThemeAnimationPreset } from "../context/app-context";
import { useAppContext } from "../context/app-context";
// import { MagicCard } from "@/components/ui/magic-card";
import { Grid, Box, Avatar, Button } from "@mui/material";
import Font from "@/components/custom/Font";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
// import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import { useAuth } from "@/hooks/useAuth";
import { Backlight } from "../components/ui/backlight";
import Logout from "@mui/icons-material/Logout";
// interface MagicCardProps {
//   gradientSize: number;
//   mode: "gradient" | undefined;
//   gradientColor: string;
//   gradientFrom: string;
//   gradientTo: string;
// }

export default function Settings() {
  const {
    labels,
    theme,
    availablePresets,
    themeAnimationPreset,
    setThemeAnimationPreset,
  } = useAppContext();
  const { currentUser, role, logout } = useAuth();

  const avatarSize = 100;
  const avatarSrc = currentUser?.photoURL?.trim() || undefined;
  const avatarAlt =
    currentUser?.displayName ?? currentUser?.email ?? "User Avatar";

  const backlightProps = {
    blur: 17,
    saturate: 3,
    contrast: 1,
    borderRadius: 16,
  };

  // const isMobile = useMediaQuery("(max-width:599px)");
  // const magicCardProps: MagicCardProps = {
  //   gradientSize: isMobile ? 50 : 100,
  //   mode: "gradient",
  //   gradientColor: "var(--primary)",
  //   gradientFrom: "var(--primary)",
  //   gradientTo: "var(--primary)",
  // };
  // <MagicCard
  //           gradientSize={magicCardProps.gradientSize}
  //           mode={magicCardProps.mode}
  //           gradientColor={magicCardProps.gradientColor}
  //           gradientFrom={magicCardProps.gradientFrom}
  //           gradientTo={magicCardProps.gradientTo}
  //         ></MagicCard>

  return (
    <PageWrapper>
      {/* <Font type="headline" size="h6">
        {labels.settings}
      </Font> */}
      <Grid container spacing={4} sx={{ mt: 1 }}>
        {currentUser && (
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5 }}>
            <Card
              elevation={1}
              sx={{
                padding: "8px",
                background:
                  theme === "dark"
                    ? "var(--background-1)"
                    : "var(--background-2)",
                color: "var(--foreground)",
                borderRadius: "8px",
              }}
            >
              <CardHeader
                avatar={
                  <Backlight
                    blur={backlightProps.blur}
                    saturate={backlightProps.saturate}
                    contrast={backlightProps.contrast}
                    borderRadius={backlightProps.borderRadius}
                    disabled={false}
                    startAnimation={{ enabled: true, duration: 2000 }}
                  >
                    <Avatar
                      aria-label="label"
                      src={avatarSrc}
                      alt={avatarAlt}
                      sizes={`${avatarSize}px`}
                      variant="square"
                      sx={{
                        // aspectRatio: "2/3",
                        width: avatarSize,
                        height: "auto",
                        borderRadius: "16px",
                        background: "var(--background)",
                      }}
                    >
                      R
                    </Avatar>
                  </Backlight>
                }
                title={
                  <Font type="headline" size="h6">
                    {currentUser?.displayName ?? currentUser?.email ?? "–"}
                  </Font>
                }
                subheader={
                  <>
                    <Font type="text" size="md">
                      {currentUser?.email ?? "-"}
                    </Font>
                    {role && (
                      <Font
                        type="text"
                        size="md"
                        style={{ marginTop: 4, fontStyle: "italic" }}
                      >
                        {role}
                      </Font>
                    )}
                  </>
                }
                sx={{
                  color: "var(--foreground)",
                  "& .MuiCardHeader-subheader": {
                    color: "var(--foreground)",
                    mt: 1,
                  },
                  gap: 3,
                }}
              />
              {/* <CardMedia component="img" height="194" image={img} alt={title} /> */}
              {/* <CardContent>{content}</CardContent> */}
              <CardActions disableSpacing>
                <Button
                  variant={"text"}
                  color={"secondary"}
                  size="small"
                  onClick={logout}
                  title={"Logout"}
                  aria-label={"Logout"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: "0.875rem",
                  }}
                >
                  <div>Ausloggen</div> {<Logout fontSize="small" />}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Box
            sx={{ minWidth: 120 }}
            style={{ background: "var(--background)" }}
          >
            <FormControl
              fullWidth
              sx={{
                mt: 2,
                color: "var(--foreground)",
                "::placeholder": { color: "var(--foreground)" },
                borderColor: "var(--foreground)",
              }}
            >
              <InputLabel
                id="demo-simple-select-label"
                sx={{
                  color: "var(--foreground)",
                  background: "var(--background)",
                  padding: "0 4px",
                }}
              >
                {labels.preset}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={themeAnimationPreset}
                label={labels.preset}
                onChange={(event) =>
                  setThemeAnimationPreset(
                    event.target.value as ThemeAnimationPreset,
                  )
                }
                sx={{
                  color: "var(--foreground)",
                  "::placeholder": { color: "var(--foreground)" },
                  border: "1px solid var(--foreground)",
                  outline: "none",
                  "& .MuiSvgIcon-root": { color: "var(--foreground)" },
                  "& fieldset": { border: "none" },
                }}
              >
                {availablePresets.map((preset) => (
                  <MenuItem key={preset} value={preset}>
                    {preset}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}
