import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchSystemStats, fetchComplaints } from "../utils/api";

// Simple component for displaying stats
const StatCard = ({ title, value, color }) => (
  <Grid item xs={12} md={4} lg={3}>
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        height: 140,
        bgcolor: color,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography
        variant="h3"
        component="div"
        sx={{ flexGrow: 1, fontWeight: "bold" }}
      >
        {value}
      </Typography>
    </Paper>
  </Grid>
);

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch superadmin statistics
        const statsData = await fetchSystemStats();
        setStats(statsData);

        // Fetch recent complaints (using fetchComplaints for all complaints)
        const complaintsData = await fetchComplaints({ limit: 5 });
        setRecentComplaints(complaintsData);

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
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
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Super Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome, {user?.name || "Super Admin"}. Here\'s an overview of all
            complaints and system status.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/superadmin/complaints")}
        >
          View All Complaints
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <StatCard
          title="Total Complaints"
          value={stats?.complaints?.total || 0}
          color="#7cb9e5ff"
        />
        <StatCard
          title="Unassigned Complaints"
          value={stats?.complaints?.unassigned || 0}
          color="#f0e27dff"
        />
        <StatCard
          title="In Progress"
          value={stats?.complaints?.inProgress || 0}
          color="#e88aecff"
        />
        <StatCard
          title="Resolved"
          value={stats?.complaints?.resolved || 0}
          color="#4a9550ff"
        />

        {/* Admin Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Admin Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: "#d9f085ff" }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Admins
                    </Typography>
                    <Typography variant="h5">
                      {stats?.admins?.total || 0}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, bgcolor: "#7ec8e7ff" }}>
                    <Typography variant="body2" color="text.secondary">
                      Active Admins
                    </Typography>
                    <Typography variant="h5">
                      {stats?.admins?.active || 0}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Complaint Categories
              </Typography>
              <Grid container spacing={2}>
                {stats?.categories?.map((category) => (
                  <Grid item xs={6} key={category.name}>
                    <Paper sx={{ p: 2, bgcolor: "#ffadadff" }}>
                      <Typography variant="body2" color="text.secondary">
                        {category.name}
                      </Typography>
                      <Typography variant="h5">{category.count}</Typography>
                    </Paper>
                  </Grid>
                )) || (
                  <Grid item xs={12}>
                    <Typography>No category data available</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Complaints */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Recent Complaints</Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/superadmin/complaints")}
                >
                  View All
                </Button>
              </Box>
              {recentComplaints.length > 0 ? (
                <List>
                  {recentComplaints.map((complaint, index) => (
                    <Box key={complaint._id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {complaint.title}
                              {complaint.priority === "high" && (
                                <span
                                  style={{ color: "red", marginLeft: "8px" }}
                                >
                                  • High Priority
                                </span>
                              )}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {complaint.category} - {complaint.status}
                                {complaint.assignedTo
                                  ? ` - Assigned to ${complaint.assignedTo.name}`
                                  : " - Unassigned"}
                              </Typography>
                              <br />
                              {complaint.description.substring(0, 100)}...
                            </>
                          }
                        />
                      </ListItem>
                      {index < recentComplaints.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body1">
                  No complaints available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;
