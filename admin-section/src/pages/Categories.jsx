import { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { fetchSystemStats } from '../utils/api';
import { useNavigate, useLocation } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const stats = await fetchSystemStats();
        setCategories(stats.categories || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load category statistics.');
        setLoading(false);
      }
    };

    load();
  }, []);

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
        Complaint Categories
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Total Complaints</TableCell>
              <TableCell>Assigned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow
                key={cat._id || cat.name}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`${location.pathname.includes('superadmin') ? '/superadmin' : '/admin'}/complaints?category=${encodeURIComponent(cat._id || cat.name)}`)}
              >
                              <TableCell>{cat._id || cat.name}</TableCell>
                <TableCell>{cat.count}</TableCell>
                <TableCell>{cat.assigned}</TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Categories;
