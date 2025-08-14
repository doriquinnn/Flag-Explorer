
import React, { useState } from 'react';
import type { AppView } from './types';
import Header from './components/Header';
import LearnMode from './components/LearnMode';
import QuizMode from './components/QuizMode';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('learn');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header currentView={view} setView={setView} />
      <main className="container mx-auto p-4 md:p-8">
        {view === 'learn' && <LearnMode />}
        {view === 'quiz' && <QuizMode />}
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Powered by React, Tailwind CSS, and the Gemini API.</p>
      </footer>
    </div>
  );
};

export default App;
