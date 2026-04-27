import { PageWrapper } from "./_PageWrapper";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { ThemeAnimationPreset } from "../context/app-context";
import { useAppContext } from "../context/app-context";

export default function Settings() {
  const {
    labels,
    availablePresets,
    themeAnimationPreset,
    setThemeAnimationPreset,
  } = useAppContext();
  return (
    <PageWrapper>
      {labels.settings}
      <Box sx={{ minWidth: 120 }}>
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
    </PageWrapper>
  );
}
