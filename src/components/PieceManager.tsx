import React, { useState, useEffect } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { MusicalPiece } from '../App';

interface PieceManagerProps {
  pieces: MusicalPiece[];
  onAddPiece: (piece: MusicalPiece) => void;
  onDeletePiece: (pieceId: string) => void;
  onUpdatePiece: (pieceId: string, updatedPiece: Partial<MusicalPiece>) => void;
  openWithAddForm?: boolean;
}

const PIECE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
];

const getLastUsedColor = (): string => {
  try {
    const saved = localStorage.getItem('planningMate_lastUsedColor');
    return saved && PIECE_COLORS.includes(saved) ? saved : PIECE_COLORS[0];
  } catch (error) {
    console.error('Failed to load last used color:', error);
    return PIECE_COLORS[0];
  }
};

const saveLastUsedColor = (color: string): void => {
  try {
    localStorage.setItem('planningMate_lastUsedColor', color);
  } catch (error) {
    console.error('Failed to save last used color:', error);
  }
};

export const PieceManager: React.FC<PieceManagerProps> = ({
  pieces,
  onAddPiece,
  onDeletePiece,
  onUpdatePiece,
  openWithAddForm = false
}) => {
  console.log('PieceManager received pieces:', pieces);
  console.log('PieceManager pieces length:', pieces.length);
  
  const [isAddingPiece, setIsAddingPiece] = useState(openWithAddForm);
  const [editingPieceId, setEditingPieceId] = useState<string | null>(null);
  const [newPieceTitle, setNewPieceTitle] = useState('');
  const [newPieceComposer, setNewPieceComposer] = useState('');
  const [selectedColor, setSelectedColor] = useState(getLastUsedColor);
  const [editTitle, setEditTitle] = useState('');
  const [editComposer, setEditComposer] = useState('');
  const [editColor, setEditColor] = useState('');

  // Load last used color on component mount
  useEffect(() => {
    setSelectedColor(getLastUsedColor());
  }, []);

  const handleAddPiece = () => {
    if (newPieceTitle.trim()) {
      const newPiece: MusicalPiece = {
        id: Date.now().toString(),
        title: newPieceTitle.trim(),
        color: selectedColor,
        composer: newPieceComposer.trim() || undefined
      };
      
      onAddPiece(newPiece);
      saveLastUsedColor(selectedColor); // Save the color for next time
      setNewPieceTitle('');
      setNewPieceComposer('');
      // Keep the same color selected for the next piece
      setIsAddingPiece(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddPiece();
    }
  };

  const startEditing = (piece: MusicalPiece) => {
    setEditingPieceId(piece.id);
    setEditTitle(piece.title);
    setEditComposer(piece.composer || '');
    setEditColor(piece.color);
  };

  const saveEdit = () => {
    if (editingPieceId && editTitle.trim()) {
      onUpdatePiece(editingPieceId, {
        title: editTitle.trim(),
        composer: editComposer.trim() || undefined,
        color: editColor
      });
      setEditingPieceId(null);
      setEditTitle('');
      setEditComposer('');
      setEditColor('');
    }
  };

  const cancelEdit = () => {
    setEditingPieceId(null);
    setEditTitle('');
    setEditComposer('');
    setEditColor('');
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-normal text-white">Manage your repertoire or technical exercises</h2>
        <button
          onClick={() => setIsAddingPiece(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center"
        >
          <MaterialIcon icon="add" size={24} />
        </button>
      </div>

      {/* Add Piece Form */}
      {isAddingPiece && (
        <div className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">Add New Item</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                value={newPieceTitle}
                onChange={(e) => setNewPieceTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Project Meeting"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={newPieceComposer}
                onChange={(e) => setNewPieceComposer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Weekly team sync"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-white placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {PIECE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      saveLastUsedColor(color); // Save color when user selects it
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color 
                        ? 'border-white scale-110' 
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAddPiece}
              disabled={!newPieceTitle.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Add Item
            </button>
            <button
              onClick={() => {
                setIsAddingPiece(false);
                setNewPieceTitle('');
                setNewPieceComposer('');
                setSelectedColor(getLastUsedColor()); // Reset to last used color
              }}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pieces Grid */}
      {pieces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className="bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700 hover:shadow-lg transition-all duration-200"
            >
              {editingPieceId === piece.id ? (
                // Edit Form
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex flex-wrap gap-1">
                        {PIECE_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setEditColor(color)}
                            className={`w-6 h-6 rounded-full border-2 transition-all ${
                              editColor === color 
                                ? 'border-white scale-110' 
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={saveEdit}
                        className="text-green-500 hover:text-green-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="text-gray-500 hover:text-gray-400 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyPress={handleEditKeyPress}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Item title"
                  />
                  
                  <input
                    type="text"
                    value={editComposer}
                    onChange={(e) => setEditComposer(e.target.value)}
                    onKeyPress={handleEditKeyPress}
                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-sm text-white focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Description (optional)"
                  />
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: piece.color }}
                    />
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEditing(piece)}
                        className="text-gray-500 hover:text-blue-400 transition-colors"
                      >
                        <MaterialIcon icon="edit" size={16} />
                      </button>
                      <button
                        onClick={() => onDeletePiece(piece.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <MaterialIcon icon="delete" size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-white mb-1 line-clamp-2">
                    {piece.title}
                  </h3>
                  
                  {piece.composer && (
                    <p className="text-sm text-gray-400 line-clamp-1">
                      {piece.composer}
                    </p>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MaterialIcon icon="library_music" size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Your repertoire is empty</h3>
          <p className="text-gray-400 mb-4 max-w-md mx-auto">
            Add pieces, technical exercises, or practice items to your repertoire. 
            You can then drag them to your weekly calendar to plan your practice sessions.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setIsAddingPiece(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
            >
              <MaterialIcon icon="add" size={20} className="mr-2 flex-shrink-0" />
              Add Your First Item
            </button>
            <div className="text-xs text-gray-500">
              💡 Tip: You can add pieces, exercises, scales, or any practice material
            </div>
          </div>
        </div>
      )}
    </div>
  );
};