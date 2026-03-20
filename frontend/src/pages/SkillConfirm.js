import React, { useState } from 'react';

const STEPS = ['Upload', 'Skills', 'Test', 'Roadmap'];

function SkillConfirm({ goTo, appData }) {
  const [resumeSkills, setResumeSkills] = useState(appData.resumeSkills || []);
  const jdSkills   = appData.jdSkills || [];
  const confidence = appData.overallConfidence || 0;

  const removeSkill = (name) => {
    setResumeSkills(prev => prev.filter(s => s.name !== name));
  };

  const overlapping = resumeSkills.filter(rs =>
    jdSkills.some(jd => jd.name.toLowerCase() === rs.name.toLowerCase())
  );

  return (
    <div className="page-enter" style={{
      minHeight: '100vh', backgroundColor: '#f8fafc',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* Step Progress */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 0'
      }}>
        <div style={{
          maxWidth: '700px', margin: '0 auto',
          display: 'flex', justifyContent: 'center', gap: '8px'
        }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: i === 1 ? '#1e40af' : i < 1 ? '#22c55e' : '#e2e8f0',
                color: i <= 1 ? 'white' : '#94a3b8',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px', fontWeight: '600'
              }}>
                {i < 1 ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '13px',
                color: i === 1 ? '#1e40af' : '#94a3b8',
                fontWeight: i === 1 ? '600' : '400'
              }}>{step}</span>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: '40px', height: '2px',
                  backgroundColor: i < 1 ? '#22c55e' : '#e2e8f0'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Confidence Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.4s ease'
        }}>
          <span style={{ fontSize: '22px' }}>🎯</span>
          <div>
            <p style={{ color: '#1e40af', fontWeight: '600', fontSize: '15px' }}>
              Extracted {resumeSkills.length} skills with {Math.round(confidence * 100)}% confidence
            </p>
            <p style={{ color: '#60a5fa', fontSize: '13px', marginTop: '2px' }}>
              Click × to remove any incorrect skills
            </p>
          </div>
        </div>

        <h2 style={{
          fontSize: '28px', fontWeight: '700',
          color: '#1e293b', marginBottom: '8px'
        }}>
          Confirm your skills
        </h2>
        <p style={{ color: '#64748b', marginBottom: '36px', fontSize: '16px' }}>
          We will only test skills that overlap with the job requirements.
        </p>

        {/* Resume Skills — Green Pills */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '12px', fontWeight: '600',
            color: '#94a3b8', marginBottom: '12px',
            textTransform: 'uppercase', letterSpacing: '0.8px'
          }}>
            YOUR SKILLS (from resume)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {resumeSkills.map((skill, i) => (
              <div
                key={i}
                className="pill-green"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span>{skill.name}</span>
                <span style={{ fontSize: '11px', color: '#86efac' }}>
                  {skill.years}yr
                </span>
                <button
                  onClick={() => removeSkill(skill.name)}
                  style={{
                    background: 'none', border: 'none',
                    cursor: 'pointer', color: '#16a34a',
                    fontSize: '18px', padding: '0',
                    lineHeight: '1', marginLeft: '2px',
                    fontWeight: '300'
                  }}
                >×</button>
              </div>
            ))}
          </div>
        </div>

        {/* JD Skills — Blue Pills */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '12px', fontWeight: '600',
            color: '#94a3b8', marginBottom: '12px',
            textTransform: 'uppercase', letterSpacing: '0.8px'
          }}>
            JOB REQUIRES
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {jdSkills.map((skill, i) => (
              <div
                key={i}
                className="pill-blue"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span>{skill.name}</span>
                <span style={{ fontSize: '11px', color: '#93c5fd' }}>
                  {skill.level}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Overlap Info Box */}
        <div style={{
          backgroundColor: '#fefce8',
          border: '1px solid #fde047',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '22px' }}>⚡</span>
          <div>
            <p style={{ color: '#854d0e', fontWeight: '600', fontSize: '15px' }}>
              Testing {overlapping.length} overlapping skills
            </p>
            <p style={{ color: '#a16207', fontSize: '13px', marginTop: '2px' }}>
              {overlapping.map(s => s.name).join(', ')} — {overlapping.length * 3} questions total
            </p>
          </div>
        </div>

        {/* Start Test Button */}
        <button
          className="btn-primary"
          onClick={() => goTo('test', {
            resumeSkills,
            jdSkills,
            confirmedSkills: overlapping
          })}
          style={{ width: '100%', padding: '16px' }}
        >
          Start Diagnostic Test →
        </button>

        <button
          onClick={() => goTo('upload')}
          style={{
            width: '100%', marginTop: '12px',
            backgroundColor: 'transparent',
            color: '#64748b', padding: '12px',
            border: 'none', cursor: 'pointer',
            fontSize: '14px', fontFamily: 'Inter, sans-serif'
          }}
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default SkillConfirm;
