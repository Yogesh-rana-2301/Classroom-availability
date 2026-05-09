import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

export default function ClassroomCard({ room, returnTo }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 1,
      }}
    >
      <CardContent sx={{ flex: "1 1 auto", p: 1, "&:last-child": { pb: 1 } }}>
        <Typography variant="h6" component="div">
          {room.roomCode}
        </Typography>
      </CardContent>
      <CardActions sx={{ flex: "0 0 auto", pl: 1 }}>
        <Button
          component={Link}
          to={`/classrooms/${room.id}/availability`}
          state={{ returnTo }}
          size="small"
          variant="outlined"
          startIcon={<EventAvailableIcon />}
        >
          Check
        </Button>
        <IconButton aria-describedby={id} onClick={handleClick} size="small">
          <InfoOutlinedIcon />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Box sx={{ p: 2, maxWidth: 300 }}>
            <Typography variant="subtitle2" gutterBottom>
              Building: {room.building}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Capacity: {room.capacity}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Facilities: {room.facilities}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Maintenance: {room.maintenance}
            </Typography>
          </Box>
        </Popover>
      </CardActions>
    </Card>
  );
}
