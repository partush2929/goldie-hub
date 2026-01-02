
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HomeView from './views/HomeView';
import TrainingView from './views/TrainingView';
import ApartmentView from './views/ApartmentView';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-background-light selection:bg-primary selection:text-white pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/training" element={<TrainingView />} />
            <Route path="/apartments" element={<ApartmentView />} />
          </Routes>
        </main>
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;
