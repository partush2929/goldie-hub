
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-border-sand z-[100] pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/training" 
          className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${isActive('/training') ? 'text-primary' : 'text-text-muted'}`}
        >
          <span className={`material-symbols-outlined ${isActive('/training') ? 'fill-1' : ''}`}>pets</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Puppy</span>
        </Link>
        <Link 
          to="/apartments" 
          className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${isActive('/apartments') ? 'text-primary' : 'text-text-muted'}`}
        >
          <span className={`material-symbols-outlined ${isActive('/apartments') ? 'fill-1' : ''}`}>apartment</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Apartments</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
