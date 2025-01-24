/* global chrome */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/VehiclePositioning.css';

const VehiclePositioning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sapienData, setSapienData] = useState(location.state?.sapienData || null);
  const [selectedOption, setSelectedOption] = useState('Interior / Close Up');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!sapienData) {
      navigate('/dashboard');
    }
  }, [sapienData, navigate]);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Get the auth token from storage
      const token = await new Promise((resolve, reject) => {
        chrome.storage.local.get(['authToken'], function(result) {
          if (chrome.runtime.lastError) {
            reject(new Error('Failed to get auth token: ' + chrome.runtime.lastError.message));
            return;
          }
          if (!result.authToken) {
            reject(new Error('Auth token not found in storage'));
            return;
          }
          resolve(result.authToken);
        });
      });

      // Make the submission API call
      const response = await fetch('https://server.sapien.io/graphql', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`,
          'origin': 'https://app.sapien.io',
          'referer': 'https://app.sapien.io/',
        },
        body: JSON.stringify({
          query: `mutation submitTagging($input: SubmitTaggingInput!) {
            submitTagging(input: $input) {
              id
              status
            }
          }`,
          variables: {
            input: {
              tagFlowNodeId: sapienData.dataForTagging.id,
              tagData: {
                position: selectedOption.toUpperCase().replace(/ /g, '_')
              }
            }
          }
        })
      });

      const result = await response.json();
      
      if (result.data?.submitTagging?.status === 'SUCCESS') {
        alert('Position submitted successfully!');
        navigate('/dashboard');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting position:', error);
      alert('Failed to submit position. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!sapienData?.dataForTagging?.provisionedInputData?.image?.url?.forViewing) {
    return null;
  }

  const imageUrl = sapienData.dataForTagging.provisionedInputData.image.url.forViewing;

  return (
    <div className="vehicle-positioning-container">
      <div className="vehicle-display">
        <img src={imageUrl} alt="Vehicle" className="vehicle-image" />
      </div>
      
      <div className="options-container">
        <h2>Select an option that best describes the image position</h2>
        
        <div className="options-list">
          <button 
            className={`option-button ${selectedOption === 'Interior / Close Up' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('Interior / Close Up')}
            disabled={isSubmitting}
          >
            Interior / Close Up
          </button>
          
          <button 
            className={`option-button ${selectedOption === 'Back' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('Back')}
            disabled={isSubmitting}
          >
            Back
          </button>
          
          <button 
            className={`option-button ${selectedOption === 'Side' ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('Side')}
            disabled={isSubmitting}
          >
            Side
          </button>
        </div>

        <button 
          className="submit-button" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default VehiclePositioning;