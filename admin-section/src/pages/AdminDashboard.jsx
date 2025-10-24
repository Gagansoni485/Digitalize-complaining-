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
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { fetchAdminStats, fetchAssignedComplaints } from "../utils/api";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch admin statistics
        const statsData = await fetchAdminStats(user.id);
        setStats(statsData);

        // Fetch recent assigned complaints
        const complaintsRes = await fetchAssignedComplaints(user.id, {
          limit: 5,
        });
        setRecentComplaints(complaintsRes);

        setLoading(false);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user.id]);

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
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name || "Admin"}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Here's an overview of your assigned complaints and activities.
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#e3f2fd",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Assigned Complaints
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              {stats?.complaints?.total || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#e8f5e9",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Resolved Complaints
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              {stats?.complaints?.resolved || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "#fff8e1",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pending Complaints
            </Typography>
            <Typography
              variant="h3"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              {(stats?.complaints?.total || 0) - (stats?.complaints?.resolved || 0)}
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Complaints */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Assigned Complaints
              </Typography>
              {recentComplaints.length > 0 ? (
                <List>
                  {recentComplaints.map((complaint, index) => (
                    <Box key={complaint._id}>
                      <ListItem>
                        <ListItemText
                          primary={complaint.title}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {complaint.category} - {complaint.status}
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
                  No complaints assigned yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
