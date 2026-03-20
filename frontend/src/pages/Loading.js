import React, { useEffect, useState } from 'react';


const MESSAGES = [
  { text: 'Reading your resume...', icon: '📄' },
  { text: 'Extracting your skills...', icon: '🔍' },
  { text: 'Analyzing job requirements...', icon: '💼' },
  { text: 'Identifying skill gaps...', icon: '🧠' },
  { text: 'Building your roadmap...', icon: '🗺️' },
];

function Loading({ goTo, appData }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex(prev => (prev < MESSAGES.length - 1 ? prev + 1 : prev));
    }, 1200);

    const progInterval = setInterval(() => {
      setProgress(prev => (prev < 90 ? prev + 2 : prev));
    }, 150);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="page-enter" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '480px', padding: '40px' }}>

        {/* Animated Logo */}
        <div style={{
          width: '80px', height: '80px',
          backgroundColor: '#1e40af', borderRadius: '20px',
          margin: '0 auto 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'spin 3s linear infinite'
        }}>
          <span style={{ color: 'white', fontSize: '36px' }}>S</span>
        </div>

        {/* Current Message */}
        <div style={{ marginBottom: '32px', minHeight: '60px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>
            {MESSAGES[msgIndex].icon}
          </div>
          <p style={{
            fontSize: '18px', fontWeight: '600',
            color: '#1e293b', animation: 'fadeIn 0.3s ease'
          }}>
            {MESSAGES[msgIndex].text}
          </p>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%', height: '6px',
          backgroundColor: '#e2e8f0', borderRadius: '3px',
          overflow: 'hidden', marginBottom: '12px'
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            backgroundColor: '#1e40af', borderRadius: '3px',
            transition: 'width 0.15s ease'
          }} />
        </div>

        <p style={{ fontSize: '14px', color: '#94a3b8' }}>{progress}%</p>

        {/* Loading Dots */}
        <div className="loading-dots" style={{ justifyContent: 'center', marginTop: '24px' }}>
          <span /><span /><span />
        </div>

      </div>
    </div>
  );
}

export default Loading;