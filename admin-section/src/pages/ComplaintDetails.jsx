import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchComplaintById } from '../utils/api';

const StatusChip = ({ status }) => {
  const colorMap = {
    open: 'info',
    received: 'info',
    assigned: 'warning',
    in_progress: 'warning',
    resolved: 'success',
    closed: 'default',
  };
  return <Chip label={status} color={colorMap[status] || 'default'} size="small" />;
};

const ComplaintDetails = () => {
  const { complaintId } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchComplaintById(complaintId);
        setComplaint(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching complaint:', err);
        setError('Failed to load complaint.');
        setLoading(false);
      }
    };

    if (complaintId) {
      load();
    }
  }, [complaintId]);

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

  if (!complaint) return null;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {complaint.title}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1">{complaint.category}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <StatusChip status={complaint.status} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">{complaint.description}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ComplaintDetails;
