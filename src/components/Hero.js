import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';
import backgroundVideo from '../assets/sapien-hero-extended-1080.mp4';

const Hero = () => {
  const navigate = useNavigate();

  const handlePlayNow = () => {
    navigate('/dashboard');
  };

  return (
    <div className="hero">
      <div className="video-container">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="background-video"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      </div>

      <div className="content">
        <div className="hero-text">
          <h1 className="gradient-text">Play. Earn.<br/>Train AI.</h1>
          <p>Join thousands of players contributing to AI through fun, rewarding tasks—right from your phone!</p>
        </div>

        <button className="cta-button orange-button" onClick={handlePlayNow}>
          Play Now!
        </button>
      </div>
    </div>
  );
};

export default Hero;