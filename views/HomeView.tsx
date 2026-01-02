
import React from 'react';
import { Link } from 'react-router-dom';

const HomeView: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <div className="w-full max-w-[1280px] px-6 md:px-10 py-10 md:py-16">
        <div className="flex flex-col-reverse md:flex-row gap-10 items-center">
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
            <h1 className="text-text-main text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
              Building a life with a <span className="text-primary-orange">good dog</span> and a <span className="text-primary-orange">great view</span>.
            </h1>
            <p className="text-text-muted text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto md:mx-0">
              Tracking our training progress and the search for the perfect apartment. Two big goals, one cozy home.
            </p>
            <div className="flex gap-4 justify-center md:justify-start pt-4">
              <Link to="/training" className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary-orange text-white font-bold text-base hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                Get Started
              </Link>
              <button className="flex items-center justify-center rounded-lg h-12 px-8 bg-background-light border border-gray-200 text-text-main font-bold text-base hover:bg-gray-100 transition-colors">
                Read About Us
              </button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-[500px]">
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl relative">
              <img 
                alt="Golden retriever dog" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeEzKApBergIEciqJTxkJVKCGTWJWcd7v0h7PuZp-boeGuCUl6jmx6t9Crfbl6vG4xFWeqATpdZ-p7H32TBVrUUp7r3eJR5_INrATmjbjm2IOTvOdV7IfmkkPzX4BasZbT7OjpAsjbYLmg7Vykh-ljlOnwdqieu3w6KGVHSLKbnQFgZh9XtxjunRfTw2yXhCIdJeZdXxM5GY5QvuQuhC3VCu2k5hdAL02TGOZBQ4ErMentfzSzPBMselWxWObHp6DXY5mshdy0DXw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="w-full max-w-[1280px] px-6 md:px-10 py-16">
        <div className="flex flex-col items-center mb-10">
          <h2 className="text-text-main text-3xl font-bold tracking-tight text-center">Focus Areas</h2>
          <p className="text-text-muted mt-2 text-center">Jump directly into what matters most right now.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          <Link to="/training" className="group relative flex flex-col justify-end overflow-hidden rounded-2xl h-[400px] hover:shadow-2xl transition-all duration-300">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdoQA340hOTpmCRtzsLLoW36kzelGLQYZFYGHA6sWEayDO5vMu9m33dC-5ojdMX4IexnDBAqz5LrRvon2LeiC7NGYCunnsocqbJdSJO5-VdF9--hSS6X7YJhiKFDkEX5-kvIlbRr0deVFJn-gcZx4fiyDudgzwi9bxE29us_xmRiWjCIa9LlQS5dn04p4ilch2mby6mH5XdqO4GF75Q097ERWC5Q_FBC718J5VFxZuxqTRrsXJMEOJ3_Tilts0dwyT-GNXYhtqQbo")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="relative p-8 flex flex-col gap-3">
              <div className="size-12 rounded-full bg-primary-orange/90 flex items-center justify-center text-white mb-2 shadow-lg backdrop-blur-sm">
                <span className="material-symbols-outlined">pets</span>
              </div>
              <h3 className="text-white text-3xl font-bold">Training Hub</h3>
              <p className="text-gray-200 text-base font-medium">Command logs, vet visits, and puppy milestones.</p>
              <div className="flex items-center gap-2 text-primary-orange font-bold mt-2">
                <span>View Progress</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </Link>
          <Link to="/apartments" className="group relative flex flex-col justify-end overflow-hidden rounded-2xl h-[400px] hover:shadow-2xl transition-all duration-300">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBAr31Ss05cBQHr7dFRnDi9wN74v73BVR9h69KtJqTEkDWH4kGaCRE2PPjG2wa1cdsGI5Rs39f4duF1Bpexd4zOF2xqlsCzfY98SbzejNQybCQj93axPV7ry-q2-H55VWxKaFlvICDUUyP4KpP2_kSKgD0tGhVXb-cyGZxIQvAG7pLh1B-Q3H5PVB10RKHhgOMgj450lkx-0vg0rpY0NrI913jW9BR5-6oujqOOJ5GlQvd8kIbThCwFAPE463aXitgA2aATQ4Gwh5I")' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="relative p-8 flex flex-col gap-3">
              <div className="size-12 rounded-full bg-blue-500/90 flex items-center justify-center text-white mb-2 shadow-lg backdrop-blur-sm">
                <span className="material-symbols-outlined">apartment</span>
              </div>
              <h3 className="text-white text-3xl font-bold">Apartment Hunt</h3>
              <p className="text-gray-200 text-base font-medium">Listings viewed, applications sent, and mood boards.</p>
              <div className="flex items-center gap-2 text-blue-300 font-bold mt-2">
                <span>Track Search</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
