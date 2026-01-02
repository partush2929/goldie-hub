
import React from 'react';
import { Apartment } from '../types';

interface ApartmentCardProps {
  apartment: Apartment;
  onViewDetails: (apt: Apartment) => void;
  onRemove: (id: string) => void;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment, onViewDetails, onRemove }) => {
  return (
    <div className="group flex flex-col rounded-xl bg-white border border-sage overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative">
      <div className="relative h-56 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${apartment.img}')` }}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(apartment.id); }}
            className="size-10 rounded-full bg-white/90 backdrop-blur-sm text-red-500 flex items-center justify-center shadow-md md:opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove apartment"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
          <span className={`inline-flex items-center gap-1 rounded-full ${apartment.statusColor} px-4 py-1.5 text-xs font-bold text-white shadow-lg`}>
            <span className="material-symbols-outlined text-[16px]">{apartment.statusIcon}</span> {apartment.status}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 gap-5">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-black text-forest">{apartment.title}</h4>
            <p className="text-xl font-black text-primary">{apartment.price}<span className="text-sm font-normal text-forest/60">/mo</span></p>
          </div>
          <p className="text-sm font-medium text-forest/70">{apartment.specs}</p>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-sage/30 border border-sage/50">
          <span className="material-symbols-outlined text-primary text-2xl">{apartment.petIcon}</span>
          <span className="text-sm font-black text-forest uppercase tracking-wider">{apartment.petTag}</span>
        </div>
        <button 
          onClick={() => onViewDetails(apartment)}
          className="mt-auto w-full rounded-2xl bg-forest text-white h-14 text-base font-black hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-forest/10"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ApartmentCard;
