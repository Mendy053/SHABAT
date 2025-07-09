// Utility to detect ngrok URL from server's .env file
export const detectNgrokUrl = async () => {
  try {
    // Try to fetch the health endpoint to get ngrok URL
    const response = await fetch('/api/health');
    const data = await response.json();
    
    if (data.ngrokUrl) {
      return data.ngrokUrl;
    }
  } catch (error) {
    console.log('Could not detect ngrok URL automatically');
  }
  
  return null;
};

// Function to update environment variable
export const updateNgrokUrl = (url) => {
  if (url && !process.env.REACT_APP_NGROK_URL) {
    // In development, we can't modify process.env at runtime
    // But we can store it in localStorage for this session
    localStorage.setItem('ngrokUrl', url);
    return url;
  }
  return process.env.REACT_APP_NGROK_URL || localStorage.getItem('ngrokUrl');
}; 