import React, { useState } from 'react';
import './styles.css';


const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

const MeetingSummarizer = () => {
  const [activeTab, setActiveTab] = useState('signin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [latestSummary, setLatestSummary] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

 
  const [signInData, setSignInData] = useState({ userName: '', password: '' });
  const [signUpData, setSignUpData] = useState({ userName: '', password: '' });

  
  const [selectedFile, setSelectedFile] = useState(null);

 
  const getToken = () => {
    return localStorage.getItem('token');
  };


  const getUserIdFromToken = () => {
    const token = getToken();
    if (!token) return null;
    
    const decoded = decodeJWT(token);
    return decoded?.userId || decoded?.sub || null;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
 
    if (!signInData.userName.trim() || !signInData.password.trim()) {
      showNotification('Please enter both username and password', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: signInData.userName.trim(),
          password: signInData.password
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userName', signInData.userName);
        
        // Decode token to get user ID
        const decodedToken = decodeJWT(result.token);
        const userId = decodedToken?.userId || decodedToken?.sub;
        
        if (userId) {
          localStorage.setItem('userId', userId.toString());
          setCurrentUserId(userId);
        }
        
        setIsLoggedIn(true);
        setCurrentUser(signInData.userName);
        setActiveTab('upload');
        setSignInData({ userName: '', password: '' });
        showNotification(result.message || 'Login successful!', 'success');
      } else {
        showNotification(result || 'Login failed!', 'error');
      }
    } catch (error) {
      showNotification('Sign in failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    
    if (!signUpData.userName.trim() || !signUpData.password.trim()) {
      showNotification('Please enter both username and password', 'error');
      return;
    }

    if (signUpData.password.length < 3) {
      showNotification('Password should be at least 3 characters long', 'warning');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: signUpData.userName.trim(),
          password: signUpData.password
        }),
      });
      
      const result = await response.text();
      
      if (response.ok) {
        showNotification('Registration successful! Please sign in.', 'success');
        setActiveTab('signin');
        setSignUpData({ userName: '', password: '' });
      } else {
        showNotification(result, 'error');
      }
    } catch (error) {
      showNotification('Sign up failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showNotification('Please select an audio file', 'warning');
      return;
    }

    const token = getToken();
    if (!token) {
      showNotification('Please sign in again', 'error');
      handleLogout();
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      showNotification('Unable to get user information. Please sign in again.', 'error');
      handleLogout();
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('userId', userId); 

    try {
      const response = await fetch('http://localhost:8080/api/whisper/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,

        },
        body: formData,
      });

      if (response.ok) {
        const summary = await response.text();
        setLatestSummary(summary);
        setShowSummaryModal(true);
        setSelectedFile(null);
        document.getElementById('audioFile').value = '';
        
        

        await fetchSummaries(false);
        showNotification('Audio processed successfully!', 'success');
        
      } else if (response.status === 401 || response.status === 403) {
        showNotification('Authentication failed. Please sign in again.', 'error');
        handleLogout();
      } else {
        const error = await response.text();
        showNotification('Upload failed: ' + error, 'error');
      }
    } catch (error) {
      showNotification('Upload failed: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaries = async (switchTab = true) => {
    const token = getToken();
    if (!token) {
      showNotification('Please sign in again', 'error');
      handleLogout();
      return;
    }

   
    const userId = getUserIdFromToken();
    if (!userId) {
      showNotification('Unable to get user information. Please sign in again.', 'error');
      handleLogout();
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:8080/api/whisper/allSummaries/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSummaries(data);
        if (switchTab) {
          setActiveTab('history');
        }
        showNotification('Summaries loaded successfully!', 'success');
      } else if (response.status === 401 || response.status === 403) {
        showNotification('Authentication failed. Please sign in again.', 'error');
        handleLogout();
      } else {
        showNotification('Failed to fetch summaries', 'error');
      }
    } catch (error) {
      showNotification('Failed to fetch summaries: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentUserId(null);
    setActiveTab('signin');
    setSummaries([]);
    setLatestSummary(null);
    setShowSummaryModal(false);
    showNotification('Logged out successfully', 'info');
  };

  const showNotification = (message, type = 'info') => {
  
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <span>${message}</span>
      <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
   
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  };

  const formatSummaryText = (text) => {
    if (!text) return '';
    
   
    return text.split(/(?<=[.!?])\s+/).map((sentence, index) => (
      <p key={index}>{sentence}</p>
    ));
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    if (token && userName) {
   
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setIsLoggedIn(true);
        setCurrentUser(userName);
        setCurrentUserId(userId);
        setActiveTab('upload');
      } else {
       
        handleLogout();
        showNotification('Session expired. Please sign in again.', 'warning');
      }
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="auth-container">
          <h1>Meeting Summarizer</h1>
          
          <div className="tab-container">
            <button 
              className={`tab-button ${activeTab === 'signin' ? 'active' : ''}`}
              onClick={() => setActiveTab('signin')}
            >
              Sign In
            </button>
            <button 
              className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'signin' && (
            <form className="auth-form" onSubmit={handleSignIn}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={signInData.userName}
                  onChange={(e) => setSignInData({...signInData, userName: e.target.value})}
                  required
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          )}

          {activeTab === 'signup' && (
            <form className="auth-form" onSubmit={handleSignUp}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={signUpData.userName}
                  onChange={(e) => setSignUpData({...signUpData, userName: e.target.value})}
                  required
                  placeholder="Choose a username"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                  required
                  placeholder="Choose a password"
                  disabled={loading}
                />
                <div className="password-hint">
                  Password should be at least 3 characters long
                </div>
              </div>
              <button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    Signing Up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Meeting Summarizer</h1>
        <div className="user-info">
          <span>Welcome, {currentUser}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload Audio
        </button>
        <button 
          className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => fetchSummaries(true)}
        >
          View History
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'upload' && (
          <div className="upload-section">
            <h2>Upload Audio File</h2>
            <form onSubmit={handleFileUpload} className="upload-form">
              <div className="file-input-group">
                <input
                  type="file"
                  id="audioFile"
                  accept="audio/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="file-input"
                  disabled={loading}
                />
                <label htmlFor="audioFile" className="file-label">
                  {selectedFile ? (
                    <>
                      <span className="file-icon">📁</span>
                      {selectedFile.name}
                    </>
                  ) : (
                    <>
                      <span className="file-icon">🎵</span>
                      Choose Audio File (MP3, WAV, etc.)
                    </>
                  )}
                </label>
                <div className="file-hint">
                  Supported formats: MP3, WAV, M4A, FLAC, etc.
                </div>
              </div>
              <button type="submit" disabled={loading || !selectedFile} className="upload-btn">
                {loading ? (
                  <>
                    <div className="button-spinner"></div>
                    Processing...
                  </>
                ) : (
                  'Upload & Summarize'
                )}
              </button>
            </form>
            
            {loading && (
              <div className="processing-info">
                <div className="processing-steps">
                  <div className="step active">
                    <span className="step-number">1</span>
                    <span>Uploading file</span>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <span>Transcribing audio</span>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <span>Generating summary</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="section-header">
              <h2>Meeting Summaries</h2>
              <span className="summary-count">{summaries.length} summaries</span>
            </div>
            {summaries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No summaries yet</h3>
                <p>Upload an audio file to generate your first meeting summary!</p>
                <button 
                  onClick={() => setActiveTab('upload')} 
                  className="cta-button"
                >
                  Upload Audio
                </button>
              </div>
            ) : (
              <div className="summaries-list">
                {summaries.map((summary, index) => (
                  <div key={summary.id || index} className="summary-card">
                    <div className="summary-header">
                      <h3>Meeting Summary #{summaries.length - index}</h3>
                      <span className="summary-date">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="summary-content">
                      {formatSummaryText(summary.summarizedText)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Summary Modal */}
      {showSummaryModal && latestSummary && (
        <div className="modal-overlay" onClick={() => setShowSummaryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2> Summary Generated Successfully</h2>
              <button 
                className="modal-close"
                onClick={() => setShowSummaryModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="summary-preview">
                <h3>Meeting Summary:</h3>
                <div className="summary-text">
                  {formatSummaryText(latestSummary)}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowSummaryModal(false)}
              >
                Close
              </button>
              <button 
                className="btn-primary"
                onClick={() => {
                  setShowSummaryModal(false);
                  fetchSummaries(true);
                }}
              >
                View All Summaries
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            Processing your audio...
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingSummarizer;