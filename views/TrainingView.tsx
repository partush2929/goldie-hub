
import React, { useState, useEffect, useMemo } from 'react';
import MilestoneCard from '../components/MilestoneCard';
import { db } from '../persistence';
import { DailyLogEntry, Milestone, GalleryPhoto } from '../types';

const TrainingView: React.FC = () => {
  const [logs, setLogs] = useState<DailyLogEntry[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  // Modal States
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Focus Area Form State
  const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({
    focusArea: '',
    whatToWorkOn: '',
    howToWorkOn: '',
    icon: 'school',
    color: 'blue',
    status: 'In Progress',
    recentProgress: 'Just started'
  });

  useEffect(() => {
    setLogs(db.logs.get());
    setMilestones(db.milestones.get());
    setGallery(db.gallery.get());
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const addLog = async (type: DailyLogEntry['type'], label: string, imageFile?: File) => {
    setIsSyncing(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let base64Image = '';
    if (imageFile) {
      base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const newEntry: DailyLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      time: timeStr,
      label: label,
      type: type,
      detail: type === 'Pee' || type === 'Poop' ? '- Backyard' : undefined,
      image: base64Image || undefined
    };
    const updated = db.logs.add(newEntry);
    setLogs(updated);
    setTimeout(() => setIsSyncing(false), 500);
  };

  const removeLog = (id: string) => {
    const updated = db.logs.remove(id);
    setLogs(updated);
  };

  const saveNewMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMilestone) {
      const updated = db.milestones.update(editingMilestone.id, {
        focusArea: newMilestone.focusArea,
        status: newMilestone.status as any,
        recentProgress: newMilestone.recentProgress,
        whatToWorkOn: newMilestone.whatToWorkOn,
        howToWorkOn: newMilestone.howToWorkOn,
        color: newMilestone.color as any,
        icon: newMilestone.icon
      });
      setMilestones(updated);
    } else {
      const milestone: Milestone = {
        id: Math.random().toString(36).substring(2, 9),
        focusArea: newMilestone.focusArea || 'New Focus',
        status: (newMilestone.status as any) || 'In Progress',
        recentProgress: newMilestone.recentProgress || 'Just started',
        icon: newMilestone.icon || 'school',
        color: (newMilestone.color as any) || 'blue',
        whatToWorkOn: newMilestone.whatToWorkOn,
        howToWorkOn: newMilestone.howToWorkOn
      };
      const updated = db.milestones.add(milestone);
      setMilestones(updated);
    }
    closeMilestoneModal();
  };

  // Fix: Added missing removeMilestone function to handle milestone deletion
  const removeMilestone = (id: string) => {
    const updated = db.milestones.remove(id);
    setMilestones(updated);
  };

  const openEditMilestone = (m: Milestone) => {
    setEditingMilestone(m);
    setNewMilestone(m);
    setShowMilestoneModal(true);
  };

  const closeMilestoneModal = () => {
    setShowMilestoneModal(false);
    setEditingMilestone(null);
    setNewMilestone({ focusArea: '', whatToWorkOn: '', howToWorkOn: '', icon: 'school', color: 'blue', status: 'In Progress', recentProgress: 'Just started' });
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSyncing(true);
    const base64: string = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const newPhoto: GalleryPhoto = {
      id: Math.random().toString(36).substring(2, 9),
      url: base64,
      timestamp: Date.now()
    };
    const updated = db.gallery.add(newPhoto);
    setGallery(updated);
    setTimeout(() => setIsSyncing(false), 500);
  };

  const removePhoto = (id: string) => {
    const updated = db.gallery.remove(id);
    setGallery(updated);
  };

  const dismissAlert = (id: string) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const smartNotifications = useMemo(() => {
    const notifications: { id: string; type: 'potty' | 'meal'; message: string; sub: string; icon: string; action: string; actionType: DailyLogEntry['type'] }[] = [];
    const hours = currentTime.getHours();
    
    const lastMeal = logs.find(t => t.type === 'Meal');
    const hasBreakfast = logs.some(t => t.label.toLowerCase().includes('breakfast'));
    const hasLunch = logs.some(t => t.label.toLowerCase().includes('lunch'));
    const hasDinner = logs.some(t => t.label.toLowerCase().includes('dinner'));

    if (lastMeal && !dismissedAlerts.includes('potty_alert')) {
      notifications.push({
        id: 'potty_alert',
        type: 'potty',
        message: 'Potty Break Alert',
        sub: `Puppy finished "${lastMeal.label}" at ${lastMeal.time}.`,
        icon: 'warning',
        action: 'Log Potty',
        actionType: 'Pee'
      });
    }

    if (hours >= 11 && hours <= 13 && !hasLunch && !dismissedAlerts.includes('lunch_alert')) {
      notifications.push({
        id: 'lunch_alert',
        type: 'meal',
        message: 'Lunch Time Soon',
        sub: 'Time for 1.5 cups of puppy kibble.',
        icon: 'restaurant',
        action: 'Log Lunch',
        actionType: 'Meal'
      });
    } else if (hours >= 17 && hours <= 19 && !hasDinner && !dismissedAlerts.includes('dinner_alert')) {
      notifications.push({
        id: 'dinner_alert',
        type: 'meal',
        message: 'Dinner Reminder',
        sub: 'It\'s dinner time for a growing Golden!',
        icon: 'notifications_active',
        action: 'Log Dinner',
        actionType: 'Meal'
      });
    }

    return notifications;
  }, [currentTime, logs, dismissedAlerts]);

  return (
    <div className="px-4 md:px-12 lg:px-24 flex flex-col max-w-[1200px] mx-auto py-6 md:py-12 gap-8 md:gap-12">
      
      {/* Smart Insights Section */}
      {smartNotifications.length > 0 && (
        <section className="flex flex-col gap-4">
          {smartNotifications.map((note) => (
            <div key={note.id} className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="bg-orange-50 border border-orange-100 rounded-3xl p-1 shadow-sm overflow-hidden">
                <div className="bg-white rounded-[22px] p-5 flex flex-col md:flex-row items-center gap-4 relative">
                  <button 
                    onClick={() => dismissAlert(note.id)}
                    className="absolute top-4 right-4 text-orange-200 hover:text-orange-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                  <div className="flex flex-shrink-0 size-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <span className="material-symbols-outlined text-2xl">{note.icon}</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-black text-text-main text-lg leading-tight mb-1">{note.message}</h3>
                    <p className="text-text-muted text-sm leading-tight">{note.sub}</p>
                  </div>
                  <button 
                    onClick={() => addLog(note.actionType, note.action)}
                    className="w-full md:w-auto px-6 h-12 bg-orange-600 text-white rounded-2xl text-sm font-black shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-95 transition-all"
                  >
                    {note.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Daily Log Optimized for Mobile */}
      <section className="rounded-3xl bg-surface-light border border-border-sand p-5 md:p-8 shadow-sm">
        <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">history_edu</span>
          Daily Training Log
        </h2>
        
        {/* Habit Grid - Thumb-width targets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: 'restaurant', label: 'Meal', type: 'Meal' as const, color: 'orange' },
            { icon: 'bedtime', label: 'Sleep', type: 'Sleep' as const, color: 'blue' },
            { icon: 'water_drop', label: 'Pee', type: 'Pee' as const, color: 'yellow' },
            { icon: 'eco', label: 'Poop', type: 'Poop' as const, color: 'primary' }
          ].map((habit) => (
            <div key={habit.type} className="flex flex-col gap-2">
              <button 
                onClick={() => addLog(habit.type, habit.label)}
                className="flex flex-col items-center justify-center gap-3 h-32 rounded-2xl border-2 border-border-sand bg-background-light active:border-primary active:bg-green-50 active:scale-95 transition-all group"
              >
                <div className={`size-12 rounded-full flex items-center justify-center group-active:scale-110 transition-transform ${habit.color === 'primary' ? 'bg-primary/20 text-primary' : `bg-${habit.color}-100 text-${habit.color}-600`}`}>
                  <span className="material-symbols-outlined text-2xl">{habit.icon}</span>
                </div>
                <span className="font-black text-xs uppercase tracking-widest">{habit.label}</span>
              </button>
              <label className="text-[10px] text-center font-black text-text-muted cursor-pointer hover:text-primary transition-colors flex items-center justify-center gap-1 py-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addLog(habit.type, habit.label, file);
                  }} 
                />
                <span className="material-symbols-outlined text-[14px]">add_a_photo</span> PHOTO
              </label>
            </div>
          ))}
        </div>

        {/* Vertical Timeline - Optimized for one-handed scroll */}
        <div className="rounded-2xl bg-background-light p-6 border border-border-sand/50">
          <h3 className="text-[10px] font-black text-text-muted uppercase mb-6 tracking-[0.2em] border-b border-border-sand pb-2">Recent Timeline</h3>
          <div className="flex flex-col gap-8 relative before:absolute before:left-[47px] before:top-2 before:bottom-2 before:w-px before:bg-border-sand">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id} className="relative flex gap-6 group items-start">
                <span className="text-[10px] font-black text-text-muted w-12 text-right mt-1.5 tabular-nums">{log.time}</span>
                <div className={`relative z-10 size-4 rounded-full border-4 border-background-light shadow-sm mt-1.5 flex-shrink-0 ${log.type === 'Sleep' ? 'bg-blue-400' : log.type === 'Pee' ? 'bg-yellow-400' : log.type === 'Poop' ? 'bg-primary' : 'bg-orange-400'}`}></div>
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-text-main leading-none">{log.label}</p>
                      {log.detail && <p className="text-xs text-text-muted mt-1 font-medium italic">{log.detail}</p>}
                    </div>
                    <button 
                      onClick={() => removeLog(log.id)} 
                      className="size-8 rounded-full flex items-center justify-center text-red-400 active:bg-red-50 transition-colors flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                  {log.image && (
                    <div className="max-w-[200px] aspect-square rounded-2xl overflow-hidden border border-border-sand shadow-sm bg-white p-1 cursor-zoom-in" onClick={() => setSelectedPhoto(log.image!)}>
                      <img src={log.image} alt="Log detail" className="w-full h-full object-cover rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas - Optimized for touch */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-text-main">Focus Areas</h2>
          <button 
            onClick={() => setShowMilestoneModal(true)}
            className="bg-primary text-white h-11 px-6 rounded-2xl text-sm font-black shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            + ADD NEW
          </button>
        </div>
        <div className="rounded-3xl bg-white border border-border-sand overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-background-light text-text-muted uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="px-6 py-5">Goal & Strategy</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Latest Wins</th>
                <th className="px-6 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-sand">
              {milestones.map(m => (
                <MilestoneCard 
                  key={m.id} 
                  milestone={m} 
                  onRemove={removeMilestone} 
                  onEdit={openEditMilestone}
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Puppy Fun Gallery Section */}
      <section className="flex flex-col gap-6 p-6 md:p-10 rounded-[2.5rem] bg-primary-orange/5 border border-primary-orange/10 shadow-sm mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-text-main flex items-center gap-3">
              <span className="material-symbols-outlined text-primary-orange text-3xl">camera_roll</span>
              The Puppy Vault
            </h2>
            <p className="text-sm font-medium text-text-muted mt-1">Collecting high-quality puppy chaos.</p>
          </div>
          <label className="cursor-pointer h-14 md:h-12 bg-primary-orange text-white px-8 rounded-2xl text-base md:text-sm font-black shadow-xl shadow-primary-orange/20 flex items-center justify-center gap-2 active:scale-95 transition-all">
            <span className="material-symbols-outlined">add_a_photo</span>
            UPLOAD FUN
            <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
          </label>
        </div>

        {gallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gallery.map((photo) => (
              <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md hover:shadow-xl transition-all cursor-zoom-in" onClick={() => setSelectedPhoto(photo.url)}>
                <img src={photo.url} alt="Puppy fun" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-3xl">open_in_full</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removePhoto(photo.id); }}
                  className="absolute top-2 right-2 size-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg md:opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center border-4 border-dashed border-primary-orange/10 rounded-[2rem] bg-white/50 text-center px-6">
            <span className="material-symbols-outlined text-6xl text-primary-orange/20 mb-4 animate-bounce">auto_stories</span>
            <p className="text-lg font-black text-text-main leading-tight">Your vault is currently empty.</p>
            <p className="text-sm font-medium text-text-muted mt-2 max-w-xs">Start filling it with memories of Puppy's first few weeks!</p>
          </div>
        )}
      </section>

      {/* Full Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-6 right-6 size-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all z-10">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
          <img 
            src={selectedPhoto} 
            alt="Full size puppy" 
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in-95 duration-300" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Mobile-Friendly Modal (Milestones) */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4 bg-forest/40 backdrop-blur-md">
          <div className="bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full duration-300">
            <div className="p-8 border-b border-border-sand flex justify-between items-center">
              <h3 className="text-2xl font-black text-forest">
                {editingMilestone ? 'Update Focus' : 'New Focus Area'}
              </h3>
              <button onClick={closeMilestoneModal} className="size-10 flex items-center justify-center rounded-full bg-gray-100 text-text-muted hover:bg-gray-200 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={saveNewMilestone} className="p-8 flex flex-col gap-6 pb-12 md:pb-8">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Goal Name</label>
                <input required placeholder="e.g. Loose Leash Walking" className="bg-background-light border-border-sand rounded-2xl h-14 px-5 text-base font-bold focus:ring-primary focus:border-primary" 
                       value={newMilestone.focusArea} onChange={e => setNewMilestone({...newMilestone, focusArea: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Current Status</label>
                  <select className="bg-background-light border-border-sand rounded-2xl h-14 px-5 text-base font-bold appearance-none" value={newMilestone.status} onChange={e => setNewMilestone({...newMilestone, status: e.target.value as any})}>
                    <option value="In Progress">In Progress</option>
                    <option value="Mastered">Mastered</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Latest Win</label>
                  <input placeholder="Almost consistent" className="bg-background-light border-border-sand rounded-2xl h-14 px-5 text-base font-bold focus:ring-primary" 
                         value={newMilestone.recentProgress} onChange={e => setNewMilestone({...newMilestone, recentProgress: e.target.value})} />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-primary text-white h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4">
                {editingMilestone ? 'SAVE CHANGES' : 'CREATE GOAL'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingView;
