import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const adminData = JSON.parse(localStorage.getItem("admin") || "{}");
    if (adminData.token) {
      config.headers.Authorization = `Bearer ${adminData.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Admin authentication
export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post("/admin/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

// Complaints API
export const fetchComplaints = async (filters = {}) => {
  try {
    const response = await api.get("/complaints", { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch complaints",
    );
  }
};

export const fetchComplaintById = async (id) => {
  try {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch complaint",
    );
  }
};

export const updateComplaintStatus = async (id, status) => {
  try {
    const response = await api.patch(`/complaints/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update status");
  }
};

export const assignComplaint = async (complaintId, adminId, assignedBy) => {
  try {
    const response = await api.post(`/complaints/${complaintId}/assign`, {
      adminId,
      assignedBy,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || error.response?.data?.message || 'Failed to assign complaint',
    );
  }
};

export const addMessage = async (complaintId, message) => {
  try {
    const response = await api.post(
      `/complaints/${complaintId}/messages`,
      message,
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add message");
  }
};

// Admin API
export const fetchAdmins = async (filters = {}) => {
  try {
    const response = await api.get("/admin", { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch admins");
  }
};

export const fetchAdminById = async (id) => {
  try {
    const response = await api.get(`/admin/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch admin");
  }
};

export const fetchAvailableAdmins = async (category) => {
  try {
    const response = await api.get(`/admin/available/${category}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch available admins",
    );
  }
};

export const revealStudentIdentity = async (complaintId) => {
  try {
    const response = await api.post(
      `/complaints/${complaintId}/reveal-identity`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reveal student identity",
    );
  }
};

export const fetchAdminStats = async (adminId) => {
  try {
    if (!adminId) throw new Error("Admin ID required for stats");
    const response = await api.get(`/admin/${adminId}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin statistics",
    );
  }
};

export const fetchAssignedComplaints = async (adminId, filters = {}) => {
  try {
    const response = await api.get(`/complaints/admin/${adminId}`, {
      params: filters,
    });
    return response.data.complaints || [];
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch assigned complaints",
    );
  }
};


// Fetch system-wide complaint and admin statistics (for super admins)
export const fetchSystemStats = async () => {
  try {
    const response = await api.get('/complaints/stats/assignments');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch system statistics'
    );
  }
};

export default api;
