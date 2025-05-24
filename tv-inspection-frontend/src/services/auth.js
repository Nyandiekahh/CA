import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

// Create axios instance for auth requests
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage utilities
export const tokenStorage = {
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  },
  removeTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  isTokenExpired: (token) => {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  },
};

// User storage utilities
export const userStorage = {
  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  },
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem('user');
  },
};

// Auth service class
class AuthService {
  constructor() {
    this.setupInterceptors();
  }

  // Setup axios interceptors for automatic token handling
  setupInterceptors() {
    // Request interceptor to add token
    authAPI.interceptors.request.use(
      (config) => {
        const token = tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    authAPI.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = tokenStorage.getRefreshToken();
            if (refreshToken && !tokenStorage.isTokenExpired(refreshToken)) {
              const response = await this.refreshToken(refreshToken);
              const { access } = response.data;
              
              tokenStorage.setTokens(access);
              originalRequest.headers.Authorization = `Bearer ${access}`;
              
              return authAPI(originalRequest);
            }
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Login user
  async login(credentials) {
    try {
      const response = await authAPI.post('/auth/login/', credentials);
      const { user, access, refresh } = response.data;

      // Store tokens and user data
      if (access) {
        tokenStorage.setTokens(access, refresh);
      }
      if (user) {
        userStorage.setUser(user);
      }

      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await authAPI.post('/auth/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  }

  // Refresh token
  async refreshToken(refreshToken) {
    return await authAPI.post('/auth/token/refresh/', {
      refresh: refreshToken,
    });
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await authAPI.get('/auth/profile/');
      const user = response.data;
      userStorage.setUser(user);
      return { success: true, data: user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to get profile' 
      };
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await authAPI.put('/auth/profile/update/', userData);
      const user = response.data;
      userStorage.setUser(user);
      return { success: true, data: user };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update profile' 
      };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await authAPI.post('/auth/change-password/', passwordData);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to change password' 
      };
    }
  }

  // Logout user
  logout() {
    tokenStorage.removeTokens();
    userStorage.removeUser();
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = tokenStorage.getAccessToken();
    const user = userStorage.getUser();
    return !!(token && user && !tokenStorage.isTokenExpired(token));
  }

  // Get current user
  getCurrentUser() {
    return userStorage.getUser();
  }

  // Check if user has specific role/permission
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  // Check if user is superuser
  isSuperUser() {
    const user = this.getCurrentUser();
    return user?.is_superuser || false;
  }

  // Verify token validity
  async verifyToken() {
    try {
      const token = tokenStorage.getAccessToken();
      if (!token) return false;

      const response = await authAPI.post('/auth/token/verify/', {
        token: token,
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Reset password (send reset email)
  async resetPassword(email) {
    try {
      const response = await authAPI.post('/auth/password-reset/', {
        email: email,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send reset email' 
      };
    }
  }

  // Confirm password reset
  async confirmPasswordReset(token, newPassword) {
    try {
      const response = await authAPI.post('/auth/password-reset/confirm/', {
        token: token,
        password: newPassword,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to reset password' 
      };
    }
  }

  // Get auth headers for API requests
  getAuthHeaders() {
    const token = tokenStorage.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Handle auth errors
  handleAuthError(error) {
    if (error.response?.status === 401) {
      this.logout();
      window.location.href = '/login';
    }
    throw error;
  }
}

// Create and export auth service instance
const authService = new AuthService();
export default authService;

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  isAuthenticated,
  getCurrentUser,
  hasRole,
  isSuperUser,
  verifyToken,
  resetPassword,
  confirmPasswordReset,
  getAuthHeaders,
  handleAuthError,
} = authService;