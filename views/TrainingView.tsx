
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

  const removeMilestone = (id: string) => {
    const updated = db.milestones.remove(id);
    setMilestones(updated);
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
        sub: `Cooper finished "${lastMeal.label}" at ${lastMeal.time}. High probability of needing a bathroom break in the next 15-30 minutes.`,
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
        sub: 'Cooper hasn\'t had lunch yet. Prepare 1.5 cups of puppy kibble.',
        icon: 'restaurant',
        action: 'Log Lunch',
        actionType: 'Meal'
      });
    } else if (hours >= 17 && hours <= 19 && !hasDinner && !dismissedAlerts.includes('dinner_alert')) {
      notifications.push({
        id: 'dinner_alert',
        type: 'meal',
        message: 'Dinner Reminder',
        sub: 'It\'s dinner time for a growing Golden! High energy expected if skipped.',
        icon: 'notifications_active',
        action: 'Log Dinner',
        actionType: 'Meal'
      });
    }

    return notifications;
  }, [currentTime, logs, dismissedAlerts]);

  return (
    <div className="px-4 md:px-12 lg:px-24 flex flex-col max-w-[1200px] mx-auto py-8 gap-10">
      
      {/* Smart Insights Section */}
      {smartNotifications.length > 0 && (
        <section className="flex flex-col gap-4">
          {smartNotifications.map((note) => (
            <div key={note.id} className="animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="bg-orange-50 border border-orange-100 rounded-3xl p-1 shadow-sm overflow-hidden">
                <div className="bg-white rounded-[22px] p-6 flex flex-col md:flex-row items-center gap-6 relative">
                  <button 
                    onClick={() => dismissAlert(note.id)}
                    className="absolute top-4 right-4 text-orange-300 hover:text-orange-500 transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <div className="flex flex-shrink-0 size-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <span className="material-symbols-outlined text-3xl animate-pulse">{note.icon}</span>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full bg-orange-600 text-[10px] font-black text-white uppercase tracking-widest">Prediction</span>
                      <h3 className="font-black text-text-main text-xl">{note.message}</h3>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed max-w-2xl">{note.sub}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => addLog(note.actionType, note.action)}
                      className="px-6 py-2.5 bg-orange-600 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
                    >
                      {note.action}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Main Layout */}
      <div className="flex flex-col gap-12">
        
        {/* Training Hub Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-text-main">Puppy Hub</h2>
          {isSyncing && <span className="text-[10px] font-bold text-primary animate-pulse tracking-widest uppercase">Syncing...</span>}
        </div>

        {/* Daily Log Dashboard */}
        <div className="rounded-2xl bg-surface-light border border-border-sand p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history_edu</span>
            Daily Puppy Log
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: 'restaurant', label: 'Meal', type: 'Meal' as const, color: 'orange' },
              { icon: 'bedtime', label: 'Sleep', type: 'Sleep' as const, color: 'blue' },
              { icon: 'water_drop', label: 'Pee', type: 'Pee' as const, color: 'yellow' },
              { icon: 'eco', label: 'Poop', type: 'Poop' as const, color: 'primary' }
            ].map((habit) => (
              <div key={habit.type} className="flex flex-col gap-2">
                <button 
                  onClick={() => addLog(habit.type, habit.label)}
                  className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-border-sand bg-background-light hover:border-primary/50 hover:bg-green-50 transition-all group"
                >
                  <div className={`size-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${habit.color === 'primary' ? 'bg-primary/20 text-primary' : `bg-${habit.color}-100 text-${habit.color}-600`}`}>
                    <span className="material-symbols-outlined">{habit.icon}</span>
                  </div>
                  <span className="font-bold text-xs">{habit.label}</span>
                </button>
                <label className="text-[10px] text-center font-bold text-text-muted cursor-pointer hover:text-primary transition-colors">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) addLog(habit.type, `Logged ${habit.label} with Photo`, file);
                    }} 
                  />
                  + With Photo
                </label>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-background-light p-4 border border-border-sand/50">
            <h3 className="text-xs font-bold text-text-muted uppercase mb-4 tracking-widest">Recent Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {logs.slice(0, 8).map((log) => (
                <div key={log.id} className="relative flex gap-4 group bg-white p-3 rounded-xl border border-border-sand/40">
                  <span className="text-[10px] font-bold text-text-muted w-14 text-right mt-1">{log.time}</span>
                  <div className={`relative z-10 size-2.5 rounded-full border border-white mt-1.5 ${log.type === 'Sleep' ? 'bg-blue-400' : log.type === 'Pee' ? 'bg-yellow-400' : log.type === 'Poop' ? 'bg-primary' : 'bg-orange-400'}`}></div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-bold text-text-main">
                        {log.label} <span className="text-[11px] text-text-muted italic ml-1">{log.detail}</span>
                      </p>
                      <button onClick={() => removeLog(log.id)} className="opacity-0 group-hover:opacity-100 text-red-400 transition-opacity">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                    {log.image && (
                      <img src={log.image} alt="Log detail" className="w-20 h-20 object-cover rounded-lg border border-border-sand" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-main">Training Focus Areas</h2>
            <button 
              onClick={() => setShowMilestoneModal(true)}
              className="bg-primary text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              + New Area
            </button>
          </div>
          <div className="rounded-2xl bg-white border border-border-sand overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="bg-background-light text-text-muted">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Focus Area & Plan</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Current Status</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Progress Notes</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-sand">
                {milestones.length > 0 ? milestones.map(m => (
                  <MilestoneCard 
                    key={m.id} 
                    milestone={m} 
                    onRemove={removeMilestone} 
                    onEdit={openEditMilestone}
                  />
                )) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-text-muted font-medium bg-sage/5">No training goals set. Let's add your first command!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fun Gallery Section */}
        <section className="flex flex-col gap-6 p-8 rounded-3xl bg-orange-50/50 border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-orange">photo_library</span>
                Cooper's Fun Gallery
              </h2>
              <p className="text-sm text-text-muted mt-1">Just for fun: Capturing the best puppy moments!</p>
            </div>
            <label className="cursor-pointer bg-primary-orange text-white px-6 py-2 rounded-full text-xs font-bold shadow-md hover:bg-orange-600 transition-colors">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add_a_photo</span>
                Upload Fun Pic
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
            </label>
          </div>

          {gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gallery.map((photo) => (
                <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-border-sand shadow-sm hover:shadow-md transition-all">
                  <img src={photo.url} alt="Puppy Fun" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  <button 
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 size-8 rounded-full bg-white/90 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center border border-dashed border-orange-200 rounded-2xl bg-white/50">
              <span className="material-symbols-outlined text-4xl text-orange-200 mb-2">image_not_supported</span>
              <p className="text-sm text-text-muted font-medium">No fun photos yet. Start uploading!</p>
            </div>
          )}
        </section>
      </div>

      {/* Milestone Modal (Add/Edit) */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-border-sand animate-in zoom-in-95">
            <div className="p-6 border-b border-border-sand flex justify-between items-center bg-background-light">
              <h3 className="text-xl font-black text-forest">
                {editingMilestone ? 'Update Focus Area' : 'Add Training Focus Area'}
              </h3>
              <button onClick={closeMilestoneModal} className="text-forest/40 hover:text-forest transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={saveNewMilestone} className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Area Name</label>
                <input required placeholder="e.g. Loose Leash Walking" className="bg-background-light border-border-sand rounded-xl px-4 py-3 text-sm focus:ring-primary focus:border-primary" 
                       value={newMilestone.focusArea} onChange={e => setNewMilestone({...newMilestone, focusArea: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Status</label>
                  <select className="bg-background-light border-border-sand rounded-xl px-4 py-3 text-sm" value={newMilestone.status} onChange={e => setNewMilestone({...newMilestone, status: e.target.value as any})}>
                    <option value="In Progress">In Progress</option>
                    <option value="Mastered">Mastered</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Latest Progress</label>
                  <input placeholder="Almost consistent" className="bg-background-light border-border-sand rounded-xl px-4 py-3 text-sm focus:ring-primary" 
                         value={newMilestone.recentProgress} onChange={e => setNewMilestone({...newMilestone, recentProgress: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">What to work on</label>
                  <textarea rows={2} placeholder="Mastering the 180 turn" className="bg-background-light border-border-sand rounded-xl px-4 py-2 text-sm focus:ring-primary" 
                            value={newMilestone.whatToWorkOn} onChange={e => setNewMilestone({...newMilestone, whatToWorkOn: e.target.value})} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-muted uppercase tracking-wider">How to work on it</label>
                  <textarea rows={2} placeholder="Treat every time he looks" className="bg-background-light border-border-sand rounded-xl px-4 py-2 text-sm focus:ring-primary" 
                            value={newMilestone.howToWorkOn} onChange={e => setNewMilestone({...newMilestone, howToWorkOn: e.target.value})} />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                {editingMilestone ? 'Save Updates' : 'Add to Hub'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingView;
