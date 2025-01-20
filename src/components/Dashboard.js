/* global chrome */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardAPI } from '../services/api';
import '../styles/Dashboard.css';
import SignupOverlay from './SignupOverlay';
import { VehiclePosAPI } from '../services/vehicle_pos_api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Simplified API calls for Android compatibility
        const data = {
          monitoring: await fetchWithFallback(DashboardAPI.monitoring),
          network: await fetchWithFallback(DashboardAPI.networkCheck),
          graphql: await fetchWithFallback(DashboardAPI.graphqlQuery),
          batch: await fetchWithFallback(DashboardAPI.batchProject),
          listings: await fetchWithFallback(DashboardAPI.getMobileListings),
          amplitude: await fetchWithFallback(DashboardAPI.trackAmplitude)
        };

        setDashboardData(data);
      } catch (err) {
        console.error('Dashboard initialization failed:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Helper function to safely fetch and parse data
  const fetchWithFallback = async (apiCall) => {
    try {
      const response = await apiCall();
      if (!response) return null;
      
      // Handle both text and JSON responses
      if (response.text && typeof response.text === 'function') {
        const text = await response.text();
        return text ? JSON.parse(text) : null;
      }
      return response;
    } catch (err) {
      console.warn('API call failed:', err);
      return null;
    }
  };

  const handleTaskClick = async (taskType) => { 
    if (taskType === 'vehicle-positioning') {
      try {
        // First call sapienGame API
        const gameResponse = await new Promise((resolve, reject) => {
          chrome.wootz.sapienGame((result) => {
            console.log('Raw game response:', result);
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(result);
            }
          });
        });
        console.log('Anuj: Response from sapienGame:', gameResponse);

        // Then call sapienMonitoring API
        const monitoringResponse = await new Promise((resolve, reject) => {
          chrome.wootz.sapienMonitoring((result) => {
            console.log('Type of monitoring response:', typeof result);
            // console.log('Raw monitoring response:', result);            
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else {
              resolve(result);
            }
          });
        });
        // console.log('Payload from sapienMonitoring:', JSON.stringify(monitoringResponse, null, 2));

        // Clean and validate the game response data
        let taggingData;
        if (typeof gameResponse === 'string') {
          try {
            taggingData = JSON.parse(gameResponse);
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error('Invalid JSON string response');
          }
        } else if (gameResponse && typeof gameResponse === 'object') {
          taggingData = gameResponse.data || gameResponse;
        } else {
          throw new Error('Invalid response format');
        }

        // Validate the parsed data
        // if (!taggingData) {
        //   throw new Error('No valid data in response');
        // }
        // console.log('Parsed taggingData:', taggingData);

        // Navigate to vehicle tagging page
        // navigate('/vehicle-tagging', { state: { taggingData } });

      } catch (error) {
        console.error('Error in vehicle positioning flow:', error);
        alert('Failed to initialize vehicle positioning. Please try again.');
      }
    }
    else {
      navigate('/upload');
    }
  };
  

  const handleMenuClick = () => {
    navigate('/menu');
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        // You can add your upload logic here
        // For example:
        // await DashboardAPI.uploadImage(formData);
        
        alert('File selected: ' + file.name);
        // Clear the input
        event.target.value = '';
      } catch (error) {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">Unable to load dashboard. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-button" onClick={handleMenuClick}>☰</button>
        </div>
        <div className="navbar-right">
          <div className="balance">
            <span>$0.16 USDC</span>
          </div>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          {/* Upload button */}
          <button 
            onClick={handleFileSelect}
            className="upload-button"
          >
            <span>📤</span>
            Upload
          </button>
        </div>
      </nav>

      <div className="tasks-grid">
        <div className="task-card active" onClick={() => handleTaskClick('vehicle-positioning')}>
          <div className="task-icon">🚗</div>
          <h2>Vehicle Positioning</h2>
          <div className="task-reward">
            <span>💰</span>
            $0.02 USDC
          </div>
        </div>

        <div className="task-card" onClick={() => handleTaskClick('tag-a-dog')}>
          <div className="task-icon">🐕</div>
          <h2>Tag-a-dog</h2>
          <div className="task-reward">
            <span>💰</span>
            $0.02 USDC
          </div>
        </div>

        <div className="task-card" onClick={() => handleTaskClick('textography')}>
          <div className="task-icon">📝</div>
          <h2>Textography</h2>
          <div className="task-reward">
            <span>💰</span>
            $0.02 USDC
          </div>
        </div>

        <div className="task-card" onClick={() => handleTaskClick('drivesight')}>
          <div className="task-icon">🚦</div>
          <h2>Drivesight</h2>
          <div className="task-reward">
            <span>💰</span>
            $0.02 USDC
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;