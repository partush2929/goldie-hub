
import React from 'react';
import { Milestone } from '../types';

interface MilestoneCardProps {
  milestone: Milestone;
  onRemove: (id: string) => void;
  onEdit: (milestone: Milestone) => void;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, onRemove, onEdit }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Mastered':
        return 'bg-primary/20 text-green-700';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getColorStyles = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 text-blue-600';
      case 'purple': return 'bg-purple-100 text-purple-600';
      case 'orange': return 'bg-orange-100 text-orange-600';
      case 'green': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4 font-medium text-text-main flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className={`size-8 rounded-lg ${getColorStyles(milestone.color)} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <span className="material-symbols-outlined text-lg">{milestone.icon}</span>
          </div>
          {milestone.focusArea}
        </div>
        {(milestone.whatToWorkOn || milestone.howToWorkOn) && (
          <div className="pl-11 mt-1 flex flex-col gap-1">
             {milestone.whatToWorkOn && <p className="text-[10px] text-text-muted"><strong>Focus:</strong> {milestone.whatToWorkOn}</p>}
             {milestone.howToWorkOn && <p className="text-[10px] text-text-muted"><strong>Plan:</strong> {milestone.howToWorkOn}</p>}
          </div>
        )}
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyles(milestone.status)}`}>
          {milestone.status}
        </span>
      </td>
      <td className="px-6 py-4 text-text-muted text-xs italic">{milestone.recentProgress}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEdit(milestone)}
            className="text-primary hover:text-green-600 font-semibold text-xs transition-colors px-2 py-1 bg-primary/10 rounded-lg"
          >
            Update
          </button>
          <button 
            onClick={() => onRemove(milestone.id)}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MilestoneCard;
