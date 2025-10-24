import { useAuth } from '../context/AuthContext';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as ComplaintsIcon,
  Category as CategoryIcon,
  SupervisorAccount as AdminsIcon,
  Logout as LogoutIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Common menu items for both admin and superadmin
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: isSuperAdmin ? '/superadmin' : '/admin',
    },
    {
      text: 'Complaints',
      icon: <ComplaintsIcon />,
      path: isSuperAdmin ? '/superadmin/complaints' : '/admin/complaints',
    },
    {
      text: 'Categories',
      icon: <CategoryIcon />,
      path: isSuperAdmin ? '/superadmin/categories' : '/admin/categories',
    },
    {
      text: 'Profile',
      icon: <ProfileIcon />,
      path: isSuperAdmin ? '/superadmin/profile' : '/admin/profile',
    },
  ];

  // Additional menu items for superadmin only
  const superAdminItems = [
    {
      text: 'Manage Admins',
      icon: <AdminsIcon />,
      path: '/superadmin/admins',
    },
  ];

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'persistent'}
      anchor="left"
      open={isSidebarOpen}
      onClose={toggleSidebar}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          ...(isMobile
            ? {}
            : {
                top: '64px',
                height: 'calc(100% - 64px)',
              }),
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {user?.name || 'Admin User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isSuperAdmin ? 'Super Admin' : 'Admin'}
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}

          {isSuperAdmin &&
            superAdminItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;