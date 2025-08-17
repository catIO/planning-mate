import React, { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { MusicalPiece, DaySchedule, AppSettings } from '../App';

interface WeeklyCalendarProps {
  pieces: MusicalPiece[];
  schedule: DaySchedule;
  settings: AppSettings;
  onAddPieceToDay: (dayIndex: number, piece: MusicalPiece) => void;
  onRemovePieceFromDay: (dayIndex: number, pieceId: string) => void;
  onMovePiece: (fromDay: number, toDay: number, piece: MusicalPiece) => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  pieces,
  schedule,
  settings,
  onAddPieceToDay,
  onRemovePieceFromDay,
  onMovePiece
}) => {
  console.log('WeeklyCalendar received pieces:', pieces);
  console.log('WeeklyCalendar received schedule:', schedule);
  console.log('WeeklyCalendar pieces length:', pieces.length);
  console.log('WeeklyCalendar schedule keys:', Object.keys(schedule));
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<{ piece: MusicalPiece; fromDay?: number } | null>(null);
  const [selectedDayForModal, setSelectedDayForModal] = useState<number | null>(null);
  const dragOverDay = useRef<number | null>(null);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Fixed week days - always show Monday through Sunday
  const weekDays = [1, 2, 3, 4, 5, 6, 0]; // Monday = 1, Sunday = 0

  const handleDragStart = (e: React.DragEvent, piece: MusicalPiece, fromDay?: number) => {
    setDraggedPiece({ piece, fromDay });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    dragOverDay.current = dayIndex;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragOverDay.current = null;
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    dragOverDay.current = null;
    
    if (!draggedPiece) return;

    if (draggedPiece.fromDay !== undefined) {
      // Moving from one day to another
      if (draggedPiece.fromDay !== dayIndex) {
        onMovePiece(draggedPiece.fromDay, dayIndex, draggedPiece.piece);
      }
    } else {
      // Adding from piece library
      onAddPieceToDay(dayIndex, draggedPiece.piece);
    }
    
    setDraggedPiece(null);
  };

  const openDayModal = (dayIndex: number) => {
    setSelectedDayForModal(dayIndex);
  };

  const closeDayModal = () => {
    setSelectedDayForModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-white">Weekly Schedule</h2>
          <p className="text-gray-400">Plan your week with your items</p>
        </div>
      </div>

      {/* Available Pieces */}
      {pieces.length > 0 && (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Available Items (drag to schedule)</h3>
          <div className="flex flex-wrap gap-2">
            {pieces.map((piece) => (
              <div
                key={piece.id}
                draggable
                onDragStart={(e) => handleDragStart(e, piece)}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white cursor-move hover:shadow-md transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: piece.color }}
              >
                {piece.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((dayIndex) => {
          const dayPieces = schedule[dayIndex] || [];
          const isToday = dayIndex === new Date().getDay();
          
          return (
            <div
              key={dayIndex}
              className={`bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer ${
                dragOverDay.current === dayIndex 
                  ? 'border-blue-400 bg-blue-900/20' 
                  : 'border-gray-700 hover:border-gray-600'
              } ${isToday ? 'ring-2 ring-blue-500/50' : ''}`}
              onDragOver={(e) => handleDragOver(e, dayIndex)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dayIndex)}
              onClick={() => openDayModal(dayIndex)}
            >
              <div className="p-4">
                <div className="text-center mb-4">
                  <h3 className={`font-medium ${isToday ? 'text-blue-400' : 'text-white'}`}>
                    {dayNames[dayIndex]}
                  </h3>
                </div>
                
                <div className="space-y-2 min-h-[200px]">
                  {dayPieces.map((piece, pieceIndex) => (
                    <div
                      key={`${piece.id}-${pieceIndex}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece, dayIndex)}
                      className="group relative px-3 py-2 rounded-lg text-sm font-medium text-white cursor-move hover:shadow-md transition-all duration-200"
                      style={{ backgroundColor: piece.color }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{piece.title}</span>
                        <button
                          onClick={() => onRemovePieceFromDay(dayIndex, piece.id)}
                          className="opacity-0 group-hover:opacity-100 ml-2 text-white hover:text-red-200 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {piece.composer && (
                        <div className="text-xs opacity-75 truncate mt-1">
                          {piece.composer}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {dayPieces.length === 0 && (
                    <div className="text-center py-8 text-gray-600">
                      <div className="text-sm">Drop items here</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pieces.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-gray-600 mb-4">
            <Plus className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No items to schedule</h3>
          <p className="text-gray-400">Add some items in the Items tab first</p>
        </div>
      )}

      {/* Day Modal */}
      {selectedDayForModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-white">
                  {dayNames[selectedDayForModal]}
                </h3>
                <button
                  onClick={closeDayModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {schedule[selectedDayForModal] && schedule[selectedDayForModal].length > 0 ? (
                <div className="space-y-3">
                  {schedule[selectedDayForModal].map((piece, pieceIndex) => (
                    <div
                      key={`${piece.id}-${pieceIndex}`}
                      className="flex items-center justify-between p-4 rounded-lg text-white"
                      style={{ backgroundColor: piece.color }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-lg truncate">
                          {piece.title}
                        </div>
                        {piece.composer && (
                          <div className="text-sm opacity-75 mt-1">
                            {piece.composer}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePieceFromDay(selectedDayForModal, piece.id);
                        }}
                        className="ml-4 text-white hover:text-red-200 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-lg font-medium mb-2">No items scheduled</div>
                  <div className="text-sm">Drag items from the available items above to schedule them for this day.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};