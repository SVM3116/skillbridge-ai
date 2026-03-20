import React from 'react';

function Landing({ goTo }) {
  return (
    <div className="page-enter" style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#f8fafc'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '580px', padding: '40px 24px' }}>

        {/* Logo */}
        <div style={{
          width: '72px', height: '72px',
          backgroundColor: '#1e40af', borderRadius: '20px',
          margin: '0 auto 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(30, 64, 175, 0.35)',
          animation: 'bounce 2s infinite'
        }}>
          <span style={{ color: 'white', fontSize: '32px', fontWeight: '800' }}>S</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '56px', fontWeight: '800',
          color: '#1e40af', marginBottom: '16px',
          letterSpacing: '-2px', lineHeight: '1.1'
        }}>
          SkillBridge AI
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: '22px', color: '#475569',
          marginBottom: '12px', fontWeight: '500'
        }}>
          The right training. For you.
        </p>
        <p style={{
          fontSize: '22px', color: '#94a3b8',
          marginBottom: '44px', fontWeight: '400'
        }}>
          Not everyone else.
        </p>

        {/* Description */}
        <p style={{
          fontSize: '16px', color: '#94a3b8',
          marginBottom: '44px', lineHeight: '1.7',
          maxWidth: '440px', margin: '0 auto 44px'
        }}>
          Upload your resume and job description.
          We test your real skills and build a
          personalized learning roadmap in minutes.
        </p>

        {/* CTA Button */}
        <button
          className="btn-primary"
          onClick={() => goTo('upload')}
          style={{
            padding: '18px 56px',
            fontSize: '18px',
            borderRadius: '14px',
            animation: 'glowPulse 2s infinite'
          }}
        >
          Get Started →
        </button>

        {/* Steps Row */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: '40px', marginTop: '56px'
        }}>
          {[
            { icon: '📄', label: 'Upload Resume',   desc: 'PDF format' },
            { icon: '🧪', label: 'Skill Test',       desc: 'Real MCQs' },
            { icon: '🗺️', label: 'Get Roadmap',      desc: 'Personalized' },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', animation: `fadeIn 0.4s ease ${i * 0.1 + 0.3}s both` }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>{item.label}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{item.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Landing;