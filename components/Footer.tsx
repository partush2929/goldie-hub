
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-text-main">
              <span className="material-symbols-outlined text-primary text-3xl">pets</span>
              <span className="font-bold text-xl">Golden & Home</span>
            </div>
            <p className="text-text-muted leading-relaxed text-sm">
              Documenting the journey of raising a golden retriever while navigating the rental market. Join us for tips, tricks, and tails.
            </p>
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <h3 className="font-bold text-text-main text-lg">Explore</h3>
            <nav className="flex flex-col gap-3 text-sm text-text-muted">
              <Link className="hover:text-primary transition-colors" to="/training">Training Hub</Link>
              <Link className="hover:text-primary transition-colors" to="/apartments">Apartment Hunt</Link>
              <Link className="hover:text-primary transition-colors" to="/">Latest Updates</Link>
            </nav>
          </div>
          <div className="md:col-span-2 flex flex-col gap-6">
            <h3 className="font-bold text-text-main text-lg">Contact Us</h3>
            <p className="text-sm text-text-muted">
              Have questions about training tips or rental advice? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">mail</span>
                <a className="hover:text-primary transition-colors" href="mailto:hello@goldenandhome.com">hello@goldenandhome.com</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-text-muted">© 2024 Goldie Hub. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-text-muted">
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
