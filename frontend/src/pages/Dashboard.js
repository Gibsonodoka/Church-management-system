import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Box,
  Paper,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Switch,
  useTheme,
  createTheme,
  ThemeProvider
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 240;

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(true); // Sidebar state
  const [anchorEl, setAnchorEl] = useState(null); // Profile menu state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Auth Error:", err);
        localStorage.removeItem("token");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  // Theme Configuration
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", backgroundColor: theme.palette.background.default, minHeight: "100vh" }}>
        <CssBaseline />

        {/* Header */}
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={() => setOpen(!open)}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
              Church CMS Dashboard
            </Typography>

            {/* Dark Mode Toggle */}
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Profile Dropdown */}
            <IconButton onClick={handleProfileMenuOpen} color="inherit">
              <Avatar>{user?.name ? user.name[0].toUpperCase() : "U"}</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <PersonIcon sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1, color: "red" }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Sidebar (Collapsible) */}
        <Drawer
          variant="permanent"
          sx={{
            width: open ? drawerWidth : 60,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: open ? drawerWidth : 60,
              boxSizing: "border-box",
              transition: "width 0.3s",
              overflowX: "hidden",
            },
          }}
        >
          <Toolbar />
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon><DashboardIcon /></ListItemIcon>
                {open && <ListItemText primary="Dashboard" />}
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon><SettingsIcon /></ListItemIcon>
                {open && <ListItemText primary="Settings" />}
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar /> 
          <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.name || "User"}!
            </Typography>
            <Typography variant="body1">
              This is your dashboard. Use the sidebar to navigate.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
