
import React, { useState, useEffect, useMemo } from 'react';
import { milestones, resources, dailyTimeline as initialTimeline } from '../mockData';
import MilestoneCard from '../components/MilestoneCard';
import { storage } from '../persistence';
import { ChecklistItem, DailyLogEntry } from '../types';

const TrainingView: React.FC = () => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setChecklist(storage.getChecklist());
    // Keep time updated for predictions
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleChecklist = (id: string) => {
    setIsSyncing(true);
    const updated = checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);
    storage.saveChecklist(updated);
    setTimeout(() => setIsSyncing(false), 800);
  };

  // Smart Notification Logic
  const smartNotifications = useMemo(() => {
    const notifications: { type: 'potty' | 'meal'; message: string; sub: string; icon: string }[] = [];
    const hours = currentTime.getHours();
    
    // 1. Potty Prediction based on last Meal or Sleep
    // For demo purposes, we look at the mock data's latest entries
    const lastMeal = initialTimeline.find(t => t.type === 'Meal');
    const lastSleep = initialTimeline.find(t => t.type === 'Sleep');

    // Puppies usually need to go 15-30 mins after eating or waking up
    // We'll simulate this logic by checking if a meal happened recently
    if (lastMeal) {
      notifications.push({
        type: 'potty',
        message: 'Potty Break Alert',
        sub: 'Cooper finished a meal 25m ago. High probability of needing a "Pee" or "Poop" break in the next 10-15 minutes.',
        icon: 'warning'
      });
    }

    // 2. Meal Reminders based on time of day
    const hasBreakfast = initialTimeline.some(t => t.label.toLowerCase().includes('breakfast'));
    const hasLunch = initialTimeline.some(t => t.label.toLowerCase().includes('lunch'));
    const hasDinner = initialTimeline.some(t => t.label.toLowerCase().includes('dinner'));

    if (hours >= 11 && hours <= 13 && !hasLunch) {
      notifications.push({
        type: 'meal',
        message: 'Lunch Time Soon',
        sub: 'It is almost midday. Time to prepare 1.5 cups of puppy kibble for Cooper.',
        icon: 'restaurant'
      });
    } else if (hours >= 17 && hours <= 19 && !hasDinner) {
      notifications.push({
        type: 'meal',
        message: 'Dinner Reminder',
        sub: 'The evening window is opening. Cooper will be looking for his dinner soon!',
        icon: 'notifications_active'
      });
    }

    return notifications;
  }, [currentTime]);

  return (
    <div className="px-4 md:px-12 lg:px-24 flex flex-col max-w-[1200px] mx-auto py-8 gap-10">
      
      {/* Smart Insights Section */}
      {smartNotifications.length > 0 && (
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-1 shadow-sm overflow-hidden">
            <div className="bg-white rounded-[22px] p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex flex-shrink-0 size-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 relative">
                <span className="material-symbols-outlined text-3xl animate-pulse">{smartNotifications[0].icon}</span>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500"></span>
                </span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-orange-600 text-[10px] font-black text-white uppercase tracking-widest">Smart Prediction</span>
                  <h3 className="font-black text-text-main text-xl">{smartNotifications[0].message}</h3>
                </div>
                <p className="text-text-muted text-sm leading-relaxed max-w-2xl">
                  {smartNotifications[0].sub}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2.5 bg-orange-600 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all">
                  Log Potty
                </button>
                <button className="px-4 py-2.5 bg-white border border-orange-200 text-orange-600 rounded-full text-sm font-bold hover:bg-orange-50 transition-all">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="rounded-2xl bg-surface-light border border-border-sand overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row">
          <div className="flex flex-col gap-6 p-8 lg:p-12 lg:w-1/2 justify-center">
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold w-fit uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm">event</span> Gotcha Day
              </span>
              <h1 className="text-text-main text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Counting down to <span className="text-primary">Cooper</span>
              </h1>
              <p className="text-text-muted text-lg leading-relaxed">
                Get everything ready for your new best friend. Only a few weeks left until puppy breath fills the apartment!
              </p>
            </div>
            <div className="flex gap-4 py-4 flex-wrap">
              {[
                { label: 'Days', val: '14' },
                { label: 'Hours', val: '09' },
                { label: 'Mins', val: '30' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/30 text-text-main text-2xl font-bold border border-secondary">
                    {item.val}
                  </div>
                  <span className="text-xs uppercase font-bold text-text-muted tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
            <button className="w-fit flex items-center justify-center rounded-full h-12 px-8 bg-primary hover:bg-green-600 text-white text-base font-bold transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95">
              Log Today's Training
            </button>
          </div>
          <div 
            className="lg:w-1/2 min-h-[300px] lg:min-h-full bg-cover bg-center" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDdoiUUI8y85IaKp2D3bBxpCQJWHf7C3sRJlMLh_DuXVrsQeGZhpvPMkH8wRoJYxHygLH1-aJfpUQDhxr3bq8F5b61ju5FJDnz6EtYBYSqBPQRCRQHCQyC_8C8slhueUI1ZXRHY6R8dWVhsbINDrhej442_e-9ln_at7CQrNkgxu9sEaV7PgBBM7i8feK-HduYLsl_pc-7MylW8k_zouQt_fRrEz_H8M0g_frgKsw3BzOqtSSGBTEKFoo0KpJzlMMKJYQ-u2GaeLns")' }}
          />
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Prep & Daily Log */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-main">Preparation</h2>
            <div className="flex items-center gap-2">
              {isSyncing && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase animate-pulse">
                   <span className="material-symbols-outlined text-[12px]">cloud_upload</span> Syncing
                </span>
              )}
              <span className="text-sm font-medium text-primary cursor-pointer hover:underline">View All</span>
            </div>
          </div>

          {/* Checklist */}
          <div className="p-5 rounded-2xl bg-surface-light border border-border-sand shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified</span>
              First 48 Hours Checklist
            </h3>
            <div className="flex flex-col gap-3">
              {checklist.map((item) => (
                <div key={item.id} className={`group rounded-xl border transition-all duration-300 ${item.completed ? 'bg-green-50/50 border-primary/20' : 'bg-background-light border-transparent'}`}>
                  <div className="flex items-start gap-3 p-3">
                    <button 
                      onClick={() => toggleChecklist(item.id)}
                      className={`mt-0.5 size-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        item.completed ? 'bg-primary border-primary' : 'border-border-sand hover:border-primary'
                      }`}
                    >
                      <span className={`material-symbols-outlined text-white text-[16px] transition-opacity ${item.completed ? 'opacity-100' : 'opacity-0'}`}>check</span>
                    </button>
                    <div className="flex flex-col gap-1">
                      <span className={`text-sm font-bold transition-all ${item.completed ? 'text-text-muted line-through' : 'text-text-main'}`}>
                        {item.title}
                      </span>
                      <p className={`text-xs leading-relaxed transition-all ${item.completed ? 'text-text-muted/60' : 'text-text-muted'}`}>
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apartment Hunt Mini Card */}
          <div className="rounded-2xl bg-secondary p-6 flex flex-col items-start gap-4 bg-opacity-40 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-text-main mb-1">Apartment Hunt</h3>
              <p className="text-text-muted text-sm mb-4">Looking for pet-friendly places?</p>
              <button className="bg-white text-text-main text-sm font-bold px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors">
                View Saved Listings
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[120px] text-white opacity-30 rotate-12">apartment</span>
          </div>
        </div>

        {/* Right Column: Training & Resources */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Daily Habits Log */}
          <div className="rounded-2xl bg-surface-light border border-border-sand p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-text-main flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history_edu</span>
                  Daily Puppy Log
                </h2>
                <p className="text-text-muted text-sm mt-1">Track Cooper's daily habits and schedule</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-muted">Oct 24, Today</span>
                <button className="size-8 flex items-center justify-center rounded-full border border-border-sand hover:bg-gray-100 transition-colors">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: 'restaurant', label: 'Meal', color: 'orange' },
                { icon: 'bedtime', label: 'Sleep', color: 'blue' },
                { icon: 'water_drop', label: 'Pee', color: 'yellow' },
                { icon: 'eco', label: 'Poop', color: 'primary' }
              ].map((habit, idx) => (
                <button key={idx} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-border-sand bg-background-light hover:border-primary/50 hover:bg-green-50 transition-all group">
                  <div className={`size-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform ${habit.color === 'primary' ? 'bg-primary/20 text-primary' : `bg-${habit.color}-100 text-${habit.color}-600`}`}>
                    <span className="material-symbols-outlined">{habit.icon}</span>
                  </div>
                  <span className="font-bold text-sm text-text-main">{habit.label}</span>
                </button>
              ))}
            </div>

            <div className="rounded-xl bg-background-light p-4 border border-border-sand/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Today's Timeline</h3>
                <span className="text-xs font-semibold text-primary cursor-pointer">View Full Log</span>
              </div>
              <div className="space-y-4 relative">
                <div className="absolute left-[5.5rem] top-2 bottom-2 w-px bg-border-sand"></div>
                {initialTimeline.map((log, idx) => (
                  <div key={idx} className="relative flex items-center gap-4">
                    <span className="text-xs font-medium text-text-muted w-16 text-right">{log.time}</span>
                    <div className={`relative z-10 size-3 rounded-full border-2 border-surface-light ${
                      log.type === 'Sleep' ? 'bg-blue-400' :
                      log.type === 'Pee' ? 'bg-yellow-400' :
                      log.type === 'Poop' ? 'bg-primary' : 'bg-orange-400'
                    }`}></div>
                    <div className="text-sm text-text-main">
                      {log.label} {log.detail && <span className="text-text-muted italic ml-1">{log.detail}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training Log Table */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-text-main">Weekly Training Log</h2>
              <div className="flex gap-2">
                <button className="flex items-center justify-center size-8 rounded-full bg-white border border-border-sand text-text-muted hover:bg-gray-50"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <span className="flex items-center px-3 rounded-full bg-white border border-border-sand text-sm font-medium">Oct 14 - Oct 20</span>
                <button className="flex items-center justify-center size-8 rounded-full bg-white border border-border-sand text-text-muted hover:bg-gray-50"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
            <div className="rounded-2xl bg-surface-light border border-border-sand overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-background-light text-text-muted">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Focus Area</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Recent Progress</th>
                      <th className="px-6 py-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-sand">
                    {milestones.map(m => <MilestoneCard key={m.id} milestone={m} />)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-text-main mb-6">Learning Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map(r => (
                <div key={r.id} className="group flex flex-col p-4 rounded-2xl bg-surface-light border border-border-sand hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md">
                  <div 
                    className={`h-32 w-full rounded-xl bg-cover bg-center mb-4 relative flex items-center justify-center ${!r.img ? 'bg-secondary/20' : ''}`}
                    style={r.img ? { backgroundImage: `url('${r.img}')` } : {}}
                  >
                    {!r.img && <span className="material-symbols-outlined text-5xl text-orange-400">description</span>}
                    {r.type === 'video' && (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center">
                        <div className="size-10 bg-white/90 rounded-full flex items-center justify-center shadow-md"><span className="material-symbols-outlined text-red-500">play_arrow</span></div>
                      </div>
                    )}
                    {r.type === 'article' && (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center">
                        <div className="size-10 bg-white/90 rounded-full flex items-center justify-center shadow-md"><span className="material-symbols-outlined text-blue-500">article</span></div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-text-main text-base mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="text-xs text-text-muted line-clamp-2">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingView;
