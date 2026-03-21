import React, { useState, useRef } from 'react';

function Results({ goTo, appData }) {
  const [activeNode, setActiveNode] = useState(null);
  const [showTrace, setShowTrace]   = useState(false);
  const exportRef = useRef(null);

  const testScores  = appData.testScores  || [];
  const roadmapData = appData.roadmapData || {};
  const roadmap     = roadmapData.roadmap         || [];
  const trace       = roadmapData.reasoning_trace || [];
  const metrics     = roadmapData.metrics         || {};

  const handleExport = () => {
    const element = exportRef.current;
    const opt = {
      margin: [10,10,10,10], filename: 'SkillBridge_MyRoadmap.pdf',
      image: { type:'jpeg', quality:0.95 },
      html2canvas: { scale:2, useCORS:true },
      jsPDF: { unit:'mm', format:'a4', orientation:'portrait' }
    };
    import('html2pdf.js').then(h => h.default().set(opt).from(element).save());
  };

  const levelStyle = (level) => {
    if (level === 'Advanced')     return { bg:'rgba(74,225,118,0.2)', color:'#005321', text:'ADVANCED' };
    if (level === 'Intermediate') return { bg:'rgba(220,186,255,0.4)', color:'#7433d1', text:'INTERMEDIATE' };
    return { bg:'rgba(186,26,26,0.1)', color:'#ba1a1a', text:'BEGINNER' };
  };
  const scoreColor = (s) => s >= 70 ? '#4ae176' : s >= 40 ? '#7433d1' : '#ba1a1a';

  const STEPS = ['Upload','Skills','Diagnostic','Roadmap'];

  return (
    <div className="min-h-screen" style={{backgroundColor:'#fbf9fa'}}>
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm h-16 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight text-blue-900">SkillBridge AI</span>
          <div className="hidden md:flex gap-6">
            {['Product','Solutions','Pricing','Resources'].map(n => (
              <span key={n} className="text-slate-600 font-medium cursor-pointer">{n}</span>
            ))}
          </div>
        </div>
        <button className="bg-blue-900 text-white px-5 py-2 rounded-lg font-semibold">Get Started</button>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto" ref={exportRef}>

        {/* Step Progress */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-4 left-0 w-full h-0.5 -z-10" style={{backgroundColor:'#4ae176'}}></div>
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{backgroundColor: i===3 ? '#00288e' : '#4ae176',
                    color: 'white',
                    boxShadow: i===3 ? '0 0 0 4px rgba(0,40,142,0.2)' : ''
                  }}>
                  {i===3
                    ? <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1", fontSize:'16px'}}>map</span>
                    : <span className="material-symbols-outlined text-sm" style={{fontVariationSettings:"'FILL' 1", fontSize:'14px'}}>check</span>
                  }
                </div>
                <span className="mono text-xs uppercase tracking-wider"
                  style={{color: i===3 ? '#00288e' : '#757684', fontWeight: i===3 ? '700' : '400'}}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 tracking-tight mb-2">
              Your Personalized Roadmap 🗺️
            </h1>
            <p className="text-slate-500 max-w-2xl">
              Based on your diagnostic assessment, we've optimized your learning trajectory by skipping redundant modules and focusing on high-impact growth areas.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExport}
              className="px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95"
              style={{border:'1px solid #c4c5d5', color:'#00288e'}}
              onMouseOver={e => e.currentTarget.style.backgroundColor='#f5f3f4'}
              onMouseOut={e => e.currentTarget.style.backgroundColor='transparent'}
            >
              <span className="material-symbols-outlined text-lg">download</span> Download PDF
            </button>
            <button onClick={() => goTo('landing')}
              className="px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all active:scale-95"
              style={{backgroundColor:'#00288e', color:'white', boxShadow:'0 4px 12px rgba(0,40,142,0.1)'}}
              onMouseOver={e => e.currentTarget.style.backgroundColor='#1e40af'}
              onMouseOut={e => e.currentTarget.style.backgroundColor='#00288e'}
            >
              Start New Assessment
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label:'Learning Path', sublabel:'Courses in path', value: metrics.optimized_courses||0, color:'#00288e', accent:'#00288e' },
            { label:'Efficiency',    sublabel:'Courses skipped', value: metrics.courses_skipped||0,  color:'#005824', accent:'#4ae176' },
            { label:'Time Value',    sublabel:'Days saved',      value: metrics.days_saved||0,        color:'#7433d1', accent:'#7433d1' },
          ].map((m, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow"
              style={{animationDelay:`${i*0.1}s`}}>
              <div className="absolute top-0 left-0 w-1.5 h-full group-hover:w-2 transition-all" style={{backgroundColor:m.accent}}></div>
              <span className="mono text-xs uppercase tracking-widest text-slate-400 mb-2 block">{m.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black transition-transform group-hover:scale-110 origin-left inline-block"
                  style={{color:m.color}}>
                  {m.value}
                </span>
                <span className="font-semibold text-slate-700">{m.sublabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Skill Reality Check */}
        {testScores.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold text-blue-900">Your Skill Reality Check</h2>
              <div className="h-px flex-1" style={{backgroundColor:'rgba(197,197,213,0.3)'}}></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testScores.map((score, i) => {
                const ls = levelStyle(score.level);
                return (
                  <div key={i} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-all"
                    style={{borderColor:'#f1f5f9'}}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-slate-900">{score.skill}</h3>
                      <span className="mono px-3 py-1 rounded-full font-bold uppercase tracking-wider cursor-help"
                        style={{fontSize:'10px', backgroundColor:ls.bg, color:ls.color}}>
                        {ls.text}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="mono text-slate-400">Score: {score.score}%</span>
                      <span className="mono text-slate-400">{score.correct} of {score.total} correct</span>
                    </div>
                    <div className="h-2 w-full rounded-full overflow-hidden" style={{backgroundColor:'#f1f5f9'}}>
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{width:`${score.score}%`, backgroundColor:scoreColor(score.score)}}>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Learning Path */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-bold text-blue-900">Your Learning Path</h2>
            <div className="h-px flex-1" style={{backgroundColor:'rgba(197,197,213,0.3)'}}></div>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 -z-10"
              style={{backgroundColor:'rgba(203,213,225,0.5)'}}></div>

            {roadmap.map((course, i) => {
              const isActive   = i === 0;
              const isParallel = course.parallel && i > 0;
              const isFirst    = i === 0;
              const expanded   = activeNode?.id === course.id;

              return (
                <React.Fragment key={i}>
                  {!isFirst && !isParallel && (
                    <div className="h-20 w-full flex justify-center py-2">
                      <svg className="h-full w-24" fill="none" viewBox="0 0 100 100">
                        <path className="connector-animated" d="M50 0 V100"
                          stroke="#1e40af" strokeLinecap="round" strokeWidth="2.5"></path>
                      </svg>
                    </div>
                  )}
                  {isParallel && (
                    <div className="w-full flex justify-center mb-4">
                      <span className="mono text-xs px-3 py-1 rounded-full"
                        style={{backgroundColor:'#dde1ff', color:'#00288e', fontSize:'10px'}}>
                        parallel track
                      </span>
                    </div>
                  )}

                  <div
                    className={`w-full max-w-2xl cursor-pointer animate-fade-up course-card-expandable ${isActive ? 'animate-glow-active' : ''}`}
                    style={{animationDelay:`${i*0.1}s`}}
                    onClick={() => setActiveNode(expanded ? null : course)}
                  >
                    <div className="bg-white p-6 rounded-xl shadow-md transition-all"
                      style={{border: expanded ? '2px solid #00288e' : isActive ? '2px solid #00288e' : '1px solid #f1f5f9'}}>
                      <div className="flex items-start gap-6">
                        <div className="flex flex-col items-center">
                          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg"
                            style={{background: isActive ? 'linear-gradient(135deg, #00288e, #1e40af)' : '#e9e8e9',
                              color: isActive ? 'white' : '#757684',
                              boxShadow: isActive ? '0 8px 24px rgba(0,40,142,0.2)' : ''}}>
                            {i+1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-extrabold text-xl text-slate-900 hover:text-blue-900 transition-colors">
                              {course.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              {isActive && (
                                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded"
                                  style={{backgroundColor:'#dcfce7', color:'#15803d'}}>
                                  Active Now
                                </span>
                              )}
                              {course.auto_added && (
                                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded"
                                  style={{backgroundColor:'#fef9c3', color:'#854d0e'}}>
                                  auto-added
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 mb-4 leading-relaxed">{course.description}</p>

                          {expanded && (
                            <div className="pt-4 border-t border-slate-100 space-y-4">
                              <div>
                                <h5 className="mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Why this was recommended:</h5>
                                <p className="text-sm text-slate-600">
                                  {course.gap_type === 'MISSING'
                                    ? `${course.skill} is required for this role but not found in your resume. Starting from ${course.level} level.`
                                    : course.gap_type === 'PREREQUISITE'
                                    ? `Auto-added as a foundation before the next course in your path.`
                                    : `Your test showed a gap in ${course.skill}. This course targets exactly what you need to advance.`
                                  }
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-3">
                                {[
                                  { icon:'schedule', text:`${course.duration_hours} HOURS` },
                                  { icon:'signal_cellular_alt', text:course.level.toUpperCase() },
                                  { icon:'category', text:course.domain.toUpperCase() },
                                ].map((badge, bi) => (
                                  <span key={bi} className="mono flex items-center gap-1.5 px-2.5 py-1 rounded-md border"
                                    style={{fontSize:'10px', backgroundColor:'#f8fafc', color:'#444653', borderColor:'rgba(197,197,213,0.5)'}}>
                                    <span className="material-symbols-outlined" style={{fontSize:'14px'}}>{badge.icon}</span>
                                    {badge.text}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </section>

        {/* Reasoning Trace */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <button
              onClick={() => setShowTrace(!showTrace)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-900" style={{fontVariationSettings:"'FILL' 1"}}>psychology</span>
                <h3 className="font-bold text-lg text-slate-900">Reasoning Trace</h3>
              </div>
              <span className="material-symbols-outlined transition-transform" style={{transform: showTrace ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                expand_more
              </span>
            </button>

            {showTrace && (
              <div className="p-6 pt-0 border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-5 mono space-y-4 shadow-inner border border-slate-100"
                  style={{fontSize:'12px'}}>
                  {trace.map((step, i) => (
                    <p key={i} className="hover:bg-blue-50 transition-colors p-2 rounded cursor-default"
                      style={{borderBottom: i < trace.length-1 ? '1px solid #f1f5f9' : 'none'}}>
                      <span className="font-bold" style={{color: i===0 ? '#00288e' : i===1 ? '#7433d1' : '#005824'}}>
                        [{i===0 ? 'ANALYSIS' : i===1 ? 'DIAGNOSTIC' : 'OPTIMIZATION'}]
                      </span>{' '}
                      {step}
                    </p>
                  ))}
                  <p className="p-2 font-bold border-t border-slate-100 mt-2" style={{color:'#757684'}}>
                    [CONCLUSION] Roadmap generation finalized. {metrics.courses_skipped} redundant modules skipped.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>

      <footer className="w-full border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto py-12 px-6 flex justify-between items-center">
          <div>
            <span className="font-bold text-lg text-slate-900">SkillBridge AI</span>
            <p className="mono text-xs text-slate-400 uppercase tracking-tighter">© 2024 Precision Onboarding</p>
          </div>
          <div className="flex gap-8">
            {['Privacy','Terms','Security','Status'].map(l => (
              <span key={l} className="mono text-xs text-slate-400 cursor-pointer hover:text-blue-900">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Results;