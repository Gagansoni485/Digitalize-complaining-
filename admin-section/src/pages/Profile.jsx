import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchAdminById } from '../utils/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminById(user.id);
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile.');
        setLoading(false);
      }
    };

    if (user?.id) {
      load();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">{profile.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{profile.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Department
            </Typography>
            <Typography variant="body1">{profile.department}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1">{profile.role}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Specializations
            </Typography>
            <Typography variant="body1">{profile.specializations?.join(', ') || 'N/A'}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
