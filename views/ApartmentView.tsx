
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

  const shortlist = sortedApartments.slice(0, 3);

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-[1200px] flex flex-col gap-10">
        {/* Heading & Stats */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-forest">Finding Goldie's Home</h2>
            <p className="text-lg text-forest/70 font-medium">Track your pet-friendly rental journey.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {[
              { label: 'Saved', val: apartments.length.toString(), icon: 'database' },
              { label: 'Toured', val: apartments.filter(a => a.status === 'Touring').length.toString(), icon: 'directions_walk', primary: true },
              { label: 'Applied', val: apartments.filter(a => a.status === 'Applied').length.toString(), icon: 'assignment_turned_in' }
            ].map((stat, idx) => (
              <div key={idx} className="flex min-w-[140px] flex-1 flex-col items-start justify-center gap-1 rounded-xl bg-white border border-sage p-5 shadow-sm">
                <div className={`flex items-center gap-2 ${stat.primary ? 'text-primary' : 'text-forest/60'}`}>
                  <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                  <p className="text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
                <p className="text-3xl font-black text-forest">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shortlist */}
        <section className="flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sage pb-4">
            <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">bookmark</span>
              My Shortlist
            </h3>
            
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-sage/30 px-3 py-1.5 rounded-full border border-sage/50">
                <span className="material-symbols-outlined text-forest/50 text-sm">sort</span>
                <select 
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent border-none text-xs font-bold text-forest focus:ring-0 cursor-pointer p-0 pr-6"
                >
                  <option value="latest">Latest Published</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              <button 
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-forest text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-forest/20 hover:scale-105 transition-all"
              >
                <span className="material-symbols-outlined text-sm">add</span> New Entry
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlist.length > 0 ? (
              shortlist.map(apt => (
                <ApartmentCard 
                  key={apt.id} 
                  apartment={apt} 
                  onViewDetails={setSelectedApartment} 
                  onRemove={removeApartment} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-sage/10 rounded-3xl border border-dashed border-sage">
                <span className="material-symbols-outlined text-4xl text-sage mb-2">apartment</span>
                <p className="text-forest/40 font-bold">Your database is empty.</p>
              </div>
            )}
          </div>
        </section>

        {/* Database Explorer */}
        <section className="flex flex-col rounded-xl bg-white border border-sage shadow-sm overflow-hidden mt-6">
          <div className="p-5 border-b border-sage bg-white">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">storage</span> Full Database List
            </h3>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
               <thead className="bg-background-light text-forest/50">
                 <tr>
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px]">Title</th>
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px]">Price</th>
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px]">Status</th>
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px]">Added</th>
                    <th className="p-4 font-bold uppercase tracking-widest text-[10px] text-right">Actions</th>
                 </tr>
               </thead>
               <tbody>
                  {sortedApartments.map(apt => (
                    <tr key={apt.id} className="border-b border-sage/30 hover:bg-sage/10 transition-colors">
                       <td className="p-4 font-bold text-forest">{apt.title}</td>
                       <td className="p-4 text-primary font-bold">{apt.price}</td>
                       <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black text-white ${apt.statusColor}`}>{apt.status}</span>
                       </td>
                       <td className="p-4 text-forest/40 text-xs">{new Date(apt.createdAt).toLocaleDateString()}</td>
                       <td className="p-4 text-right">
                          <button onClick={() => setSelectedApartment(apt)} className="text-forest hover:text-primary mr-3 text-xs font-bold uppercase">Details</button>
                          <button onClick={() => removeApartment(apt.id)} className="text-red-400 hover:text-red-600"><span className="material-symbols-outlined text-sm">delete</span></button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Detail View Modal */}
      {selectedApartment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
           <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-sage animate-in zoom-in-95">
              <div className="relative h-64 w-full">
                 <img src={selectedApartment.img} className="w-full h-full object-cover" alt={selectedApartment.title} />
                 <button onClick={() => { setSelectedApartment(null); setShowScheduleForm(false); }} className="absolute top-4 right-4 size-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-forest">
                    <span className="material-symbols-outlined">close</span>
                 </button>
              </div>
              <div className="p-8 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                 <div className="flex justify-between items-start">
                    <div>
                       <h2 className="text-3xl font-black text-forest">{selectedApartment.title}</h2>
                       <p className="text-lg text-primary font-bold">{selectedApartment.price}<span className="text-sm font-normal text-forest/50">/mo</span></p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className={`px-4 py-1.5 rounded-full text-xs font-black text-white ${selectedApartment.statusColor}`}>{selectedApartment.status}</span>
                       <span className="text-[10px] font-bold text-forest/40 uppercase">Added {new Date(selectedApartment.createdAt).toLocaleDateString()}</span>
                    </div>
                 </div>

                 {/* Editable Quick Note Section */}
                 <div className="flex flex-col gap-3 p-4 bg-background-light rounded-2xl border border-sage/30">
                    <p className="text-[10px] font-bold uppercase text-forest/40 mb-1 tracking-widest">Logs & Personal Notes</p>
                    <div className="flex gap-2 mb-2">
                       <input 
                          className="flex-1 bg-white border-sage rounded-xl px-4 py-2 text-sm focus:ring-primary"
                          placeholder="Add a note (e.g. 'Great balcony')..."
                          value={quickNote}
                          onChange={(e) => setQuickNote(e.target.value)}
                       />
                       <button 
                          onClick={handleAddQuickNote}
                          disabled={!quickNote.trim()}
                          className="bg-forest text-white px-4 rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-forest/90 transition-all"
                       >
                          Add Note
                       </button>
                    </div>
                    {selectedApartment.description ? (
                      <p className="text-sm text-forest/70 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">{selectedApartment.description}</p>
                    ) : (
                      <p className="text-xs text-forest/30 italic">No notes yet. Start tracking details about this apartment!</p>
                    )}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-sage/20 border border-sage/40">
                       <p className="text-[10px] font-bold uppercase text-forest/40 mb-1">Configuration</p>
                       <p className="text-sm font-bold text-forest">{selectedApartment.specs}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-sage/20 border border-sage/40">
                       <p className="text-[10px] font-bold uppercase text-forest/40 mb-1">Pet Policy</p>
                       <p className="text-sm font-bold text-primary flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">{selectedApartment.petIcon}</span>
                          {selectedApartment.petTag}
                       </p>
                    </div>
                 </div>

                 {showScheduleForm ? (
                   <div className="flex flex-col gap-3 p-4 bg-sage/10 rounded-2xl border border-primary/20 animate-in slide-in-from-bottom-2">
                      <p className="text-xs font-bold text-forest uppercase tracking-widest">Meeting Details</p>
                      <textarea 
                        className="bg-white border-sage rounded-xl p-3 text-sm focus:ring-primary"
                        placeholder="e.g. Oct 25 at 2pm with Agent Sarah..."
                        value={meetingInfo}
                        onChange={(e) => setMeetingInfo(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button onClick={handleScheduleViewing} className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg text-sm">Confirm Meeting</button>
                        <button onClick={() => setShowScheduleForm(false)} className="px-4 bg-gray-100 text-forest font-bold py-2.5 rounded-lg text-sm">Cancel</button>
                      </div>
                   </div>
                 ) : (
                   <div className="flex gap-4">
                      <button onClick={() => setShowScheduleForm(true)} className="flex-1 bg-forest text-white font-bold py-4 rounded-xl shadow-lg hover:bg-forest/90 transition-all">
                        Schedule Viewing
                      </button>
                      <button onClick={() => removeApartment(selectedApartment.id)} className="px-6 py-4 rounded-xl border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-colors">
                        Delete Listing
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Add Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-sage">
            <div className="p-6 border-b border-sage flex justify-between items-center bg-background-light">
              <h3 className="text-xl font-black text-forest">Add to Database</h3>
              <button onClick={() => setShowModal(false)} className="text-forest/40 hover:text-forest transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handlePublish} className="p-6 flex flex-col gap-4">
               <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-forest/60 uppercase">Property Title</label>
                <input 
                  required
                  placeholder="e.g. Skyline Apartments"
                  className="bg-sage/20 border-sage rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition-all"
                  value={newApt.title}
                  onChange={e => setNewApt({...newApt, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-forest/60 uppercase">Monthly Price</label>
                  <input 
                    required
                    type="number"
                    placeholder="2500"
                    className="bg-sage/20 border-sage rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition-all"
                    value={newApt.price}
                    onChange={e => setNewApt({...newApt, price: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-forest/60 uppercase">Specs</label>
                  <input 
                    required
                    placeholder="2 Bed • 1 Bath"
                    className="bg-sage/20 border-sage rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition-all"
                    value={newApt.specs}
                    onChange={e => setNewApt({...newApt, specs: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-forest/60 uppercase">Initial Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Great sunlight, near park..."
                  className="bg-sage/20 border-sage rounded-xl px-4 py-2 text-sm focus:ring-primary"
                  value={newApt.description}
                  onChange={e => setNewApt({...newApt, description: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="mt-4 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Save Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentView;
