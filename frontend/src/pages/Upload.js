import React, { useState } from 'react';
import axios from 'axios';

const STEPS = ['Upload', 'Skills', 'Diagnostic', 'Roadmap'];

function Upload({ goTo }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText]         = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const handleSubmit = async () => {
    if (!resumeFile) { setError('Please upload your resume PDF'); return; }
    if (!jdText.trim()) { setError('Please paste the job description'); return; }
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      const resumeRes = await axios.post('http://localhost:8000/api/parse-resume', formData);
      const jdRes     = await axios.post('http://localhost:8000/api/parse-jd', { jd_text: jdText });
      goTo('confirm', {
        resumeSkills:      resumeRes.data.skills,
        jdSkills:          jdRes.data.required_skills,
        overallConfidence: resumeRes.data.overall_confidence,
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 md:px-12">
          <div className="text-xl font-bold tracking-tight text-blue-900">SkillBridge AI</div>
          <nav className="hidden md:flex space-x-8">
            {['Product','Solutions','Pricing','Resources'].map(n => (
              <span key={n} className="text-slate-600 font-medium hover:text-blue-800 transition-colors cursor-pointer">{n}</span>
            ))}
          </nav>
          <button onClick={() => goTo('landing')} className="bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Back
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 min-h-screen">
        <div className="max-w-3xl mx-auto px-6">

          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all"
                      style={{backgroundColor: i===0 ? '#00288e' : '#e3e2e3', color: i===0 ? 'white' : '#444653'}}>
                      {i===0
                        ? <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1"}}>upload_file</span>
                        : i===1
                        ? <span className="material-symbols-outlined text-sm">psychology</span>
                        : i===2
                        ? <span className="material-symbols-outlined text-sm">quiz</span>
                        : <span className="material-symbols-outlined text-sm">map</span>
                      }
                    </div>
                    <span className="mono text-xs uppercase tracking-wider" style={{color: i===0 ? '#00288e' : '#757684'}}>{step}</span>
                  </div>
                  {i < STEPS.length-1 && (
                    <div className="flex-1 h-0.5 mx-4 mb-6" style={{backgroundColor:'#e3e2e3'}}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-blue-900 tracking-tight mb-2">Let's get started</h1>
              <p className="text-slate-500">We'll analyze your professional profile to build a custom bridge to your next career milestone.</p>
            </div>

            <div className="space-y-8">
              {/* Upload Zone */}
              <div>
                <div
                  onClick={() => document.getElementById('resumeInput').click()}
                  className="group relative flex flex-col items-center justify-center w-full h-64 rounded-xl cursor-pointer overflow-hidden transition-colors"
                  style={{
                    border: `2px dashed ${resumeFile ? '#00288e' : 'rgba(0,40,142,0.3)'}`,
                    backgroundColor: resumeFile ? 'rgba(221,225,255,0.3)' : '#f5f3f4'
                  }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor='rgba(221,225,255,0.2)'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor= resumeFile ? 'rgba(221,225,255,0.3)' : '#f5f3f4'}
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 p-4 rounded-full" style={{backgroundColor:'rgba(221,225,255,0.5)', color:'#00288e'}}>
                      <span className="material-symbols-outlined" style={{fontSize:'40px'}}>cloud_upload</span>
                    </div>
                    <p className="mb-2 text-sm text-slate-700">
                      {resumeFile
                        ? <span className="font-semibold text-blue-900">✅ {resumeFile.name}</span>
                        : <><span className="font-semibold">Drag &amp; drop your resume</span> or click to browse</>
                      }
                    </p>
                    <p className="mono text-xs text-slate-400 uppercase">PDF, DOCX up to 10MB</p>
                  </div>
                  <input id="resumeInput" type="file" accept=".pdf" className="hidden"
                    onChange={e => setResumeFile(e.target.files[0])} />
                </div>
              </div>

              {/* JD Textarea */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="mono text-xs uppercase tracking-wider text-slate-600">Target Job Description</label>
                  <span className="mono text-xs px-2 py-0.5 rounded" style={{color:'#00288e', backgroundColor:'#dde1ff'}}>Required</span>
                </div>
                <textarea
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  placeholder="Paste job description here..."
                  rows={8}
                  className="w-full px-6 py-4 rounded-xl resize-none outline-none transition-all"
                  style={{
                    backgroundColor:'white',
                    border:'1px solid #c4c5d5',
                    fontFamily:'Inter, sans-serif',
                    fontSize:'15px',
                    color:'#1b1c1d'
                  }}
                  onFocus={e => { e.target.style.borderColor='#00288e'; e.target.style.boxShadow='0 0 0 4px rgba(221,225,255,0.5)'; }}
                  onBlur={e => { e.target.style.borderColor='#c4c5d5'; e.target.style.boxShadow='none'; }}
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-lg text-sm" style={{backgroundColor:'#ffdad6', color:'#ba1a1a'}}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center group transition-all active:scale-95"
                style={{backgroundColor: loading ? '#757684' : '#00288e', color:'white'}}
                onMouseOver={e => { if(!loading) e.currentTarget.style.boxShadow='0 12px 40px rgba(0,40,142,0.2)'; }}
                onMouseOut={e => e.currentTarget.style.boxShadow='none'}
              >
                {loading ? 'Analyzing...' : 'Analyze My Profile'}
                {!loading && <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-2">
              <div className="px-3 py-1 rounded-full flex items-center" style={{backgroundColor:'#ecdcff', color:'#5e0dba'}}>
                <span className="mono text-xs uppercase">AI processing active</span>
                <div className="ml-2 w-2 h-2 rounded-full animate-pulse" style={{backgroundColor:'#7433d1'}}></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto py-12 px-6 flex justify-between items-center">
          <span className="mono text-xs text-slate-500">© 2024 SkillBridge AI. Precision Onboarding.</span>
          <div className="flex space-x-8">
            {['Privacy','Terms','Security','Status'].map(l => (
              <span key={l} className="mono text-xs text-slate-500 cursor-pointer hover:text-slate-800">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Upload;