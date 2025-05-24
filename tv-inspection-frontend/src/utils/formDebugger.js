// src/utils/formDebugger.js

// Form debugging and monitoring utility
export class FormDebugger {
  constructor(enabled = process.env.NODE_ENV === 'development') {
    this.enabled = enabled;
    this.logs = [];
    this.maxLogs = 100;
  }

  log(level, message, data = null) {
    if (!this.enabled) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : null,
      id: Date.now() + Math.random()
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      success: '✅',
      debug: '🔍'
    };

    console.log(`${emoji[level] || '📝'} [FormDebugger] ${message}`, data || '');
  }

  info(message, data) { this.log('info', message, data); }
  warn(message, data) { this.log('warn', message, data); }
  error(message, data) { this.log('error', message, data); }
  success(message, data) { this.log('success', message, data); }
  debug(message, data) { this.log('debug', message, data); }

  // Analyze form data for common issues
  analyzeFormData(formData) {
    this.info('Starting form data analysis');
    const issues = [];
    const warnings = [];
    const stats = {
      totalFields: 0,
      emptyFields: 0,
      nullFields: 0,
      undefinedFields: 0,
      booleanFields: 0,
      numericFields: 0,
      stringFields: 0
    };

    const analyzeObject = (obj, path = '') => {
      for (const key in obj) {
        const currentPath = path ? `${path}.${key}` : key;
        const value = obj[key];
        stats.totalFields++;

        if (value === null) {
          stats.nullFields++;
        } else if (value === undefined) {
          stats.undefinedFields++;
          issues.push(`Undefined value at ${currentPath}`);
        } else if (value === '') {
          stats.emptyFields++;
        } else if (typeof value === 'boolean') {
          stats.booleanFields++;
        } else if (typeof value === 'number') {
          stats.numericFields++;
          if (isNaN(value)) {
            issues.push(`NaN value at ${currentPath}`);
          }
          if (!isFinite(value)) {
            issues.push(`Infinite value at ${currentPath}`);
          }
        } else if (typeof value === 'string') {
          stats.stringFields++;
          if (value.trim() !== value) {
            warnings.push(`String with leading/trailing whitespace at ${currentPath}`);
          }
          if (value.length > 1000) {
            warnings.push(`Very long string (${value.length} chars) at ${currentPath}`);
          }
        } else if (typeof value === 'object' && !Array.isArray(value)) {
          analyzeObject(value, currentPath);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              analyzeObject(item, `${currentPath}[${index}]`);
            }
          });
        }
      }
    };

    analyzeObject(formData);

    const analysis = {
      stats,
      issues,
      warnings,
      summary: {
        hasIssues: issues.length > 0,
        hasWarnings: warnings.length > 0,
        completionRate: ((stats.totalFields - stats.emptyFields - stats.nullFields) / stats.totalFields * 100).toFixed(1)
      }
    };

    this.info('Form data analysis complete', analysis);
    return analysis;
  }

  // Monitor API request/response
  monitorApiCall(method, url, requestData, responseData, error = null) {
    const callData = {
      method,
      url,
      timestamp: new Date().toISOString(),
      requestSize: requestData ? JSON.stringify(requestData).length : 0,
      responseSize: responseData ? JSON.stringify(responseData).length : 0,
      success: !error,
      error: error ? error.message : null
    };

    if (error) {
      this.error(`API call failed: ${method} ${url}`, callData);
    } else {
      this.success(`API call successful: ${method} ${url}`, callData);
    }

    return callData;
  }

  // Check for common form submission issues
  checkSubmissionReadiness(formData) {
    this.info('Checking form submission readiness');
    const checks = [];

    // Check for required fields
    const requiredFields = [
      'administrative_info.name_of_broadcaster',
      'administrative_info.station_type',
      'tower_info.tower_owner',
      'transmitter_info.exciter_manufacturer',
      'antenna_system.height'
    ];

    const getNestedValue = (obj, path) => {
      return path.split('.').reduce((current, key) => current?.[key], obj);
    };

    requiredFields.forEach(field => {
      const value = getNestedValue(formData, field);
      if (!value || value === '' || value === null || value === undefined) {
        checks.push({
          type: 'error',
          field,
          message: `Required field missing: ${field}`
        });
      }
    });

    // Check for data type issues
    const numericFields = ['tower_info.tower_height', 'antenna_system.height'];
    numericFields.forEach(field => {
      const value = getNestedValue(formData, field);
      if (value && isNaN(parseFloat(value))) {
        checks.push({
          type: 'error',
          field,
          message: `Invalid numeric value: ${field}`
        });
      }
    });

    // Check for large data sizes
    const dataSize = JSON.stringify(formData).length;
    if (dataSize > 1024 * 1024) { // 1MB
      checks.push({
        type: 'warning',
        message: `Large form data size: ${(dataSize / 1024 / 1024).toFixed(2)}MB`
      });
    }

    const readiness = {
      isReady: checks.filter(c => c.type === 'error').length === 0,
      checks,
      dataSize
    };

    this.info('Submission readiness check complete', readiness);
    return readiness;
  }

  // Generate debug report
  generateDebugReport() {
    const report = {
      timestamp: new Date().toISOString(),
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        onLine: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        apiBaseUrl: process.env.REACT_APP_API_BASE_URL,
        version: process.env.REACT_APP_VERSION
      },
      localStorage: {
        hasAccessToken: !!localStorage.getItem('access_token'),
        hasRefreshToken: !!localStorage.getItem('refresh_token'),
        hasUser: !!localStorage.getItem('user')
      },
      recentLogs: this.logs.slice(0, 20),
      logCount: this.logs.length
    };

    this.info('Debug report generated', report);
    return report;
  }

  // Export logs for debugging
  exportLogs() {
    const logData = {
      exportedAt: new Date().toISOString(),
      logs: this.logs,
      debugReport: this.generateDebugReport()
    };

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `form-debug-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    this.info('Logs exported successfully');
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.info('Logs cleared');
  }
}

// Global debugger instance
export const formDebugger = new FormDebugger();

// React Hook for form debugging
export const useFormDebugger = () => {
  const [debugMode, setDebugMode] = React.useState(false);

  const debugSubmission = (formData, result, error = null) => {
    formDebugger.info('Form submission attempt');
    
    const analysis = formDebugger.analyzeFormData(formData);
    const readiness = formDebugger.checkSubmissionReadiness(formData);
    
    if (error) {
      formDebugger.error('Form submission failed', { 
        error: error.message,
        analysis,
        readiness,
        formData: formData
      });
    } else {
      formDebugger.success('Form submission successful', { 
        result,
        analysis,
        readiness
      });
    }
  };

  return {
    debugMode,
    setDebugMode,
    debugSubmission,
    exportLogs: () => formDebugger.exportLogs(),
    clearLogs: () => formDebugger.clearLogs(),
    generateReport: () => formDebugger.generateDebugReport()
  };
};

// Debug Panel Component (for development)
export const FormDebugPanel = ({ formData, onToggle }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLogs([...formDebugger.logs]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!formDebugger.enabled) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
      >
        🔍 Debug ({logs.length})
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
            <h3 className="font-semibold">Form Debugger</h3>
            <div className="space-x-2">
              <button
                onClick={() => formDebugger.exportLogs()}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded"
              >
                Export
              </button>
              <button
                onClick={() => formDebugger.clearLogs()}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded"
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">No logs yet</div>
            ) : (
              <div className="p-2 space-y-1">
                {logs.slice(0, 10).map((log) => (
                  <div key={log.id} className={`p-2 rounded text-xs ${
                    log.level === 'error' ? 'bg-red-100' :
                    log.level === 'warn' ? 'bg-yellow-100' :
                    log.level === 'success' ? 'bg-green-100' :
                    'bg-gray-100'
                  }`}>
                    <div className="font-semibold">{log.message}</div>
                    <div className="text-gray-600">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {formData && (
            <div className="border-t p-2">
              <button
                onClick={() => {
                  const analysis = formDebugger.analyzeFormData(formData);
                  console.log('Form Analysis:', analysis);
                }}
                className="w-full text-xs bg-blue-500 text-white py-1 rounded"
              >
                Analyze Current Form
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default formDebugger;