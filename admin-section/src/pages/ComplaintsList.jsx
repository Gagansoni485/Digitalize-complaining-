import { useState, useEffect } from 'react';
import { useMediaQuery, useTheme, Card, CardContent, Stack } from '@mui/material';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchComplaints as apiFetchComplaints, fetchAssignedComplaints, updateComplaintStatus, assignComplaint, fetchAvailableAdmins } from '../utils/api';

// Status chip component with appropriate colors
const StatusChip = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'open':
        return { bg: '#7dd3fc', color: '#0c4a6e' };
      case 'in progress':
        return { bg: '#fde68a', color: '#efb93b' };
      case 'resolved':
        return { bg: '#bbf7d0', color: '#166534' };
      case 'closed':
        return { bg: '#94a3b8', color: '#0f172a' };
      default:
        return { bg: '#cbd5e1', color: '#334155' };
    }
  };

  const { bg, color } = getStatusColor(status);

  return (
    <Chip
      label={status}
      sx={{
        bgcolor: bg,
        color: color,
        fontWeight: 'medium',
      }}
      size="small"
    />
  );
};

const ComplaintsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isSuperAdmin } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    search: '',
  });
  const [categories, setCategories] = useState([]);
  
  // For superadmin actions
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [availableAdmins, setAvailableAdmins] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [adminSearch, setAdminSearch] = useState('');

  // Initialize category filter from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [location.search]);
  const [selectedAdmin, setSelectedAdmin] = useState('');

  useEffect(() => {
    loadComplaints();
  }, [isSuperAdmin, filters]);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      let data;
      const statusParam = filters.status ? filters.status.toLowerCase().replace(' ', '_') : undefined;
      
      if (isSuperAdmin) {
        // Superadmin sees all complaints
        data = await apiFetchComplaints({
          status: statusParam,
          category: filters.category,
          search: filters.search,
        });
      } else {
        // Regular admin sees only assigned complaints
        data = await fetchAssignedComplaints(user?.id, {
          status: statusParam,
          category: filters.category,
          search: filters.search,
        });
      }
      
      setComplaints(data);
      
      // Extract unique categories for filter
      const uniqueCategories = [...new Set(data.map(complaint => complaint.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      setError('Failed to load complaints. Please try again later.');
      setSnackOpen(true);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setFilters({
      ...filters,
      search: event.target.value,
    });
    setPage(0);
  };

  const handleResetFilters = () => {
    setFilters({
      status: '',
      category: '',
      search: '',
    });
  };

  // Superadmin actions
  const openStatusDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setStatusDialogOpen(true);
  };

  const normalizeCategory = (cat) => {
    if (!cat) return '';
    const lower = cat.toLowerCase();
    if (lower.endsWith('s') && !['sports'].includes(lower)) return lower.slice(0, -1);
    return lower;
  };

  const openAssignDialog = async (complaint) => {
    setSelectedCategory(normalizeCategory(complaint.category));
    setAdminSearch('');
    setSelectedComplaint(complaint);
    setAssignDialogOpen(true);
    try {
      const admins = await fetchAvailableAdmins(normalizeCategory(complaint.category));
      setAvailableAdmins(admins);
    } catch (err) {
      console.error('Error fetching available admins:', err);
      setError('Failed to load available admins');
    }
  };

  const handleStatusChange = async () => {
    try {
      await updateComplaintStatus(selectedComplaint._id, newStatus);
      // Update the local state
      setComplaints(complaints.map(c => 
        c._id === selectedComplaint._id ? { ...c, status: newStatus } : c
      ));
      setStatusDialogOpen(false);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update complaint status.');
      setSnackOpen(true);
    }
  };

  // fetch admins when category changes
  useEffect(() => {
    if (!assignDialogOpen) return;
    if (!selectedCategory) return;
    const fetchAdmins = async () => {
      try {
        const admins = await fetchAvailableAdmins(normalizeCategory(selectedCategory));
        setAvailableAdmins(admins);
      } catch (err) {
        console.error('Error fetching available admins:', err);
        setError('Failed to load available admins');
      }
    };
    fetchAdmins();
  }, [assignDialogOpen, selectedCategory]);

  const handleAssignAdmin = async () => {
    try {
      if (!selectedAdmin) {
        setError('Please select an admin');
        setSnackOpen(true);
        return;
      }
      const res = await assignComplaint(selectedComplaint._id, selectedAdmin, user.id);
      if (res?.error) {
        throw new Error(res.error);
      }
      // In a real implementation, you would refresh the complaints list
      loadComplaints();
      setAssignDialogOpen(false);
    } catch (err) {
      console.error('Error assigning admin:', err);
      setError(err.message || 'Failed to assign admin to complaint.');
      setSnackOpen(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={loadComplaints} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        {isSuperAdmin ? 'All Complaints' : 'My Assigned Complaints'}
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Search"
            name="search"
            value={filters.search}
            onChange={handleSearchChange}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={filters.status}
              label="Status"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={filters.category}
              label="Category"
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={handleResetFilters}>
            Reset Filters
          </Button>
        </Box>
      </Paper>

      {/* Complaints List */}
{isMobile ? (
  <Stack spacing={2}>
    {complaints.map((complaint) => (
      <Card
        key={complaint._id}
        variant="outlined"
        sx={{ cursor: 'pointer' }}
        onClick={() => navigate(`${isSuperAdmin ? '/superadmin' : '/admin'}/complaints/${complaint._id}`)}
      >
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold">
            {complaint.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, my: 1 }}>
            <StatusChip status={complaint.status} />
            <Chip
              label={complaint.priority}
              color={complaint.priority === 'high' ? 'error' : complaint.priority === 'medium' ? 'warning' : 'default'}
              size="small"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {complaint.category} • {complaint.student?.name || 'Anonymous'}
          </Typography>
          {isSuperAdmin && (
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Assigned: {complaint.assignedTo?.name || 'Unassigned'}
            </Typography>
          )}
          <Box sx={{ display:'flex', gap:1, mt:1 }}>
            <Button size="small" variant="outlined" onClick={() => navigate(`${isSuperAdmin ? '/superadmin' : '/admin'}/complaints/${complaint._id}`)}>
              View
            </Button>
            {isSuperAdmin && (
              <>
                <Button size="small" variant="outlined" onClick={() => openStatusDialog(complaint)}>Status</Button>
                <Button size="small" variant="outlined" onClick={() => openAssignDialog(complaint)}>Assign</Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    ))}
    {complaints.length === 0 && (
      <Typography align="center" sx={{ mt: 4 }}>
        No complaints found.
      </Typography>
    )}
  </Stack>
) : (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Student</TableCell>
              {isSuperAdmin && <TableCell>Assigned To</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {complaints
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((complaint) => (
                <TableRow key={complaint._id}>
                  <TableCell>{complaint.title}</TableCell>
                  <TableCell>{complaint.category}</TableCell>
                  <TableCell>
                    <StatusChip status={complaint.status} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={complaint.priority}
                      color={complaint.priority === 'high' ? 'error' : complaint.priority === 'medium' ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {complaint.student?.name || 'Anonymous'}
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell>
                      {complaint.assignedTo?.name || 'Unassigned'}
                    </TableCell>
                  )}
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={() => navigate(`${isSuperAdmin ? '/superadmin' : '/admin'}/complaints/${complaint._id}`)}
                    >
                      View
                    </Button>
                    
                    {isSuperAdmin && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mr: 1 }}
                          onClick={() => openStatusDialog(complaint)}
                        >
                          Status
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => openAssignDialog(complaint)}
                        >
                          Assign
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {complaints.length === 0 && (
              <TableRow>
                <TableCell colSpan={isSuperAdmin ? 7 : 6} align="center">
                  No complaints found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={complaints.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>)}

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Complaint Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusChange} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Admin Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
        <DialogTitle>Assign Complaint to Admin</DialogTitle>
        <DialogContent>
          {/* Category selector */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Admin search */}
          <TextField
            fullWidth
            sx={{ mt: 2 }}
            label="Search Admin"
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
            placeholder="Type admin name..."
          />

          {/* Admin dropdown */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Admin</InputLabel>
            <Select
              value={selectedAdmin}
              label="Admin"
              onChange={(e) => setSelectedAdmin(e.target.value)}
            >
              {availableAdmins
                .filter((ad) => ad.name.toLowerCase().includes(adminSearch.toLowerCase()))
                .map((admin) => (
                  <MenuItem key={admin._id} value={admin._id}>
                    {admin.name} - {admin.department}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignAdmin} variant="contained">
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={() => setSnackOpen(false)}>
        <Alert severity="error" onClose={() => setSnackOpen(false)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};


export default ComplaintsList;