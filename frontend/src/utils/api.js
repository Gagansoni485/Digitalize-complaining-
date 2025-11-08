const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://service-digital-complaining.onrender.com/api';

// Student Authentication
export const registerStudent = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    
    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

export const loginStudent = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/students/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// Admin Authentication
export const registerAdmin = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Admin registration failed');
    }
    
    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// Get all admins
export const getAllAdmins = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add any filters to the query params
    if (filters.specialization) queryParams.append('specialization', filters.specialization);
    if (filters.branch) queryParams.append('branch', filters.branch);
    if (filters.semester) queryParams.append('semester', filters.semester);
    if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive);
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    
    const response = await fetch(`${API_BASE_URL}/admin${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch admins');
    }
    
    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please ensure backend is running on port 5000');
    }
    throw error;
  }
};

export const loginAdmin = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Admin login failed');
    }
    
    return response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Please check your internet connection.');
    }
    throw error;
  }
};

// Complaint Management
export const submitComplaint = async (complaintData) => {
  const response = await fetch(`${API_BASE_URL}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(complaintData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit complaint');
  }
  
  return response.json();
};

export const trackComplaint = async (token) => {
  const response = await fetch(`${API_BASE_URL}/complaints/track/${token}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Complaint not found');
  }
  
  return response.json();
};

export const getComplaintById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/complaints/${id}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Complaint not found');
  }
  
  return response.json();
};
