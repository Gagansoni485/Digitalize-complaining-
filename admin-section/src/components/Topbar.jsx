import { AppBar, Toolbar, IconButton, Typography, Box, Badge } from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Topbar = ({ isSidebarOpen, toggleSidebar }) => {
  const { isSuperAdmin } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: 3,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          {isSuperAdmin ? 'Super Admin Dashboard' : 'Admin Dashboard'}
        </Typography>

        <Box sx={{ display: 'flex' }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;