
import React, { useState, useEffect, useMemo } from 'react';
import { feedListings as initialFeed } from '../mockData';
import ApartmentCard from '../components/ApartmentCard';
import { storage } from '../persistence';
import { Apartment } from '../types';

type SortOption = 'latest' | 'oldest' | 'price-low' | 'price-high';

const ApartmentView: React.FC = () => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('latest');
  const [newApt, setNewApt] = useState({
    title: '',
    price: '',
    specs: '',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    petTag: 'Golden Friendly'
  });

  useEffect(() => {
    setApartments(storage.getApartments());
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
      createdAt: Date.now()
    };
    
    const updated = storage.saveApartment(apartment);
    setApartments(updated);
    setShowModal(false);
    setNewApt({ title: '', price: '', specs: '', img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800', petTag: 'Golden Friendly' });
  };

  const shortlist = sortedApartments.slice(0, 3);

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 relative">
      <div className="w-full max-w-[1200px] flex flex-col gap-10">
        {/* Heading & Stats */}
        <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end">
          <div className="flex flex-col gap-2 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-forest">Finding Goldie's Home</h2>
            <p className="text-lg text-forest/70 font-medium">Tracking rental updates and dog-friendly spots.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {[
              { label: 'Viewed', val: apartments.length.toString(), icon: 'visibility' },
              { label: 'Toured', val: '3', icon: 'directions_walk', primary: true },
              { label: 'Applied', val: '1', icon: 'assignment_turned_in' }
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
              Apartment Shortlist
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
                <span className="material-symbols-outlined text-sm">add</span> Publish New
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shortlist.length > 0 ? (
              shortlist.map(apt => <ApartmentCard key={apt.id} apartment={apt} />)
            ) : (
              <div className="col-span-full py-20 text-center bg-sage/10 rounded-3xl border border-dashed border-sage">
                <span className="material-symbols-outlined text-4xl text-sage mb-2">apartment</span>
                <p className="text-forest/40 font-bold">No apartments published yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Map & Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:min-h-[600px]">
          {/* Mock Map */}
          <div className="lg:col-span-7 flex flex-col rounded-xl bg-white border border-sage overflow-hidden shadow-sm h-[400px] lg:h-full relative group">
            <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">map</span>
                Location Scout
              </h3>
            </div>
            <div 
              className="w-full h-full bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-700"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=1000')" }}
            />
            {/* Mock Pins */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-xl animate-bounce">
              <span className="material-symbols-outlined text-5xl">location_on</span>
            </div>
            <div className="absolute top-1/3 left-1/3 text-forest drop-shadow-lg">
              <span className="material-symbols-outlined text-4xl">location_on</span>
            </div>
          </div>

          {/* Listings Feed */}
          <div className="lg:col-span-5 flex flex-col rounded-xl bg-white border border-sage shadow-sm h-[600px] lg:h-full overflow-hidden">
            <div className="p-5 border-b border-sage bg-white z-10">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">rss_feed</span> Live Listings Feed
              </h3>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {['All', '1 Bed', '2 Bed', '🐶 Friendly'].map((filter, idx) => (
                  <button key={idx} className={`px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-colors ${idx === 0 ? 'bg-forest text-white' : 'bg-sage text-forest hover:bg-sage/70'}`}>
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
              <div className="flex flex-col gap-2">
                {sortedApartments.map(listing => (
                  <div key={listing.id} className="flex gap-3 p-3 rounded-xl hover:bg-background-light transition-colors cursor-pointer group">
                    <div 
                      className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0 shadow-sm"
                      style={{ backgroundImage: `url('${listing.img}')` }}
                    />
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-forest truncate">{listing.title}</p>
                        <span className="text-xs text-forest/50 whitespace-nowrap">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-primary font-bold text-sm">{listing.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-forest/60">{listing.specs}</span>
                        <span className="w-1 h-1 rounded-full bg-forest/30"></span>
                        <span className="text-xs font-bold text-primary">{listing.petTag}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {initialFeed.map(listing => (
                  <div key={listing.id} className="flex gap-3 p-3 rounded-xl hover:bg-background-light opacity-60 grayscale-[0.5] transition-colors cursor-pointer group">
                    <div 
                      className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0 shadow-sm"
                      style={{ backgroundImage: `url('${listing.img}')` }}
                    />
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-bold text-forest truncate">{listing.title}</p>
                        <span className="text-xs text-forest/50">{listing.time}</span>
                      </div>
                      <p className="text-primary font-bold text-sm">{listing.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-forest/60">{listing.specs}</span>
                        <span className="w-1 h-1 rounded-full bg-forest/30"></span>
                        <span className={`text-xs font-bold ${listing.status === 'Ideal' ? 'text-primary' : 'text-forest/60'}`}>{listing.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Publish Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-sage animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-sage flex justify-between items-center">
              <h3 className="text-xl font-black text-forest">Publish New Listing</h3>
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
                <label className="text-xs font-bold text-forest/60 uppercase">Pet Policy</label>
                <select 
                  className="bg-sage/20 border-sage rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary transition-all"
                  value={newApt.petTag}
                  onChange={e => setNewApt({...newApt, petTag: e.target.value})}
                >
                  <option>Golden Friendly</option>
                  <option>Large Dogs OK</option>
                  <option>No Pets</option>
                </select>
              </div>
              <button 
                type="submit"
                className="mt-4 bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Sync to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApartmentView;
