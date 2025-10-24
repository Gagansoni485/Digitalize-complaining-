import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme, Card, CardContent } from '@mui/material';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { fetchAdmins } from '../utils/api';

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await fetchAdmins();
      setAdmins(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to load admins.');
      setLoading(false);
    }
  };

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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Admins
      </Typography>

      {isMobile ? (
        // Card layout for mobile
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {admins.map((admin) => (
            <Card key={admin._id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{admin.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {admin.email}
                </Typography>
                <Typography variant="body2">Department: {admin.department}</Typography>
                <Typography variant="body2">
                  Specializations: {admin.specializations?.join(', ') || '—'}
                </Typography>
                <FormControlLabel
                  control={<Switch checked={admin.isActive} disabled />}
                  label={admin.isActive ? 'Active' : 'Inactive'}
                />
              </CardContent>
            </Card>
          ))}
          {admins.length === 0 && (
            <Typography align="center" sx={{ mt: 4 }}>
              No admins found.
            </Typography>
          )}
        </Box>
      ) : (
        // Table layout for desktop/tablet
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Specializations</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id}>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.department}</TableCell>
                  <TableCell>{admin.specializations?.join(', ')}</TableCell>
                  <TableCell>
                    <FormControlLabel
                      control={<Switch checked={admin.isActive} disabled />}
                      label={admin.isActive ? 'Active' : 'Inactive'}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {admins.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No admins found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageAdmins;
