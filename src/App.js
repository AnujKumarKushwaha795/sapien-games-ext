import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Menu from './components/Menu';
import Instructions from './components/Instructions';
import UploadFile from './components/UploadFile';
import VehicleTagging from './components/VehicleTagging';
// import { PrivyProvider } from '@privy-io/react-auth';

// const REACT_APP_PRIVY_APP_ID = "cm65f2qak01x3vec0wd61yi6e";

function App() {
  return (
    // <PrivyProvider
    //   appId={REACT_APP_PRIVY_APP_ID}
    //   config={{
    //     loginMethods: ['wallet', 'email'],
    //     appearance: {
    //       theme: 'light',
    //       accentColor: '#4F46E5',
    //     }
    //   }}
    // >
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/upload" element={<UploadFile />} />
          <Route path="/vehicle-tagging" element={<VehicleTagging />} />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    // </PrivyProvider>
  );
}

export default App;