
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-sand bg-surface-light/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-4 text-text-main group">
        <div className="size-8 text-primary group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-[32px]">pets</span>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-tight">Goldie Hub</h2>
      </Link>
      <div className="flex flex-1 justify-end gap-8 items-center">
        <nav className="hidden md:flex items-center gap-9">
          <Link 
            to="/" 
            className={`text-sm font-semibold transition-all ${isActive('/') ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
          >
            Home
          </Link>
          <Link 
            to="/training" 
            className={`text-sm font-semibold transition-all ${isActive('/training') ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
          >
            Training Dashboard
          </Link>
          <Link 
            to="/apartments" 
            className={`text-sm font-semibold transition-all ${isActive('/apartments') ? 'text-primary' : 'text-text-muted hover:text-primary'}`}
          >
            Apartment Hunt
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <button className="md:hidden flex size-10 items-center justify-center rounded-full bg-surface-light border border-border-sand text-text-main hover:bg-gray-50 transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div 
            className="hidden md:flex size-10 rounded-full bg-cover bg-center border-2 border-primary cursor-pointer shadow-sm"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDnI3Iw172PbXHez9Vy7nLNIaAYps3lvyRinpjDs_XPlseReI9_cR8uTQ8g3rd9ZAqNvnAnYgIG0AUbTQZLuyOL3IMoHFGvtufjVuRWwQMlx3JS3vtCTdjgCz_S78tCXlzqIV7bl9So4kaxzR1axuWI3VSX-CkUfWzOv94Qp8jXu-2YjGaPaVxx6jObBL8hRhiHxIKFmruypMmpBAoA-e3hq7iuSKFb3KPXfHxnL0Qa8OXiTdGlUjBlRGSeBtIvJuKUUUYwypf4VaU")' }}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
