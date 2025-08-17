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
}

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  pieces,
  schedule,
  settings,
  onAddPieceToDay,
  onRemovePieceFromDay,
  onMovePiece,
  onUpdateSchedule
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

  // Functions for reordering scheduled items in modal
  const handleScheduledDragStart = (e: React.DragEvent, piece: MusicalPiece, index: number) => {
    setDraggedScheduledItem({ piece, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleScheduledDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverScheduledIndex(index);
  };

  const handleScheduledDragLeave = () => {
    setDragOverScheduledIndex(null);
  };

  const handleScheduledDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverScheduledIndex(null);
    
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
    setDraggedScheduledItem(null);
  };

  // Functions for reordering scheduled items in modal
  const handleScheduledDragStart = (e: React.DragEvent, piece: MusicalPiece, index: number) => {
    setDraggedScheduledItem({ piece, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleScheduledDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverScheduledIndex(index);
  };

  const handleScheduledDragLeave = () => {
    setDragOverScheduledIndex(null);
  };

  const handleScheduledDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    setDragOverScheduledIndex(null);
    
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
    setDraggedScheduledItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-white">Weekly Schedule</h2>
          <p className="text-gray-400">Tempus fugit</p>
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
              } ${isToday ? 'ring-2 ring-blue-500/50' : ''}`