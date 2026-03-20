import React, { useState } from 'react';

const STEPS = ['Upload', 'Skills', 'Test', 'Roadmap'];

function Results({ goTo, appData }) {
  const [activeNode, setActiveNode]       = useState(null);
  const [showTrace, setShowTrace]         = useState(false);
  const testScores  = appData.testScores  || [];
  const roadmapData = appData.roadmapData || {};
  const roadmap     = roadmapData.roadmap        || [];
  const trace       = roadmapData.reasoning_trace || [];
  const metrics     = roadmapData.metrics        || {};

  const getLevelColor = (level) => {
    if (level === 'Advanced')     return { bg:'#dcfce7', border:'#86efac', text:'#15803d' };
    if (level === 'Intermediate') return { bg:'#fef9c3', border:'#fde047', text:'#854d0e' };
    return                               { bg:'#fee2e2', border:'#fca5a5', text:'#dc2626' };
  };

  const getScoreColor = (score) => {
    if (score >= 70) return '#22c55e';
    if (score >= 40) return '#f59e0b';
    return '#ef4444';
  };

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
          maxWidth: '800px', margin: '0 auto',
          display: 'flex', justifyContent: 'center', gap: '8px'
        }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: '#22c55e',
                color: 'white',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '13px', fontWeight: '600'
              }}>✓</div>
              <span style={{
                fontSize: '13px', color: '#22c55e', fontWeight: '600'
              }}>{step}</span>
              {i < STEPS.length - 1 && (
                <div style={{ width: '40px', height: '2px', backgroundColor: '#22c55e' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '32px', fontWeight: '800',
            color: '#1e293b', marginBottom: '8px'
          }}>
            Your Personalized Roadmap 🗺️
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px' }}>
            Based on your real skill levels — not just your resume.
          </p>
        </div>

        {/* Impact Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px', marginBottom: '40px'
        }}>
          {[
            { label: 'Courses in your path', value: metrics.optimized_courses || 0, color: '#1e40af', bg: '#eff6ff' },
            { label: 'Courses skipped', value: metrics.courses_skipped || 0, color: '#15803d', bg: '#dcfce7' },
            { label: 'Days saved', value: `${metrics.days_saved || 0}`, color: '#854d0e', bg: '#fefce8' },
          ].map((m, i) => (
            <div key={i} style={{
              backgroundColor: m.bg,
              borderRadius: '12px', padding: '20px',
              textAlign: 'center',
              animation: `fadeIn 0.4s ease ${i * 0.1}s both`
            }}>
              <div style={{
                fontSize: '36px', fontWeight: '800',
                color: m.color, marginBottom: '6px'
              }}>{m.value}</div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Skill Test Results */}
        {testScores.length > 0 && (
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '18px', fontWeight: '700',
              color: '#1e293b', marginBottom: '20px'
            }}>
              Your Skill Reality Check
            </h3>
            {testScores.map((score, i) => {
              const colors = getLevelColor(score.level);
              return (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>
                        {score.skill}
                      </span>
                      <span style={{
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                        borderRadius: '12px', padding: '2px 10px',
                        fontSize: '12px', fontWeight: '600'
                      }}>
                        {score.level}
                      </span>
                    </div>
                    <span style={{
                      fontWeight: '700', fontSize: '16px',
                      color: getScoreColor(score.score)
                    }}>
                      {score.score}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%', height: '8px',
                    backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${score.score}%`, height: '100%',
                      backgroundColor: getScoreColor(score.score),
                      borderRadius: '4px',
                      transition: 'width 1s ease',
                      animation: `progressFill 1s ease ${i * 0.2}s both`
                    }} />
                  </div>
                  <div style={{
                    fontSize: '12px', color: '#94a3b8', marginTop: '4px'
                  }}>
                    {score.correct} of {score.total} correct
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Learning Roadmap */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '18px', fontWeight: '700',
            color: '#1e293b', marginBottom: '8px'
          }}>
            Your Learning Path
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px' }}>
            Click any course to see why it was recommended for you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {roadmap.map((course, i) => (
              <div key={i}>
                {/* Connector arrow */}
                {i > 0 && !course.parallel && (
                  <div style={{
                    display: 'flex', justifyContent: 'center',
                    marginBottom: '8px', color: '#94a3b8', fontSize: '20px'
                  }}>↓</div>
                )}
                {i > 0 && course.parallel && (
                  <div style={{
                    display: 'flex', justifyContent: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      fontSize: '11px', color: '#94a3b8',
                      backgroundColor: '#f1f5f9', padding: '2px 10px',
                      borderRadius: '10px'
                    }}>parallel</span>
                  </div>
                )}

                {/* Course Node */}
                <div
                  className="roadmap-node"
                  onClick={() => setActiveNode(activeNode?.id === course.id ? null : course)}
                  style={{
                    borderColor: activeNode?.id === course.id ? '#1e40af' : '#e2e8f0',
                    backgroundColor: activeNode?.id === course.id ? '#eff6ff' : 'white'
                  }}
                >
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{
                          backgroundColor: '#1e40af', color: 'white',
                          borderRadius: '8px', padding: '2px 10px',
                          fontSize: '11px', fontWeight: '700'
                        }}>{i + 1}</span>
                        <h4 style={{
                          fontSize: '16px', fontWeight: '600',
                          color: '#1e293b', margin: 0
                        }}>{course.title}</h4>
                        {course.auto_added && (
                          <span style={{
                            backgroundColor: '#fefce8', border: '1px solid #fde047',
                            borderRadius: '10px', padding: '2px 8px',
                            fontSize: '11px', color: '#854d0e'
                          }}>auto-added</span>
                        )}
                      </div>
                      <p style={{
                        fontSize: '13px', color: '#64748b', margin: 0
                      }}>{course.description}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '16px' }}>
                      <div style={{
                        fontSize: '13px', fontWeight: '600', color: '#1e40af'
                      }}>{course.duration_hours}h</div>
                      <div style={{
                        fontSize: '11px', color: '#94a3b8', marginTop: '2px'
                      }}>{course.level}</div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {activeNode?.id === course.id && (
                    <div style={{
                      marginTop: '16px', paddingTop: '16px',
                      borderTop: '1px solid #e2e8f0',
                      animation: 'fadeIn 0.2s ease'
                    }}>
                      <div style={{
                        backgroundColor: '#f8fafc', borderRadius: '8px',
                        padding: '12px 16px'
                      }}>
                        <p style={{
                          fontSize: '13px', fontWeight: '600',
                          color: '#374151', marginBottom: '6px'
                        }}>
                          Why YOU need this:
                        </p>
                        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>
                          {course.gap_type === 'MISSING'
                            ? `${course.skill} is required for this role but not found in your resume. Starting from ${course.level} level.`
                            : course.gap_type === 'PREREQUISITE'
                            ? `Auto-added as a foundation before the next course in your path.`
                            : `Your test showed a gap in ${course.skill}. This course targets exactly what you need.`
                          }
                        </p>
                        <div style={{
                          display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap'
                        }}>
                          <span style={{
                            backgroundColor: '#eff6ff', border: '1px solid #bfdbfe',
                            borderRadius: '8px', padding: '4px 10px',
                            fontSize: '12px', color: '#1e40af'
                          }}>
                            📚 {course.domain}
                          </span>
                          <span style={{
                            backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0',
                            borderRadius: '8px', padding: '4px 10px',
                            fontSize: '12px', color: '#15803d'
                          }}>
                            ⏱️ {course.duration_hours} hours
                          </span>
                          <span style={{
                            backgroundColor: '#fefce8', border: '1px solid #fde047',
                            borderRadius: '8px', padding: '4px 10px',
                            fontSize: '12px', color: '#854d0e'
                          }}>
                            📊 {course.level}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reasoning Trace */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <button
            onClick={() => setShowTrace(!showTrace)}
            style={{
              width: '100%', background: 'none', border: 'none',
              cursor: 'pointer', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center',
              padding: 0, fontFamily: 'Inter, sans-serif'
            }}
          >
            <h3 style={{
              fontSize: '18px', fontWeight: '700',
              color: '#1e293b', margin: 0
            }}>
              🧠 Reasoning Trace
            </h3>
            <span style={{ fontSize: '20px', color: '#94a3b8' }}>
              {showTrace ? '▲' : '▼'}
            </span>
          </button>

          {showTrace && (
            <div style={{
              marginTop: '16px', animation: 'fadeIn 0.2s ease'
            }}>
              {trace.map((step, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px',
                  padding: '12px 0',
                  borderBottom: i < trace.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{
                    width: '24px', height: '24px',
                    backgroundColor: '#eff6ff', borderRadius: '50%',
                    flexShrink: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700', color: '#1e40af'
                  }}>{i + 1}</div>
                  <p style={{
                    fontSize: '14px', color: '#475569',
                    lineHeight: '1.6', margin: 0
                  }}>{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Start Over Button */}
        <button
          className="btn-primary"
          onClick={() => goTo('landing')}
          style={{ width: '100%', padding: '16px' }}
        >
          Start New Assessment →
        </button>

      </div>
    </div>
  );
}

export default Results;