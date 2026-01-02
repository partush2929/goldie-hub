
import React, { useState, useEffect, useMemo } from 'react';
import ApartmentCard from '../components/ApartmentCard';
import { db } from '../persistence';
import { Apartment } from '../types';

type SortOption = 'latest' | 'oldest' | 'price-low' | 'price-high';

const ApartmentView: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [meetingInfo, setMeetingInfo] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [newApt, setNewApt] = useState({
    title: '',
    price: '',
    specs: '',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    petTag: 'Golden Friendly',
    description: ''
  });

  useEffect(() => {
    setApartments(db.apartments.get());
  }, []);

  const parsePrice = (priceStr: string) => {
    return Number(priceStr.replace(/[^0-9.-]+/g, ""));
  };

  const sortedApartments = useMemo(() => {
    const list = [...apartments];
    switch (sortOption) {
      case 'price-low':
        return list.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      case 'price-high':
        return list.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      case 'oldest':
        return list.sort((a, b) => a.createdAt - b.createdAt);
      case 'latest':
      default:
        return list.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [apartments, sortOption]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const apartment: Apartment = {
      id: Math.random().toString(36).substr(2, 9),
      title: newApt.title,
      price: `$${newApt.price.replace('$', '')}`,
      specs: newApt.specs,
      img: newApt.img,
      status: 'Viewed',
      statusIcon: 'visibility',
      statusColor: 'bg-blue-500',
      petTag: newApt.petTag,
      petIcon: 'pets',
      createdAt: Date.now(),
      description: newApt.description
    };
    
    const updated = db.apartments.add(apartment);
    setApartments(updated);
    setShowModal(false);
    setNewApt({ title: '', price: '', specs: '', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800', petTag: 'Golden Friendly', description: '' });
  };

  const removeApartment = (id: string) => {
    const updated = db.apartments.remove(id);
    setApartments(updated);
    if (selectedApartment?.id === id) setSelectedApartment(null);
  };

  const handleScheduleViewing = () => {
    if (!selectedApartment) return;
    const info = meetingInfo || "Meeting scheduled via hub.";
    const updatedDescription = `${selectedApartment.description || ''}\n\n[SCHEDULED]: ${info} (${new Date().toLocaleDateString()})`.trim();
    
    const updated = db.apartments.update(selectedApartment.id, {
      status: 'Touring',
      statusIcon: 'directions_run',
      statusColor: 'bg-primary',
      description: updatedDescription
    });
    
    setApartments(updated);
    setSelectedApartment(updated.find(a => a.id === selectedApartment.id) || null);
    setShowScheduleForm(false);
    setMeetingInfo('');
  };

  const handleAddQuickNote = () => {
    if (!selectedApartment || !quickNote.trim()) return;
    const updatedDescription = `${selectedApartment.description || ''}\n\n[NOTE]: ${quickNote.trim()} (${new Date().toLocaleDateString()})`.trim();
    
    const updated = db.apartments.update(selectedApartment.id, {
      description: updatedDescription
    });
    
    setApartments(updated);
    setSelectedApartment(updated.find(a => a.id === selectedApartment.id) || null);
    setQuickNote('');
  };

  return (
    <div className="flex-1 flex flex-col items-center py-6 md:py-12 px-4 sm:px-6 lg:px-8 relative max-w-[1200px] mx-auto w-full">
      <div className="w-full flex flex-col gap-8 md:gap-12">
        {/* Mobile-First Header */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight text-forest">Housing Search</h2>
            <p className="text-lg text-forest/60 font-medium">Finding the perfect den for Puppy.</p>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {[
              { label: 'Found', val: apartments.length.toString(), icon: 'database' },
              { label: 'Tours', val: apartments.filter(a => a.status === 'Touring').length.toString(), icon: 'directions_walk', primary: true },
              { label: 'Apps', val: apartments.filter(a => a.status === 'Applied').length.toString(), icon: 'assignment_turned_in' }
            ].map((stat, idx) => (
              <div key={idx} className="flex min-w-[140px] flex-shrink-0 flex-col items-start justify-center gap-1 rounded-[2rem] bg-white border border-sage p-6 shadow-sm">
                <div className={`flex items-center gap-2 ${stat.primary ? 'text-primary' : 'text-forest/60'}`}>
                  <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                </div>
                <p className="text-3xl font-black text-forest">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shortlist/List Section */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-sage pb-4">
              <h3 className="text-2xl font-black flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">favorite</span>
                Shortlist
              </h3>
              <button 
                onClick={() => setShowModal(true)}
                className="size-12 rounded-full bg-forest text-white flex items-center justify-center shadow-xl active:scale-90 transition-all"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
            
            <div className="flex items-center gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {['latest', 'price-low', 'price-high'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSortOption(opt as SortOption)}
                  className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all whitespace-nowrap ${sortOption === opt ? 'bg-forest text-white border-forest' : 'bg-white text-forest/60 border-sage'}`}
                >
                  {opt.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {sortedApartments.length > 0 ? (
              sortedApartments.map(apt => (
                <ApartmentCard 
                  key={apt.id} 
                  apartment={apt} 
                  onViewDetails={setSelectedApartment} 
                  onRemove={removeApartment} 
                />
              ))
            ) : (
              <div className="py-24 text-center bg-sage/10 rounded-[2.5rem] border-4 border-dashed border-sage px-8">
                <span className="material-symbols-outlined text-6xl text-sage mb-4">apartment</span>
                <p className="text-xl font-black text-forest/40">No listings found.</p>
                <button onClick={() => setShowModal(true)} className="mt-4 text-primary font-black uppercase tracking-widest text-xs">Add your first one</button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Optimized Detail Bottom Sheet / Modal */}
      {selectedApartment && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4 bg-forest/50 backdrop-blur-md">
           <div className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-400">
              <div className="relative h-72 md:h-80 w-full">
                 <img src={selectedApartment.img} className="w-full h-full object-cover" alt={selectedApartment.title} />
                 <button onClick={() => { setSelectedApartment(null); setShowScheduleForm(false); }} className="absolute top-6 right-6 size-12 rounded-full bg-white/95 shadow-xl flex items-center justify-center text-forest active:scale-90 transition-all">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              <div className="p-8 flex flex-col gap-8 max-h-[60vh] overflow-y-auto">
                 <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                       <h2 className="text-3xl font-black text-forest leading-tight">{selectedApartment.title}</h2>
                       <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white mt-1.5 ${selectedApartment.statusColor}`}>{selectedApartment.status}</span>
                    </div>
                    <p className="text-2xl font-black text-primary">{selectedApartment.price}<span className="text-sm font-normal text-forest/40">/month</span></p>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-[1.5rem] bg-sage/20 border border-sage/40 flex flex-col gap-1">
                       <p className="text-[10px] font-black uppercase text-forest/40 tracking-[0.2em]">Layout</p>
                       <p className="text-sm font-black text-forest">{selectedApartment.specs}</p>
                    </div>
                    <div className="p-5 rounded-[1.5rem] bg-sage/20 border border-sage/40 flex flex-col gap-1">
                       <p className="text-[10px] font-black uppercase text-forest/40 tracking-[0.2em]">Pet Rules</p>
                       <p className="text-sm font-black text-primary uppercase">{selectedApartment.petTag}</p>
                    </div>
                 </div>

                 {/* Quick Notes Section */}
                 <div className="flex flex-col gap-4 p-6 bg-background-light rounded-[2rem] border border-sage/50">
                    <p className="text-[10px] font-black uppercase text-forest/40 tracking-[0.2em]">Internal Logs</p>
                    <div className="flex gap-2">
                       <input 
                          className="flex-1 bg-white border-sage rounded-2xl h-12 px-5 text-sm font-bold focus:ring-primary focus:border-primary transition-all shadow-sm"
                          placeholder="Add detail..."
                          value={quickNote}
                          onChange={(e) => setQuickNote(e.target.value)}
                       />
                       <button 
                          onClick={handleAddQuickNote}
                          disabled={!quickNote.trim()}
                          className="bg-forest text-white px-6 rounded-2xl text-xs font-black disabled:opacity-50 active:scale-95 transition-all"
                       >
                          LOG
                       </button>
                    </div>
                    {selectedApartment.description ? (
                      <p className="text-sm text-forest/70 leading-relaxed font-medium whitespace-pre-wrap">{selectedApartment.description}</p>
                    ) : (
                      <p className="text-xs text-forest/30 italic text-center py-2">No notes logged yet.</p>
                    )}
                 </div>

                 {showScheduleForm ? (
                   <div className="flex flex-col gap-4 p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/20 animate-in slide-in-from-bottom-4">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Scheduling View</p>
                      <textarea 
                        className="bg-white border-sage rounded-2xl p-4 text-sm font-bold focus:ring-primary min-h-[100px]"
                        placeholder="Meeting time, agent name, or status..."
                        value={meetingInfo}
                        onChange={(e) => setMeetingInfo(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-3">
                        <button onClick={handleScheduleViewing} className="flex-1 bg-primary text-white h-14 rounded-2xl font-black text-sm active:scale-95 transition-all">CONFIRM</button>
                        <button onClick={() => setShowScheduleForm(false)} className="px-6 h-14 rounded-2xl font-black text-sm text-forest/40">CANCEL</button>
                      </div>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-4 pb-12 md:pb-0">
                      <button onClick={() => setShowScheduleForm(true)} className="w-full bg-forest text-white h-16 rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all">
                        SCHEDULE VIEWING
                      </button>
                      <button onClick={() => removeApartment(selectedApartment.id)} className="w-full h-14 rounded-2xl text-red-400 font-black text-xs uppercase tracking-widest active:bg-red-50 transition-all">
                        DELETE LISTING
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Add Entry Modal - Optimized for mobile typing */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4 bg-forest/50 backdrop-blur-md">
          <div className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-400">
            <div className="p-8 border-b border-sage flex justify-between items-center bg-background-light">
              <h3 className="text-2xl font-black text-forest">Add Property</h3>
              <button onClick={() => setShowModal(false)} className="size-10 flex items-center justify-center rounded-full bg-gray-100 text-forest/40 hover:text-forest transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handlePublish} className="p-8 flex flex-col gap-6 pb-16 md:pb-8">
               <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em]">Address / Title</label>
                <input required placeholder="Skyline Lofts" className="bg-sage/10 border-sage rounded-2xl h-14 px-5 text-base font-black focus:ring-primary focus:border-primary" 
                       value={newApt.title} onChange={e => setNewApt({...newApt, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em]">Rent ($)</label>
                  <input required type="number" placeholder="2400" className="bg-sage/10 border-sage rounded-2xl h-14 px-5 text-base font-black focus:ring-primary" 
                         value={newApt.price} onChange={e => setNewApt({...newApt, price: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-forest/40 uppercase tracking-[0.2em]">Config</label>
                  <input required placeholder="1B/1B" className="bg-sage/10 border-sage rounded-2xl h-14 px-5 text-base font-black focus:ring-primary" 
                         value={newApt.specs} onChange={e => setNewApt({...newApt, specs: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-primary text-white h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4">
                SAVE TO DATABASE
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentView;
