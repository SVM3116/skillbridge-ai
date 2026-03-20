import React, { useState } from 'react';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Loading from './pages/Loading';
import SkillConfirm from './pages/SkillConfirm';
import DiagnosticTest from './pages/DiagnosticTest';
import Results from './pages/Results';

function App() {
  const [screen, setScreen] = useState('landing');
  const [appData, setAppData] = useState({
    resumeSkills: [],
    jdSkills: [],
    questions: [],
    testScores: [],
    roadmap: null,
  });

  const goTo = (screenName, data = {}) => {
    setAppData(prev => ({ ...prev, ...data }));
    setScreen(screenName);
  };

  return (
    <div>
      {screen === 'landing'    && <Landing    goTo={goTo} />}
      {screen === 'upload'     && <Upload     goTo={goTo} />}
      {screen === 'loading'    && <Loading    goTo={goTo} appData={appData} />}
      {screen === 'confirm'    && <SkillConfirm goTo={goTo} appData={appData} />}
      {screen === 'test'       && <DiagnosticTest goTo={goTo} appData={appData} />}
      {screen === 'results'    && <Results    goTo={goTo} appData={appData} />}
    </div>
  );
}

export default App;