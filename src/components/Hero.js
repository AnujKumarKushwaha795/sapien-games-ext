import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const handlePlayNow = () => {
    navigate('/dashboard');
  };

  return (
    <div className="hero">
      <div className="video-container">
        <video autoPlay muted loop playsInline className="background-video">
          <source src="https://game.sapien.io/sapien-hero-extended-1080.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="content">
        <div className="hero-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-rocket h-6 w-6 text-white rocket-tilt">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
          </svg>
        </div>
        <div className="hero-text">
          <h1>Play. Earn.<br/>Train AI.</h1>
          <p>Join thousands of players contributing to AI through fun, rewarding tasks—right from your phone!</p>
        </div>

        <button className="cta-button" onClick={handlePlayNow}>
          Play Now!
        </button>
      </div>
    </div>
  );
};

export default Hero;