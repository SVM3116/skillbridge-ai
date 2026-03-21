import React from 'react';

function Landing({ goTo }) {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-primary">
      <nav className="bg-white/80 backdrop-blur-xl fixed top-0 w-full z-50 shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 w-full mx-auto">
          <div className="text-xl font-bold tracking-tight text-blue-900">SkillBridge AI</div>
          <div className="hidden md:flex items-center space-x-8">
            <span className="text-slate-600 font-medium">Product</span>
            <span className="text-slate-600 font-medium">Solutions</span>
            <span className="text-slate-600 font-medium">Pricing</span>
            <span className="text-slate-600 font-medium">Resources</span>
          </div>
          <button
            onClick={() => goTo('upload')}
            className="bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold hover:scale-95 duration-200 ease-in-out transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none -z-10"
          style={{backgroundImage:'radial-gradient(circle at 2px 2px, rgba(0,40,142,0.05) 1px, transparent 0)', backgroundSize:'40px 40px'}}>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none -z-10"
          style={{background:'linear-gradient(to bottom, rgba(0,40,142,0.05), transparent)'}}>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full mb-8"
            style={{backgroundColor:'#ecdcff', color:'#5e0dba'}}>
            <span className="material-symbols-outlined" style={{fontSize:'14px'}}>auto_awesome</span>
            <span className="mono text-xs uppercase tracking-wider font-semibold">Intelligence Driven Platform</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-blue-900 mb-6">
            SkillBridge AI
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            The right training. For you.{' '}
            <span className="italic" style={{color:'rgba(0,40,142,0.4)'}}>Not everyone else.</span>
          </p>

          <div className="flex justify-center mb-24">
            <button
              onClick={() => goTo('upload')}
              className="group relative bg-blue-900 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center space-x-3 transition-all duration-300 hover:scale-95"
              style={{boxShadow:'0 0 0 0 rgba(184,196,255,0.4)'}}
              onMouseOver={e => e.currentTarget.style.boxShadow='0 0 12px 0 rgba(184,196,255,0.4)'}
              onMouseOut={e => e.currentTarget.style.boxShadow='none'}
            >
              <span>Get Started</span>
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon:'upload_file', title:'Upload Resume', desc:'Our AI parses your experience to identify hidden strengths and untapped potential in seconds.', label:'ANALYZING ENGINE 2.4' },
              { icon:'quiz', title:'Take Skill Test', desc:'Adaptive assessments that adjust in real-time to pinpoint exactly where your knowledge peaks.', label:'PRECISION DIAGNOSTIC' },
              { icon:'route', title:'Get Roadmap', desc:'Receive a hyper-personalized learning journey designed to bridge the gap to your next role.', label:'DYNAMIC PATHWAY' },
            ].map((card, i) => (
              <div key={i} className="bg-white p-8 rounded-xl transition-all duration-300 hover:-translate-y-1 text-left group cursor-pointer"
                style={{boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors group-hover:bg-blue-900"
                  style={{backgroundColor:'#dde1ff', color:'#00288e'}}>
                  <span className="material-symbols-outlined group-hover:text-white transition-colors">{card.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.desc}</p>
                <div className="mt-6 mono flex items-center space-x-1" style={{fontSize:'10px', color:'#757684'}}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor:'#4ae176'}}></span>
                  <span>{card.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto py-12 px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="font-bold text-slate-900 mb-2">SkillBridge AI</div>
            <p className="mono text-xs text-slate-500">© 2024 SkillBridge AI. Precision Onboarding.</p>
          </div>
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

export default Landing;