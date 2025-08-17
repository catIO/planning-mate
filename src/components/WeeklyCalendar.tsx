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
  onUpdateSchedule: (dayIndex: number, items: MusicalPiece[]) => void;
  onOpenPieceManager: () => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  pieces,
  schedule,
  settings,
  onAddPieceToDay,
  onRemovePieceFromDay,
  onMovePiece,
  onUpdateSchedule,
  onOpenPieceManager
}) => {
  console.log('WeeklyCalendar received pieces:', pieces);
  console.log('WeeklyCalendar received schedule:', schedule);
  console.log('WeeklyCalendar pieces length:', pieces.length);
  console.log('WeeklyCalendar schedule keys:', Object.keys(schedule));
  
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<{ piece: MusicalPiece; fromDay?: number } | null>(null);
  const [selectedDayForModal, setSelectedDayForModal] = useState<number | null>(null);
  const [draggedScheduledItem, setDraggedScheduledItem] = useState<{ piece: MusicalPiece; index: number } | null>(null);
  const [dragOverScheduledIndex, setDragOverScheduledIndex] = useState<number | null>(null);
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
    if (dragOverDay.current !== dayIndex) {
      dragOverDay.current = dayIndex;
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      dragOverDay.current = null;
    }
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    
    // Clear drag state after a small delay to prevent visual glitches
    setTimeout(() => {
      setDraggedPiece(null);
      dragOverDay.current = null;
    }, 50);
  };

  const openDayModal = (dayIndex: number) => {
    setSelectedDayForModal(dayIndex);
  };

  const closeDayModal = () => {
    setSelectedDayForModal(null);
  };

  // Functions for reordering scheduled items in modal
  const handleScheduledDragStart = (e: React.DragEvent, piece: MusicalPiece, index: number) => {
    setDraggedScheduledItem({ piece, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleScheduledDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverScheduledIndex !== index) {
      setDragOverScheduledIndex(index);
    }
  };

  const handleScheduledDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the drop zone
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverScheduledIndex(null);
    }
  };

  const handleScheduledDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedScheduledItem || selectedDayForModal === null) return;

    const currentItems = schedule[selectedDayForModal] || [];
    const draggedIndex = draggedScheduledItem.index;
    
    if (draggedIndex === dropIndex) return;

    // Create new array with reordered items
    const newItems = [...currentItems];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    // Update the schedule with reordered items
    onUpdateSchedule(selectedDayForModal, newItems);
    
    // Clear drag state after a small delay to prevent visual glitches
    setTimeout(() => {
      setDraggedScheduledItem(null);
      setDragOverScheduledIndex(null);
    }, 50);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-white">Weekly Practice Schedule</h2>
          <p className="text-gray-400">Tempus fugit</p>
        </div>
      </div>

      {/* Available Pieces */}
              <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 cursor-pointer hover:bg-gray-750 transition-colors" onClick={onOpenPieceManager}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-300">Repertoire (drag to schedule)</h3>
            <div className="text-xs text-gray-500">Click to manage</div>
          </div>
        <div className="flex flex-wrap gap-2">
          {pieces.length > 0 ? (
            pieces.map((piece) => (
              <div
                key={piece.id}
                draggable
                onDragStart={(e) => {
                  e.stopPropagation();
                  handleDragStart(e, piece);
                }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white cursor-move hover:shadow-md transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: piece.color }}
              >
                {piece.title}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No items added yet</div>
          )}
        </div>
      </div>

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
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-white">{dayNames[dayIndex]}</h3>
                </div>
                
                <div className="space-y-2">
                  {dayPieces.map((piece, index) => (
                    <div
                      key={`${piece.id}-${index}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece, dayIndex)}
                      className="px-2 py-1 rounded text-xs font-medium text-white cursor-move hover:shadow-sm transition-all"
                      style={{ backgroundColor: piece.color }}
                    >
                      {piece.title}
                    </div>
                  ))}
                  
                  {/* Drop indicator line */}
                  {dragOverDay.current === dayIndex && draggedPiece && (
                    <div className="h-0.5 bg-blue-400 rounded-full opacity-75"></div>
                  )}
                  
                  {dayPieces.length === 0 && (
                    <div className="text-xs text-gray-500 italic">
                      No items scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Modal */}
      {selectedDayForModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                {dayNames[selectedDayForModal]}
              </h3>
              <button
                onClick={closeDayModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Scheduled Items Section */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Scheduled Items</h4>
                <div className="space-y-3">
                  {(schedule[selectedDayForModal] || []).map((piece, index) => (
                  <React.Fragment key={`${piece.id}-${index}`}>
                    {/* Drop indicator line above item */}
                    {dragOverScheduledIndex === index && draggedScheduledItem && (
                      <div className="h-1 bg-blue-400 rounded-full opacity-75"></div>
                    )}
                    
                    <div
                      draggable
                      onDragStart={(e) => handleScheduledDragStart(e, piece, index)}
                      onDragOver={(e) => handleScheduledDragOver(e, index)}
                      onDragLeave={handleScheduledDragLeave}
                      onDrop={(e) => handleScheduledDrop(e, index)}
                      className={`p-3 rounded-lg cursor-move transition-all ${
                        dragOverScheduledIndex === index ? 'bg-blue-900/20 border border-blue-400' : ''
                      }`}
                      style={{ backgroundColor: piece.color }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-white">{piece.title}</div>
                          {piece.composer && (
                            <div className="text-sm text-white/80">{piece.composer}</div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemovePieceFromDay(selectedDayForModal, piece.id);
                          }}
                          className="text-white/70 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                
                {/* Drop indicator at the end if dragging to last position */}
                {dragOverScheduledIndex === (schedule[selectedDayForModal] || []).length && draggedScheduledItem && (
                  <div className="h-1 bg-blue-400 rounded-full opacity-75"></div>
                )}
                
                {(schedule[selectedDayForModal] || []).length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No items scheduled for this day</p>
                    <p className="text-sm mt-1">Drag items from above to schedule them</p>
                  </div>
                )}
                </div>
              </div>

              {/* Add Items Section */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Add Items</h4>
                <div className="space-y-2">
                  {pieces
                    .filter(piece => !(schedule[selectedDayForModal] || []).some(scheduledPiece => scheduledPiece.id === piece.id))
                    .map((piece) => (
                    <button
                      key={piece.id}
                      onClick={() => onAddPieceToDay(selectedDayForModal, piece)}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-700 transition-all text-left"
                    >
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: piece.color }}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-white">{piece.title}</div>
                        {piece.composer && (
                          <div className="text-sm text-gray-400">{piece.composer}</div>
                        )}
                      </div>
                      <div className="text-gray-500 text-sm">+</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};