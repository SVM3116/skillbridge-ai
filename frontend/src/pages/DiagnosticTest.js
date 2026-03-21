import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DiagnosticTest({ goTo, appData }) {
  const [questions, setQuestions]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [currentQ, setCurrentQ]     = useState(0);
  const [answers, setAnswers]       = useState([]);
  const [selected, setSelected]     = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const allQuestions = questions.flatMap(sq =>
    sq.questions.map(q => ({ ...q, skill: sq.skill }))
  );
  const total    = allQuestions.length;
  const current  = allQuestions[currentQ];
  const progress = total > 0 ? Math.round((currentQ / total) * 100) : 0;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.post('http://localhost:8000/api/generate-questions', {
          resume_skills: appData.resumeSkills || [],
          jd_skills:     appData.jdSkills     || [],
        });
        setQuestions(res.data.questions || []);
      } catch(e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleNext = async () => {
    if (selected === null) return;
    const newAnswer = { skill: current.skill, question_id: current.id,
      selected, correct: current.correct_answer, is_correct: selected === current.correct_answer };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setSelected(null);
    if (currentQ < total - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setSubmitting(true);
      try {
        const scoreRes   = await axios.post('http://localhost:8000/api/score-test', { answers: newAnswers });
        const roadmapRes = await axios.post('http://localhost:8000/api/generate-roadmap', {
          resume_skills: appData.resumeSkills || [],
          test_scores:   scoreRes.data.scores  || [],
          jd_skills:     appData.jdSkills      || [],
        });
        goTo('results', { testScores: scoreRes.data.scores, roadmapData: roadmapRes.data });
      } catch(e) { console.error(e); setSubmitting(false); }
    }
  };

  if (loading || submitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{backgroundColor:'#f5f3f4'}}>
        <div className="w-24 h-24 bg-blue-900 rounded-xl flex items-center justify-center animate-slow-spin mb-8"
          style={{boxShadow:'0 20px 60px rgba(0,40,142,0.2)'}}>
          <span className="text-white text-5xl font-black">S</span>
        </div>
        <p className="text-xl font-bold text-blue-900 mb-2">
          {submitting ? 'Calculating your results...' : 'Generating your test questions...'}
        </p>
        <p className="text-slate-400 mb-8">This takes about 10 seconds</p>
        <div className="flex gap-2">
          {[0,0.2,0.4].map((d,i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full dot-bounce"
              style={{backgroundColor:'#00288e', animationDelay:`${d}s`}}></div>
          ))}
        </div>
      </div>
    );
  }

  if (!current) return null;

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

      <main className="pt-24 pb-20 flex flex-col items-center px-6">

        {/* Step Progress */}
        <div className="w-full max-w-3xl mb-12">
          <div className="flex items-center justify-between mb-4 px-2">
            {[
              { label:'Step 1', done: true },
              { label:'Step 2', done: true },
              { label:'Step 3', active: true },
            ].map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{backgroundColor: s.done ? '#005824' : s.active ? '#00288e' : '#e3e2e3'}}>
                    {s.done
                      ? <span className="material-symbols-outlined text-sm text-white" style={{fontVariationSettings:"'FILL' 1", fontSize:'14px'}}>check</span>
                      : s.active
                      ? <div className="w-2 h-2 rounded-full bg-white"></div>
                      : null
                    }
                  </div>
                  <span className="mono text-xs uppercase tracking-wider"
                    style={{color: s.active ? '#00288e' : s.done ? '#005824' : '#757684', fontWeight: s.active ? '700' : '400'}}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div className="flex-1 h-px mx-4" style={{backgroundColor:'rgba(197,197,213,0.2)'}}></div>}
              </React.Fragment>
            ))}
          </div>
          <div className="w-full h-1 rounded-full overflow-hidden" style={{backgroundColor:'#e9e8e9'}}>
            <div className="h-full transition-all duration-500 ease-out" style={{width:`${progress}%`, backgroundColor:'#00288e'}}></div>
          </div>
        </div>

        {/* Question Context */}
        <div className="w-full max-w-3xl flex justify-between items-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
            style={{backgroundColor:'rgba(30,64,175,0.1)', color:'#00288e'}}>
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>terminal</span>
            <span className="mono text-xs font-bold uppercase tracking-tight">Testing: {current.skill}</span>
          </div>
          <div className="mono text-xs text-slate-400 font-medium tracking-widest uppercase">
            Question <span className="font-bold text-blue-900">{currentQ + 1}</span> of {total}
          </div>
        </div>

        {/* Question Card */}
        <div className="w-full max-w-3xl bg-white rounded-xl p-8 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 leading-snug">{current.question}</h2>
        </div>

        {/* Options */}
        <div className="w-full max-w-3xl grid grid-cols-1 gap-4 mb-10">
          {current.options.map((option, i) => {
            const letter     = option.charAt(0);
            const isSelected = selected === letter;
            return (
              <button key={i} onClick={() => setSelected(letter)}
                className="w-full flex items-center p-5 rounded-xl text-left transition-all duration-200"
                style={{
                  backgroundColor: isSelected ? 'rgba(0,40,142,0.05)' : 'white',
                  border: isSelected ? '2px solid #00288e' : '1px solid transparent',
                  boxShadow: isSelected ? '' : '0 1px 3px rgba(0,0,0,0.05)'
                }}
                onMouseOver={e => { if(!isSelected) { e.currentTarget.style.backgroundColor='#f5f3f4'; e.currentTarget.style.borderColor='rgba(197,197,213,0.3)'; }}}
                onMouseOut={e => { if(!isSelected) { e.currentTarget.style.backgroundColor='white'; e.currentTarget.style.borderColor='transparent'; }}}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mono transition-colors"
                  style={{backgroundColor: isSelected ? '#00288e' : '#e9e8e9', color: isSelected ? 'white' : '#444653'}}>
                  {letter}
                </div>
                <div className="ml-4 text-slate-800 font-medium">{option.substring(3)}</div>
                {isSelected && (
                  <div className="ml-auto">
                    <span className="material-symbols-outlined text-blue-900" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Action Row */}
        <div className="w-full max-w-3xl flex justify-between items-center">
          <button className="flex items-center gap-2 font-semibold transition-colors"
            style={{color:'#757684'}}
            onMouseOver={e => e.currentTarget.style.color='#1b1c1d'}
            onMouseOut={e => e.currentTarget.style.color='#757684'}
          >
            <span className="material-symbols-outlined">chevron_left</span>
            Previous
          </button>
          <button onClick={handleNext} disabled={selected === null}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold group transition-all"
            style={{
              backgroundColor: selected === null ? '#e3e2e3' : '#00288e',
              color: selected === null ? '#757684' : 'white',
              cursor: selected === null ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={e => { if(selected !== null) e.currentTarget.style.boxShadow='0 12px 40px rgba(0,40,142,0.15)'; }}
            onMouseOut={e => e.currentTarget.style.boxShadow='none'}
          >
            {currentQ < total - 1 ? 'Next Question' : 'Submit Test'}
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
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

export default DiagnosticTest;