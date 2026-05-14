import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
// import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { type IconButtonProps } from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Font from "./Font";
import { Backlight } from "../ui/backlight";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

interface AnimeCardProps {
  expand?: boolean;
  title: string;
  subtitle: string;
  img: string;
  content: string;
  moreContent: string;
}

export default function AnimeCard({
  expand = false,
  title,
  subtitle,
  img,
  content,
  moreContent,
}: AnimeCardProps) {
  const [expanded, setExpanded] = React.useState(expand);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const backlightProps = {
    blur: 17,
    saturate: 3,
    contrast: 1,
    borderRadius: 15,
  };

  return (
    <Card
      elevation={1}
      sx={{
        padding: "8px 16px",
        background: "var(--background-d1)",
        color: "var(--foreground)",
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
              src={img}
              variant="square"
              sx={{
                aspectRatio: "2/3",
                width: 150,
                height: "auto",
                borderRadius: 1,
                background: "var(--background)",
              }}
            >
              R
            </Avatar>
          </Backlight>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon sx={{ color: "var(--foreground)" }} />
          </IconButton>
        }
        title={
          <Font type="headline" size="h5">
            {title}
          </Font>
        }
        subheader={
          <Font type="text" size="md">
            <div>{subtitle}</div>
            <div style={{ marginTop: 24 }}>{content}</div>
          </Font>
        }
        sx={{
          color: "var(--foreground)",
          "& .MuiCardHeader-subheader": {
            color: "var(--foreground)",
            mt: 1,
          },
        }}
      />
      {/* <CardMedia component="img" height="194" image={img} alt={title} /> */}
      {/* <CardContent>{content}</CardContent> */}
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <MoreVertIcon fontSize="small" sx={{ color: "var(--foreground)" }} />
        </IconButton>
        {/* <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          sx={{ color: "var(--foreground)" }}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ color: "var(--foreground)" }}>
          {moreContent}
        </CardContent>
      </Collapse>
    </Card>
  );
}
