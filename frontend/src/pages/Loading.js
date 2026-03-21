import React, { useState, useEffect } from 'react';

const STEPS = [
  { text: 'Reading your resume...', emoji: '📄' },
  { text: 'Extracting your skills...', emoji: '🔍' },
  { text: 'Analyzing job requirements...', emoji: '💼' },
  { text: 'Identifying skill gaps...', emoji: '🧠' },
  { text: 'Building your roadmap...', emoji: '🗺️' },
];

function Loading() {
  const [activeStep, setActiveStep] = useState(3);
  const [progress, setProgress]     = useState(72);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => p < 95 ? p + 1 : p);
    }, 200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{backgroundColor:'#f5f3f4'}}>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 md:px-12">
          <div className="text-xl font-bold tracking-tight text-blue-900">SkillBridge AI</div>
          <div className="hidden md:flex space-x-8">
            {['Product','Solutions','Pricing','Resources'].map(n => (
              <span key={n} className="text-slate-600 font-medium cursor-pointer">{n}</span>
            ))}
          </div>
          <button className="bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold">Get Started</button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center pt-16 px-6">
        {/* Spinning Logo */}
        <div className="relative mb-12 flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-900 rounded-xl flex items-center justify-center animate-slow-spin"
            style={{boxShadow:'0 20px 60px rgba(0,40,142,0.2)'}}>
            <span className="text-white text-5xl font-black">S</span>
          </div>
          <div className="absolute -bottom-4 bg-white px-3 py-1 rounded-full shadow-sm">
            <span className="mono text-xs uppercase tracking-widest text-blue-900">Precision Engine v2.0</span>
          </div>
        </div>

        {/* Steps Card */}
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm">
          <div className="space-y-4 mb-10">
            {STEPS.map((step, i) => {
              const done    = i < activeStep;
              const active  = i === activeStep;
              const pending = i > activeStep;
              return (
                <div key={i} className={`flex items-center gap-4 ${pending ? 'opacity-40' : ''}`}>
                  {done ? (
                    <div className="w-6 h-6 flex items-center justify-center rounded-full" style={{backgroundColor:'#005824'}}>
                      <span className="material-symbols-outlined text-sm" style={{color:'#6bff8f', fontSize:'16px'}}>check</span>
                    </div>
                  ) : active ? (
                    <div className="w-6 h-6 flex items-center justify-center rounded-full animate-pulse"
                      style={{backgroundColor:'#dde1ff', border:'1px solid rgba(0,40,142,0.2)'}}>
                      <span className="w-2 h-2 rounded-full" style={{backgroundColor:'#00288e'}}></span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border" style={{borderColor:'#c4c5d5'}}></div>
                  )}
                  <span className={`font-medium ${active ? 'font-bold text-blue-900' : 'text-slate-700'}`}>
                    {step.emoji} {step.text}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="mono text-xs uppercase tracking-wider text-slate-400">Analysis Progress</span>
              <span className="mono text-sm font-bold text-blue-900">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{backgroundColor:'#e9e8e9'}}>
              <div className="h-full rounded-full transition-all duration-200"
                style={{width:`${progress}%`, background:'linear-gradient(to right, #00288e, #1e40af)'}}>
              </div>
            </div>
          </div>
        </div>

        {/* Bouncing Dots */}
        <div className="mt-16 flex items-center gap-2">
          {[0, 0.2, 0.4].map((delay, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full dot-bounce"
              style={{backgroundColor:'#00288e', animationDelay:`${delay}s`}}>
            </div>
          ))}
        </div>
        <p className="mt-4 mono text-xs uppercase tracking-widest text-slate-400">Optimizing Parameters</p>
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

export default Loading;