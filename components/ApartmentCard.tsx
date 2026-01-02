
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
      <div className="relative h-48 w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${apartment.img}')` }}
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button 
            onClick={() => onRemove(apartment.id)}
            className="size-8 rounded-full bg-white/90 backdrop-blur-sm text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
          <span className={`inline-flex items-center gap-1 rounded-full ${apartment.statusColor} px-3 py-1 text-xs font-bold text-white shadow-sm`}>
            <span className="material-symbols-outlined text-[14px]">{apartment.statusIcon}</span> {apartment.status}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 gap-4">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h4 className="text-xl font-bold text-forest">{apartment.title}</h4>
            <p className="text-lg font-bold text-primary">{apartment.price}<span className="text-sm font-normal text-forest/60">/mo</span></p>
          </div>
          <p className="text-sm text-forest/70">{apartment.specs}</p>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-sage/30 border border-sage/50">
          <span className="material-symbols-outlined text-primary">{apartment.petIcon}</span>
          <span className="text-sm font-bold text-forest">{apartment.petTag}</span>
        </div>
        <button 
          onClick={() => onViewDetails(apartment)}
          className="mt-auto w-full rounded-full bg-forest text-white py-2.5 text-sm font-bold hover:opacity-90 transition-opacity shadow-md shadow-forest/10"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ApartmentCard;
