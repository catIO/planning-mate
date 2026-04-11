import React from 'react';
import { DaySchedule, AppSettings } from '../App';

interface SharedPlanViewProps {
  schedule: DaySchedule;
  settings: AppSettings;
}

export const SharedPlanView: React.FC<SharedPlanViewProps> = ({ schedule, settings }) => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const weekDays: number[] = [];
  const startDay = settings.startDay === -1 ? new Date().getDay() : settings.startDay;
  for (let i = 0; i < 7; i++) {
    weekDays.push((startDay + i) % 7);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <h2 className="text-2xl font-medium text-white mb-2">Weekly Practice Schedule</h2>

      {weekDays.map((dayIndex) => {
        const dayPieces = schedule[dayIndex] || [];
        const isToday = dayIndex === new Date().getDay();

        return (
          <div
            key={dayIndex}
            className={`bg-gray-800 rounded-lg border ${isToday ? 'border-blue-500/60 ring-2 ring-blue-500/30' : 'border-gray-700'}`}
          >
            <div className="px-5 py-3 border-b border-gray-700 flex items-center">
              <h3 className="font-semibold text-white text-lg">
                {dayNames[dayIndex]}
              </h3>
              {isToday && (
                <span className="ml-2 text-xs font-bold text-blue-400 uppercase tracking-wider">Today</span>
              )}
            </div>

            <div className="p-4 space-y-2">
              {dayPieces.length > 0 ? (
                dayPieces.map((piece, index) => (
                  <div
                    key={`${piece.id}-${index}`}
                    className="relative pl-4 pr-3 py-3 rounded-lg bg-gray-900/50 border border-gray-700/50"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l"
                      style={{ backgroundColor: piece.color }}
                    />
                    <div className="font-bold text-base" style={{ color: piece.color }}>
                      {piece.title}
                    </div>
                    {piece.composer && (
                      <div className="text-xs text-gray-400 font-medium italic mt-0.5">{piece.composer}</div>
                    )}
                    {piece.description && (
                      <div className="text-sm text-gray-300 mt-1.5 leading-relaxed whitespace-pre-wrap">{piece.description}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500 italic py-2 text-center">No items</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
