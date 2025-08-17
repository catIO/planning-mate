import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Music2 } from 'lucide-react';
import { MusicalPiece } from '../App';

interface PieceManagerProps {
  pieces: MusicalPiece[];
  onAddPiece: (piece: MusicalPiece) => void;
  onDeletePiece: (pieceId: string) => void;
  onUpdatePiece: (pieceId: string, updatedPiece: Partial<MusicalPiece>) => void;
}

const PIECE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', 
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e'
];

export const PieceManager: React.FC<PieceManagerProps> = ({
  pieces,
  onAddPiece,
  onDeletePiece,
  onUpdatePiece
}) => {
  console.log('PieceManager received pieces:', pieces);
  console.log('PieceManager pieces length:', pieces.length);
  
  const [isAddingPiece, setIsAddingPiece] = useState(false);
  const [editingPieceId, setEditingPieceId] = useState<string | null>(null);
  const [newPieceTitle, setNewPieceTitle] = useState('');
  const [newPieceComposer, setNewPieceComposer] = useState('');
  const [selectedColor, setSelectedColor] = useState(PIECE_COLORS[0]);
  const [editTitle, setEditTitle] = useState('');
  const [editComposer, setEditComposer] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAddPiece = () => {
    if (newPieceTitle.trim()) {
      const newPiece: MusicalPiece = {
        id: Date.now().toString(),
        title: newPieceTitle.trim(),
        color: selectedColor,
        composer: newPieceComposer.trim() || undefined
      };
      
      onAddPiece(newPiece);
      setNewPieceTitle('');
      setNewPieceComposer('');
      setSelectedColor(PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)]);
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
        <h2 className="text-2xl font-medium text-white">Your Items</h2>
        <button
          onClick={() => setIsAddingPiece(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 hover:shadow-xl"
        >
          <Plus className="w-6 h-6" />
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
                    onClick={() => setSelectedColor(color)}
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
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePiece(piece.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <Music2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No items added yet</h3>
          <p className="text-gray-400 mb-6">Start by adding your first item to practice</p>
          <button
            onClick={() => setIsAddingPiece(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Item
          </button>
        </div>
      )}
    </div>
  );
};