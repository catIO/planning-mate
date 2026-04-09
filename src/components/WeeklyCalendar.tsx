import React, { useState, useRef } from 'react';
import { MaterialIcon } from './MaterialIcon';
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
  onOpenPieceManagerWithAddForm: () => void;
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  pieces,
  schedule,
  settings,
  onAddPieceToDay,
  onRemovePieceFromDay,
  onMovePiece,
  onUpdateSchedule,
  onOpenPieceManager,
  onOpenPieceManagerWithAddForm
}) => {
  const [draggedPiece, setDraggedPiece] = useState<{ piece: MusicalPiece; fromDay?: number; fromIndex?: number } | null>(null);
  const [selectedDayForModal, setSelectedDayForModal] = useState<number | null>(null);
  const [draggedScheduledItem, setDraggedScheduledItem] = useState<{ piece: MusicalPiece; index: number } | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dragOverDay, setDragOverDay] = useState<number | null>(null);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Dynamic week days based on settings
  const weekDays = [];
  const startDay = settings.startDay === -1 ? new Date().getDay() : settings.startDay;
  for (let i = 0; i < 7; i++) {
    weekDays.push((startDay + i) % 7);
  }

  const clearDragState = () => {
    setDraggedPiece(null);
    setDraggedScheduledItem(null);
    setDragOverDay(null);
    setDragOverIndex(null);
  };

  const handleDragStart = (e: React.DragEvent, piece: MusicalPiece, fromDay?: number, fromIndex?: number) => {
    setDraggedPiece({ piece, fromDay, fromIndex });
    e.dataTransfer.effectAllowed = 'move';
    // Use a small delay to ensure the drag image is created before any state changes that might affect the element
  };

  const handleDragOver = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (dragOverDay !== dayIndex) {
      setDragOverDay(dayIndex);
    }
    
    // If we're hovering the card itself, default to the end of the list
    const dayPieces = schedule[dayIndex] || [];
    if (dragOverIndex !== dayPieces.length) {
      setDragOverIndex(dayPieces.length);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    // Only clear if we actually left the element, not just entered a child
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverDay(null);
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dayIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedPiece) return;

    const currentItems = schedule[dayIndex] || [];
    // If dropped on the card background, use the end of the list
    const dropIndex = dragOverIndex !== null ? dragOverIndex : currentItems.length;

    executeReorder(dayIndex, dropIndex);
  };

  const executeReorder = (dayIndex: number, dropIndex: number) => {
    if (!draggedPiece) return;

    const currentToItems = schedule[dayIndex] || [];
    
    if (draggedPiece.fromDay === dayIndex && draggedPiece.fromIndex !== undefined) {
      // Reordering within same day
      const draggedIndex = draggedPiece.fromIndex;
      if (draggedIndex === dropIndex) {
        clearDragState();
        return;
      }
      
      const newItems = [...currentToItems];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      
      // Adjust drop index if we're moving something down
      let adjustedDropIndex = dropIndex;
      if (draggedIndex < dropIndex) {
        adjustedDropIndex = Math.max(0, dropIndex - 1);
      }
      
      newItems.splice(adjustedDropIndex, 0, draggedItem);
      onUpdateSchedule(dayIndex, newItems);
    } else if (draggedPiece.fromDay !== undefined) {
      // Moving between days
      const fromDayItems = (schedule[draggedPiece.fromDay] || []).filter((_, i) => i !== draggedPiece.fromIndex);
      const toDayItems = [...currentToItems];
      toDayItems.splice(dropIndex, 0, draggedPiece.piece);
      
      onUpdateSchedule(draggedPiece.fromDay, fromDayItems);
      onUpdateSchedule(dayIndex, toDayItems);
    } else {
      // Adding from repertoire
      const toDayItems = [...currentToItems];
      toDayItems.splice(dropIndex, 0, draggedPiece.piece);
      onUpdateSchedule(dayIndex, toDayItems);
    }
    
    setTimeout(clearDragState, 50);
  };

  const openDayModal = (dayIndex: number) => {
    setSelectedDayForModal(dayIndex);
  };

  const closeDayModal = () => {
    setSelectedDayForModal(null);
    clearDragState();
  };

  const handleScheduledDragStart = (e: React.DragEvent, piece: MusicalPiece, index: number) => {
    setDraggedScheduledItem({ piece, index });
    setDraggedPiece({ piece, fromDay: selectedDayForModal!, fromIndex: index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleScheduledDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleScheduledDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selectedDayForModal === null) return;
    executeReorder(selectedDayForModal, dropIndex);
  };

  const handleGridItemDragOver = (e: React.DragEvent, dayIndex: number, itemIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    
    if (dragOverDay !== dayIndex) {
      setDragOverDay(dayIndex);
    }
    
    if (dragOverIndex !== itemIndex) {
      setDragOverIndex(itemIndex);
    }
  };

  const handleGridItemDrop = (e: React.DragEvent, dayIndex: number, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    executeReorder(dayIndex, dropIndex);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-white">Weekly Practice Schedule</h2>
          <p className="text-gray-400">Tempus fugit</p>
        </div>
      </div>

      {pieces.length > 0 ? (
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 cursor-pointer hover:bg-gray-750 transition-colors" onClick={onOpenPieceManager}>
          <div className="flex items-center justify-end mb-3">
            <div className="text-xs text-gray-500">Click to manage, drag items to schedule</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {pieces.map((piece) => {
              const usageCount = Object.values(schedule).reduce((total, dayPieces) => {
                return total + dayPieces.filter((p: MusicalPiece) => p.id === piece.id).length;
              }, 0);
              
              return (
                <div
                  key={piece.id}
                  draggable
                  onDragStart={(e) => {
                    e.stopPropagation();
                    handleDragStart(e, piece);
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white cursor-move hover:shadow-md transition-all duration-200 hover:scale-105 relative"
                  style={{ backgroundColor: piece.color }}
                >
                  {piece.title}
                  {usageCount > 0 && (
                    <span className="ml-2 bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                      {usageCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="text-center py-12 max-w-md">
            <MaterialIcon icon="library_music" size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-3">Your repertoire is empty</h3>
            <p className="text-gray-400 mb-6">
              Add pieces to your repertoire then drag them to your calendar.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPieceManagerWithAddForm();
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              <MaterialIcon icon="add" size={20} className="mr-2" />
              Add Your First Item
            </button>
          </div>
        </div>
      )}

      <div 
        className="grid grid-cols-1 md:grid-cols-7 gap-4 weekly-calendar-grid"
        style={{ 
          '--today-grid-template': weekDays.map(dayIndex => dayIndex === new Date().getDay() ? '1.5fr' : '1fr').join(' ')
        } as React.CSSProperties}
      >
        {weekDays.map((dayIndex) => {
          const dayPieces = schedule[dayIndex] || [];
          const isToday = dayIndex === new Date().getDay();
          
          return (
            <div
              key={dayIndex}
              className={`bg-gray-800 rounded-lg shadow-sm border-2 transition-all duration-200 cursor-pointer ${
                dragOverDay === dayIndex && dragOverIndex === dayPieces.length
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
                  <h3 className="font-medium text-white">
                    {dayNames[dayIndex]}
                    {isToday && <span className="ml-2 text-xs font-bold text-blue-400 uppercase tracking-wider">Today</span>}
                  </h3>
                </div>
                
                <div className="space-y-2 relative">
                  {dayPieces.map((piece, index) => (
                    <React.Fragment key={`${piece.id}-${index}`}>
                      {dragOverDay === dayIndex && dragOverIndex === index && draggedPiece && (
                         <div className="h-1 bg-blue-400 rounded-full opacity-75 my-1" />
                      )}
                      
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, piece, dayIndex, index)}
                        onDragOver={(e) => handleGridItemDragOver(e, dayIndex, index)}
                        onDrop={(e) => handleGridItemDrop(e, dayIndex, index)}
                        className={isToday 
                          ? `relative pl-3 pr-2 py-2 rounded bg-gray-900/60 border cursor-move hover:bg-gray-900/80 transition-all group shadow-sm ${
                              dragOverDay === dayIndex && dragOverIndex === index ? 'border-blue-400 bg-blue-900/20' : 'border-gray-700/50'
                            }`
                          : `px-2 py-1 rounded text-xs font-medium text-white cursor-move hover:shadow-sm transition-all truncate border-2 ${
                               dragOverDay === dayIndex && dragOverIndex === index ? 'border-blue-400' : 'border-transparent'
                            }`
                        }
                        style={isToday ? {} : { backgroundColor: piece.color }}
                      >
                        {isToday ? (
                          <>
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-1 rounded-l transition-all group-hover:w-1.5" 
                              style={{ backgroundColor: piece.color }}
                            />
                            <div className="text-base font-bold leading-tight" style={{ color: piece.color }}>
                              {piece.title}
                            </div>
                            {piece.description && (
                              <div className="text-sm text-gray-300 opacity-90 mt-1.5 line-clamp-3 leading-relaxed">
                                {piece.description}
                              </div>
                            )}
                          </>
                        ) : piece.title}
                      </div>
                    </React.Fragment>
                  ))}
                  
                  {dragOverDay === dayIndex && dragOverIndex === dayPieces.length && draggedPiece && dayPieces.length > 0 && (
                    <div className="h-1 bg-blue-400 rounded-full opacity-75 my-1" />
                  )}

                  {dayPieces.length === 0 && (
                    <div className={`text-xs text-gray-500 italic py-2 rounded border border-dashed border-gray-700 flex items-center justify-center transition-colors ${dragOverDay === dayIndex ? 'bg-blue-900/10 border-blue-400/50' : ''}`}>
                      Practice!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDayForModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={closeDayModal}>
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">
                {dayNames[selectedDayForModal]}
                {selectedDayForModal === new Date().getDay() && <span className="ml-2 text-xs text-blue-400">TODAY</span>}
              </h3>
              <button onClick={closeDayModal} className="text-gray-400 hover:text-white transition-colors">
                <MaterialIcon icon="close" size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">Scheduled Items</h4>
                <div className="space-y-3 relative">
                  {(schedule[selectedDayForModal] || []).map((piece, index) => (
                    <React.Fragment key={`${piece.id}-${index}`}>
                      {dragOverIndex === index && draggedPiece && (
                         <div className="h-1 bg-blue-400 rounded-full opacity-75 my-1" />
                      )}
                      <div
                        draggable
                        onDragStart={(e) => handleScheduledDragStart(e, piece, index)}
                        onDragOver={(e) => handleScheduledDragOver(e, index)}
                        onDrop={(e) => handleScheduledDrop(e, index)}
                        className={`relative pl-4 pr-3 py-3 rounded-lg cursor-move transition-all bg-gray-700/30 border ${
                          dragOverIndex === index ? 'border-blue-400 bg-blue-900/20 shadow-lg' : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l" style={{ backgroundColor: piece.color }} />
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-bold text-base" style={{ color: piece.color }}>{piece.title}</div>
                            {piece.composer && <div className="text-xs text-gray-400 font-medium italic mt-0.5">{piece.composer}</div>}
                            {piece.description && <div className="text-sm text-gray-300 mt-2 leading-relaxed">{piece.description}</div>}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemovePieceFromDay(selectedDayForModal, piece.id);
                            }}
                            className="ml-4 p-1 text-gray-500 hover:text-red-400 transition-colors rounded-full hover:bg-gray-800"
                          >
                            <MaterialIcon icon="close" size={18} />
                          </button>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  
                  {dragOverIndex === (schedule[selectedDayForModal] || []).length && draggedPiece && (schedule[selectedDayForModal] || []).length > 0 && (
                    <div className="h-1 bg-blue-400 rounded-full opacity-75 my-1" />
                  )}
                  
                  {(schedule[selectedDayForModal] || []).length === 0 && (
                    <div className="text-center py-8 text-gray-400 border border-dashed border-gray-700 rounded-lg">
                      <p>No items scheduled for this day</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Add Items</h4>
                <div className="space-y-2">
                  {pieces
                    .filter(piece => !(schedule[selectedDayForModal] || []).some(p => p.id === piece.id))
                    .map((piece) => (
                      <button
                        key={piece.id}
                        onClick={() => onAddPieceToDay(selectedDayForModal, piece)}
                        className="group w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-600 hover:border-gray-500 hover:bg-gray-700 transition-all text-left"
                      >
                        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: piece.color }} />
                        <div className="flex-1">
                          <div className="font-medium text-white">{piece.title}</div>
                          {piece.composer && <div className="text-xs text-blue-400">{piece.composer}</div>}
                        </div>
                        <div className="text-gray-400 group-hover:text-white transition-colors">
                          <MaterialIcon icon="add" size={24} />
                        </div>
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