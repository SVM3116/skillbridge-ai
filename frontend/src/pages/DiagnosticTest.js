import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STEPS = ['Upload', 'Skills', 'Test', 'Roadmap'];

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
  const total   = allQuestions.length;
  const current = allQuestions[currentQ];
  const progress = total > 0 ? Math.round(((currentQ) / total) * 100) : 0;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post('http://localhost:8000/api/generate-questions', {
          resume_skills: appData.resumeSkills || [],
          jd_skills:     appData.jdSkills     || [],
        });
        setQuestions(res.data.questions || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = async () => {
    if (selected === null) return;

    const newAnswer = {
      skill:       current.skill,
      question_id: current.id,
      selected:    selected,
      correct:     current.correct_answer,
      is_correct:  selected === current.correct_answer
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setSelected(null);

    if (currentQ < total - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      // Last question — score the test
      setSubmitting(true);
      try {
        const scoreRes = await axios.post('http://localhost:8000/api/score-test', {
          answers: newAnswers
        });
        const roadmapRes = await axios.post('http://localhost:8000/api/generate-roadmap', {
          resume_skills: appData.resumeSkills || [],
          test_scores:   scoreRes.data.scores  || [],
          jd_skills:     appData.jdSkills      || [],
        });
        goTo('results', {
          testScores: scoreRes.data.scores,
          roadmapData: roadmapRes.data,
        });
      } catch (err) {
        console.error(err);
        setSubmitting(false);
      }
    }
  };

  if (loading || submitting) {
    return (
      <div className="page-enter" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#f8fafc'
      }}>
        <div style={{
          width: '64px', height: '64px',
          backgroundColor: '#1e40af', borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'spin 1s linear infinite', marginBottom: '24px'
        }}>
          <span style={{ color: 'white', fontSize: '28px' }}>S</span>
        </div>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>
          {submitting ? 'Calculating your results...' : 'Generating your test questions...'}
        </p>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>This takes about 10 seconds</p>
        <div className="loading-dots" style={{ justifyContent: 'center', marginTop: '20px' }}>
          <span /><span /><span />
        </div>
      </div>
    );
  }

  if (!current) return null;

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
                backgroundColor: i === 2 ? '#1e40af' : i < 2 ? '#22c55e' : '#e2e8f0',
                color: i <= 2 ? 'white' : '#94a3b8',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px', fontWeight: '600'
              }}>
                {i < 2 ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: '13px',
                color: i === 2 ? '#1e40af' : '#94a3b8',
                fontWeight: i === 2 ? '600' : '400'
              }}>{step}</span>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: '40px', height: '2px',
                  backgroundColor: i < 2 ? '#22c55e' : '#e2e8f0'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Skill + Question Counter */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: '20px'
        }}>
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '20px', padding: '6px 16px',
            fontSize: '13px', fontWeight: '600', color: '#1e40af'
          }}>
            Testing: {current.skill}
          </div>
          <span style={{ fontSize: '14px', color: '#94a3b8' }}>
            Question {currentQ + 1} of {total}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%', height: '6px',
          backgroundColor: '#e2e8f0', borderRadius: '3px',
          overflow: 'hidden', marginBottom: '36px'
        }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            backgroundColor: '#1e40af', borderRadius: '3px',
            transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Question Card */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '18px', fontWeight: '600',
            color: '#1e293b', lineHeight: '1.6'
          }}>
            {current.question}
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {current.options.map((option, i) => {
            const letter = option.charAt(0);
            const isSelected = selected === letter;
            return (
              <div
                key={i}
                onClick={() => setSelected(letter)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: `2px solid ${isSelected ? '#1e40af' : '#e2e8f0'}`,
                  backgroundColor: isSelected ? '#eff6ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex', alignItems: 'center', gap: '14px',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)'
                }}
              >
                <div style={{
                  width: '32px', height: '32px',
                  borderRadius: '50%', flexShrink: 0,
                  backgroundColor: isSelected ? '#1e40af' : '#f1f5f9',
                  color: isSelected ? 'white' : '#64748b',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700', fontSize: '14px'
                }}>
                  {letter}
                </div>
                <span style={{
                  fontSize: '15px',
                  color: isSelected ? '#1e40af' : '#374151',
                  fontWeight: isSelected ? '500' : '400'
                }}>
                  {option.substring(3)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          className="btn-primary"
          onClick={handleNext}
          disabled={selected === null}
          style={{
            width: '100%', padding: '16px',
            opacity: selected === null ? 0.5 : 1
          }}
        >
          {currentQ < total - 1 ? 'Next Question →' : 'Submit Test →'}
        </button>

      </div>
    </div>
  );
}

export default DiagnosticTest;