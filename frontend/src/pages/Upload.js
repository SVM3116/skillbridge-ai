import React, { useState } from 'react';
import axios from 'axios';

const STEPS = ['Upload', 'Skills', 'Test', 'Roadmap'];

function Upload({ goTo }) {
  const [resumeFile, setResumeFile]   = useState(null);
  const [jdText, setJdText]           = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const handleSubmit = async () => {
    if (!resumeFile) { setError('Please upload your resume PDF'); return; }
    if (!jdText.trim()) { setError('Please paste the job description'); return; }
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      const resumeRes = await axios.post('http://localhost:8000/api/parse-resume', formData);

      const jdRes = await axios.post('http://localhost:8000/api/parse-jd', { jd_text: jdText });

      goTo('confirm', {
        resumeSkills: resumeRes.data.skills,
        jdSkills:     jdRes.data.required_skills,
        overallConfidence: resumeRes.data.overall_confidence,
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

      {/* Step Progress */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: i === 0 ? '#1e40af' : '#e2e8f0',
                color: i === 0 ? 'white' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: '600'
              }}>{i + 1}</div>
              <span style={{ fontSize: '13px', color: i === 0 ? '#1e40af' : '#94a3b8', fontWeight: i === 0 ? '600' : '400' }}>{step}</span>
              {i < STEPS.length - 1 && <div style={{ width: '40px', height: '2px', backgroundColor: '#e2e8f0' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
          Let's get started
        </h2>
        <p style={{ color: '#64748b', marginBottom: '40px', fontSize: '16px' }}>
          Upload your resume and paste the job description below.
        </p>

        {/* Resume Upload */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Resume (PDF)
          </label>
          <div
            onClick={() => document.getElementById('resumeInput').click()}
            style={{
              border: `2px dashed ${resumeFile ? '#1e40af' : '#cbd5e1'}`,
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: resumeFile ? '#eff6ff' : 'white',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
            <p style={{ color: resumeFile ? '#1e40af' : '#94a3b8', fontSize: '15px', fontWeight: '500' }}>
              {resumeFile ? `✅ ${resumeFile.name}` : 'Click to upload your resume PDF'}
            </p>
            <p style={{ color: '#cbd5e1', fontSize: '13px', marginTop: '4px' }}>PDF files only</p>
          </div>
          <input
            id="resumeInput"
            type="file"
            accept=".pdf"
            style={{ display: 'none' }}
            onChange={e => setResumeFile(e.target.files[0])}
          />
        </div>

        {/* JD Text Area */}
        <div style={{ marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
            Job Description
          </label>
          <textarea
            value={jdText}
            onChange={e => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: '1.5px solid #e2e8f0',
              fontSize: '15px',
              color: '#374151',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
              transition: 'border 0.2s'
            }}
            onFocus={e => e.target.style.border = '1.5px solid #1e40af'}
            onBlur={e => e.target.style.border = '1.5px solid #e2e8f0'}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2', border: '1px solid #fecaca',
            borderRadius: '8px', padding: '12px 16px',
            color: '#dc2626', fontSize: '14px', marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#94a3b8' : '#1e40af',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {loading ? '⏳ Analyzing your profile...' : 'Analyze My Profile →'}
        </button>

        <button
          onClick={() => goTo('landing')}
          style={{
            width: '100%', marginTop: '12px',
            backgroundColor: 'transparent', color: '#64748b',
            padding: '12px', border: 'none',
            cursor: 'pointer', fontSize: '14px'
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default Upload;