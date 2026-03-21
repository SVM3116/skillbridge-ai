import React, { useState } from 'react';

function SkillConfirm({ goTo, appData }) {
  const [resumeSkills, setResumeSkills] = useState(appData.resumeSkills || []);
  const jdSkills   = appData.jdSkills   || [];
  const confidence = appData.overallConfidence || 0;

  const removeSkill = name => setResumeSkills(prev => prev.filter(s => s.name !== name));

  const overlapping = resumeSkills.filter(rs =>
    jdSkills.some(jd => jd.name.toLowerCase() === rs.name.toLowerCase())
  );

  const STEPS = ['Upload','Skills','Diagnostic','Roadmap'];

  return (
    <div className="min-h-screen" style={{backgroundColor:'#fbf9fa'}}>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 md:px-12">
          <div className="text-xl font-bold tracking-tight text-blue-900">SkillBridge AI</div>
          <nav className="hidden md:flex space-x-8">
            {['Product','Solutions','Pricing','Resources'].map(n => (
              <span key={n} className="text-slate-600 font-medium cursor-pointer">{n}</span>
            ))}
          </nav>
          <button className="bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold">Get Started</button>
        </div>
      </header>

      <main className="pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-6">

          {/* Step Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {STEPS.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all"
                      style={{
                        backgroundColor: i===0 ? '#4ae176' : i===1 ? '#00288e' : '#e3e2e3',
                        color: i <= 1 ? 'white' : '#444653'
                      }}>
                      {i === 0
                        ? <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1"}}>check</span>
                        : i === 1
                        ? <span className="material-symbols-outlined text-sm">psychology</span>
                        : i === 2
                        ? <span className="material-symbols-outlined text-sm">quiz</span>
                        : <span className="material-symbols-outlined text-sm">map</span>
                      }
                    </div>
                    <span className="mono text-xs uppercase tracking-wider"
                      style={{color: i===1 ? '#00288e' : '#757684', fontWeight: i===1 ? '700' : '400'}}>
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length-1 && (
                    <div className="flex-1 h-0.5 mx-4 mb-6"
                      style={{backgroundColor: i===0 ? '#4ae176' : '#e3e2e3'}}>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Confidence Banner */}
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl mb-8 border-l-4"
            style={{backgroundColor:'#dde1ff', borderLeftColor:'#00288e'}}>
            <span style={{fontSize:'22px'}}>🎯</span>
            <p className="font-semibold text-blue-900">
              Extracted {resumeSkills.length} skills with {Math.round(confidence * 100)}% confidence
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">

            {/* Resume Skills */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="mono text-xs uppercase tracking-wider text-slate-400">Your Skills (from resume)</span>
                <span className="mono text-xs px-2 py-0.5 rounded" style={{backgroundColor:'#e9e8e9', color:'#444653'}}>Auto-Detected</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {resumeSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all hover:scale-105"
                    style={{backgroundColor:'#f0fdf4', border:'1px solid #86efac', color:'#15803d',
                      animationDelay:`${i*0.05}s`, animation:'fadeUp 0.3s ease forwards'}}>
                    <span>{skill.name}</span>
                    <span className="text-xs" style={{color:'#86efac'}}>({skill.years}yr)</span>
                    <button onClick={() => removeSkill(skill.name)}
                      className="hover:text-red-500 transition-colors font-light text-lg leading-none"
                      style={{color:'#16a34a'}}>×</button>
                  </div>
                ))}
                <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{border:'1px dashed #c4c5d5', color:'#757684'}}>
                  <span className="material-symbols-outlined text-sm">add</span>
                  Add skill
                </button>
              </div>
            </div>

            {/* JD Skills */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="mono text-xs uppercase tracking-wider text-slate-400">Job Requires</span>
                <span className="mono text-xs px-2 py-0.5 rounded" style={{backgroundColor:'#e9e8e9', color:'#444653'}}>Target Profile</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {jdSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm"
                    style={{backgroundColor:'white', border:'1px solid #c4c5d5', color:'#1b1c1d'}}>
                    <span>{skill.name}</span>
                    <span className="mono text-xs px-2 py-0.5 rounded-full"
                      style={{backgroundColor:'#dde1ff', color:'#00288e'}}>
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overlap Info */}
            <div className="flex items-start gap-4 p-5 rounded-xl mb-8"
              style={{backgroundColor:'#fef9c3', border:'1px solid rgba(234,179,8,0.3)'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{backgroundColor:'#fde047'}}>
                <span className="material-symbols-outlined" style={{color:'#713f12', fontSize:'20px'}}>bolt</span>
              </div>
              <div>
                <p className="font-bold text-amber-900 mb-1">Testing {overlapping.length} overlapping skills — {overlapping.length * 3} questions total</p>
                <p className="text-sm text-amber-700">
                  Our AI has identified gaps between your resume and the role. The diagnostic will focus on{' '}
                  {overlapping.map(s => s.name).join(', ')}.
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => goTo('test', { resumeSkills, jdSkills, confirmedSkills: overlapping })}
              className="w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center group transition-all active:scale-95"
              style={{backgroundColor:'#00288e', color:'white'}}
              onMouseOver={e => e.currentTarget.style.boxShadow='0 12px 40px rgba(0,40,142,0.2)'}
              onMouseOut={e => e.currentTarget.style.boxShadow='none'}
            >
              Start Diagnostic Test
              <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <p className="text-center mt-3 mono text-xs text-slate-400 uppercase tracking-widest">
              Approx. {overlapping.length * 4} minutes to complete • AI-Proctored
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { icon:'info', title:'Why these skills?', desc:'We analyzed the job description and mapped it to your career timeline.' },
                { icon:'shield', title:'Privacy Policy', desc:'Your diagnostic results are only shared with the hiring team upon your explicit approval.' },
              ].map((card, i) => (
                <div key={i} className="p-4 rounded-xl" style={{backgroundColor:'#f5f3f4'}}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-sm" style={{color:'#00288e'}}>{card.icon}</span>
                    <span className="font-bold text-sm text-slate-800">{card.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto py-12 px-6 flex justify-between items-center">
          <span className="mono text-xs text-slate-500">© 2024 SkillBridge AI. Precision Onboarding.</span>
          <div className="flex space-x-8">
            {['Privacy','Terms','Security','Status'].map(l => (
              <span key={l} className="mono text-xs text-slate-500">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SkillConfirm;