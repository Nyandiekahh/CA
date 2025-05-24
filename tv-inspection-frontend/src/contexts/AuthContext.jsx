import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Checking authentication state...');
      
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      
      console.log('📱 Stored token:', token ? `${token.substring(0, 20)}...` : 'None');
      console.log('👤 Stored user:', userStr);
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          console.log('✅ Restoring user session:', userData);
          
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user: userData }
          });
        } catch (error) {
          console.error('❌ Error parsing stored user data:', error);
          logout();
        }
      } else {
        console.log('❌ No stored authentication found');
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function with debugging
  const login = async (credentials) => {
    console.log('🚀 Starting login process...');
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      console.log('📡 Making login request...');
      const response = await authAPI.login(credentials);
      
      console.log('📥 Raw Django response:', response);
      
      // Django JWT token response - check different possible formats
      let accessToken = null;
      let refreshToken = null;
      let userData = null;
      
      // Check for Django REST Framework JWT format
      if (response.access_token) {
        accessToken = response.access_token;
        refreshToken = response.refresh_token;
      } else if (response.access) {
        accessToken = response.access;
        refreshToken = response.refresh;
      } else if (response.token) {
        accessToken = response.token;
      }
      
      // Check for user data in response
      if (response.user) {
        userData = response.user;
      } else {
        // Create user data from what we have
        userData = {
          id: Date.now(),
          username: credentials.username,
          email: response.email || credentials.username + '@example.com',
          first_name: response.first_name || credentials.username,
          last_name: response.last_name || ''
        };
      }
      
      console.log('🔑 Access token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None');
      console.log('🔄 Refresh token:', refreshToken ? `${refreshToken.substring(0, 20)}...` : 'None');
      console.log('👤 User data:', userData);
      
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        console.log('✅ Token stored in localStorage');
        
        if (refreshToken) {
          localStorage.setItem('refresh_token', refreshToken);
          console.log('✅ Refresh token stored in localStorage');
        }
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ User data stored in localStorage');
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: userData }
        });
        
        return { success: true, data: response };
      } else {
        console.error('❌ No access token in response');
        const errorMessage = 'Login successful but no token received';
        dispatch({
          type: AUTH_ACTIONS.LOGIN_FAILURE,
          payload: errorMessage
        });
        return { success: false, error: errorMessage };
      }
      
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail || 
                          error.response?.data?.message ||
                          error.message || 
                          'Login failed';
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;