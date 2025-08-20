import React, { useState, useEffect } from 'react';
import { MaterialIcon } from './components/MaterialIcon';
import { PieceManager } from './components/PieceManager';
import { WeeklyCalendar } from './components/WeeklyCalendar';
import { SettingsPanel } from './components/SettingsPanel';

export interface MusicalPiece {
  id: string;
  title: string;
  color: string;
  composer?: string;
}

export interface DaySchedule {
  [dayIndex: number]: MusicalPiece[];
}

export interface AppSettings {
  startDay: number; // 0 = Sunday, 1 = Monday, 2 = Tuesday, etc., -1 = Current Day
  weekFormat: '7-day' | '5-day';
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">The app encountered an error. Please refresh the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [pieces, setPieces] = useState<MusicalPiece[]>([]);
  const [schedule, setSchedule] = useState<DaySchedule>({});
  const [settings, setSettings] = useState<AppSettings>({
    startDay: 1, // Monday
    weekFormat: '7-day'
  });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPieceManagerOpen, setIsPieceManagerOpen] = useState(false);
  const [openPieceManagerWithAddForm, setOpenPieceManagerWithAddForm] = useState(false);

  // Test localStorage on component mount
  useEffect(() => {
    console.log('=== localStorage TEST ===');
    console.log('localStorage available:', typeof localStorage !== 'undefined');
    console.log('localStorage keys:', Object.keys(localStorage));
    
    // Test writing and reading
    try {
      const testKey = 'planningMate_test';
      const testValue = { test: 'data', timestamp: Date.now() };
      localStorage.setItem(testKey, JSON.stringify(testValue));
      const retrieved = localStorage.getItem(testKey);
      const parsed = JSON.parse(retrieved || '{}');
      console.log('localStorage write/read test:', parsed.test === 'data' ? 'PASSED' : 'FAILED');
      localStorage.removeItem(testKey);
    } catch (error) {
      console.error('localStorage test FAILED:', error);
    }
    console.log('=== END TEST ===');
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      console.log('Loading data from localStorage...');
      console.log('All localStorage keys:', Object.keys(localStorage));
      
      // Check if localStorage is available
      const isLocalStorageAvailable = () => {
        try {
          const test = '__localStorage_test__';
          localStorage.setItem(test, test);
          localStorage.removeItem(test);
          return true;
        } catch (e) {
          console.error('localStorage is not available:', e);
          return false;
        }
      };

      if (!isLocalStorageAvailable()) {
        console.error('localStorage is blocked by browser settings. Please check Brave privacy settings.');
        alert('localStorage is blocked! Please:\n1. Click the Brave shield icon\n2. Toggle "Shields down" for this site\n3. Refresh the page');
        return;
      }

      const savedPieces = localStorage.getItem('planningMate_pieces');
      const savedSchedule = localStorage.getItem('planningMate_schedule');
      const savedSettings = localStorage.getItem('planningMate_settings');

      console.log('planningMate_pieces found:', !!savedPieces, 'Content:', savedPieces);
      console.log('planningMate_schedule found:', !!savedSchedule, 'Content:', savedSchedule);
      console.log('planningMate_settings found:', !!savedSettings, 'Content:', savedSettings);

      // Check for old keys too
      const oldPieces = localStorage.getItem('practiceScheduler_pieces');
      const oldSchedule = localStorage.getItem('practiceScheduler_schedule');
      const oldSettings = localStorage.getItem('practiceScheduler_settings');

      console.log('Old practiceScheduler_pieces found:', !!oldPieces, 'Content:', oldPieces);
      console.log('Old practiceScheduler_schedule found:', !!oldSchedule, 'Content:', oldSchedule);
      console.log('Old practiceScheduler_settings found:', !!oldSettings, 'Content:', oldSettings);

      if (savedPieces) {
        const parsedPieces = JSON.parse(savedPieces);
        console.log('Loaded pieces:', parsedPieces);
        console.log('Setting pieces state to:', parsedPieces);
        setPieces(parsedPieces);
        console.log('Pieces state should now be:', parsedPieces);
      } else if (oldPieces) {
        // Migrate old data
        console.log('Migrating old pieces data...');
        const parsedOldPieces = JSON.parse(oldPieces);
        console.log('Migrated pieces:', parsedOldPieces);
        setPieces(parsedOldPieces);
        localStorage.setItem('planningMate_pieces', oldPieces);
        // Clean up old data
        localStorage.removeItem('practiceScheduler_pieces');
      } else {
        console.log('No pieces data found in localStorage');
      }
      
      if (savedSchedule) {
        const parsedSchedule = JSON.parse(savedSchedule);
        console.log('Loaded schedule:', parsedSchedule);
        setSchedule(parsedSchedule);
      } else if (oldSchedule) {
        // Migrate old data
        console.log('Migrating old schedule data...');
        const parsedOldSchedule = JSON.parse(oldSchedule);
        setSchedule(parsedOldSchedule);
        localStorage.setItem('planningMate_schedule', oldSchedule);
        // Clean up old data
        localStorage.removeItem('practiceScheduler_schedule');
      }
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('Loaded settings:', parsedSettings);
        setSettings(parsedSettings);
      } else if (oldSettings) {
        // Migrate old data
        console.log('Migrating old settings data...');
        const parsedOldSettings = JSON.parse(oldSettings);
        setSettings(parsedOldSettings);
        localStorage.setItem('planningMate_settings', oldSettings);
        // Clean up old data
        localStorage.removeItem('practiceScheduler_settings');
      }
      
      // Mark initial load as complete
      setIsInitialLoad(false);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      alert('Error loading data: ' + (error instanceof Error ? error.message : String(error)));
      setIsInitialLoad(false);
    }
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (!isInitialLoad) {
      try {
        console.log('Saving pieces to localStorage:', pieces.length, 'items');
        localStorage.setItem('planningMate_pieces', JSON.stringify(pieces));
      } catch (error) {
        console.error('Failed to save pieces to localStorage:', error);
        alert('Failed to save data! Please check Brave privacy settings.');
      }
    }
  }, [pieces, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        console.log('Saving schedule to localStorage:', Object.keys(schedule).length, 'days');
        localStorage.setItem('planningMate_schedule', JSON.stringify(schedule));
      } catch (error) {
        console.error('Failed to save schedule to localStorage:', error);
        alert('Failed to save data! Please check Brave privacy settings.');
      }
    }
  }, [schedule, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) {
      try {
        console.log('Saving settings to localStorage:', settings);
        localStorage.setItem('planningMate_settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
        alert('Failed to save data! Please check Brave privacy settings.');
      }
    }
  }, [settings, isInitialLoad]);

  useEffect(() => {
    console.log('Current pieces state:', pieces);
  }, [pieces]);

  useEffect(() => {
    console.log('Current schedule state:', schedule);
  }, [schedule]);

  const addPiece = (piece: MusicalPiece) => {
    setPieces(prev => [...prev, piece]);
  };

  const deletePiece = (pieceId: string) => {
    setPieces(prev => prev.filter(p => p.id !== pieceId));
    // Remove from schedule as well
    setSchedule(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[parseInt(day)] = updated[parseInt(day)].filter(p => p.id !== pieceId);
      });
      return updated;
    });
  };

  const updatePiece = (pieceId: string, updatedPiece: Partial<MusicalPiece>) => {
    setPieces(prev => prev.map(p => 
      p.id === pieceId ? { ...p, ...updatedPiece } : p
    ));
    // Update in schedule as well
    setSchedule(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        updated[parseInt(day)] = updated[parseInt(day)].map(p => 
          p.id === pieceId ? { ...p, ...updatedPiece } : p
        );
      });
      return updated;
    });
  };

  const addPieceToDay = (dayIndex: number, piece: MusicalPiece) => {
    setSchedule(prev => ({
      ...prev,
      [dayIndex]: [...(prev[dayIndex] || []), piece]
    }));
  };

  const removePieceFromDay = (dayIndex: number, pieceId: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayIndex]: (prev[dayIndex] || []).filter(p => p.id !== pieceId)
    }));
  };

  const movePiece = (fromDay: number, toDay: number, piece: MusicalPiece) => {
    setSchedule(prev => {
      const updated = { ...prev };
      // Remove from source day
      updated[fromDay] = (updated[fromDay] || []).filter(p => p.id !== piece.id);
      // Add to target day
      updated[toDay] = [...(updated[toDay] || []), piece];
      return updated;
    });
  };

  const clearOldData = () => {
    // Clear old practiceScheduler data
    localStorage.removeItem('practiceScheduler_pieces');
    localStorage.removeItem('practiceScheduler_schedule');
    localStorage.removeItem('practiceScheduler_settings');
    
    // Clear other unrelated data
    localStorage.removeItem('theme');
    localStorage.removeItem('customSubdivisions');
    localStorage.removeItem('savedSettings');
    localStorage.removeItem('images');
    localStorage.removeItem('timerDebugInfo');
    localStorage.removeItem('soundPattern');
    localStorage.removeItem('soundSettings');
    localStorage.removeItem('pendingSessions');
    localStorage.removeItem('timer-settings');
    localStorage.removeItem('beatsPerMeasure');
    localStorage.removeItem('practice-timer-settings');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('subdivision');
    localStorage.removeItem('bpm');
    
    console.log('Cleared old data. Remaining keys:', Object.keys(localStorage));
    alert('Old data cleared! Please refresh the page.');
  };

  const handleImportData = (data: { pieces: any[]; schedule: any; settings: AppSettings }) => {
    setPieces(data.pieces);
    setSchedule(data.schedule);
    setSettings(data.settings);
    alert('Data imported successfully!');
  };

  // Manual data loading function for debugging
  const manualLoadData = () => {
    console.log('=== MANUAL DATA LOAD ===');
    const savedPieces = localStorage.getItem('planningMate_pieces');
    const savedSchedule = localStorage.getItem('planningMate_schedule');
    
    console.log('Raw savedPieces:', savedPieces);
    console.log('Raw savedSchedule:', savedSchedule);
    
    if (savedPieces) {
      try {
        const parsedPieces = JSON.parse(savedPieces);
        console.log('Parsed pieces:', parsedPieces);
        setPieces(parsedPieces);
        console.log('Pieces state set to:', parsedPieces);
      } catch (error) {
        console.error('Error parsing pieces:', error);
      }
    }
    
    if (savedSchedule) {
      try {
        const parsedSchedule = JSON.parse(savedSchedule);
        console.log('Parsed schedule:', parsedSchedule);
        setSchedule(parsedSchedule);
        console.log('Schedule state set to:', parsedSchedule);
      } catch (error) {
        console.error('Error parsing schedule:', error);
      }
    }
    console.log('=== END MANUAL LOAD ===');
  };

  // Expose manual load function to window for console access
  useEffect(() => {
    (window as any).manualLoadData = manualLoadData;
    (window as any).checkLocalStorage = () => {
      console.log('=== CHECKING LOCALSTORAGE ===');
      console.log('All keys:', Object.keys(localStorage));
      console.log('planningMate_pieces:', localStorage.getItem('planningMate_pieces'));
      console.log('planningMate_schedule:', localStorage.getItem('planningMate_schedule'));
      console.log('planningMate_settings:', localStorage.getItem('planningMate_settings'));
      console.log('=== END CHECK ===');
    };
    (window as any).addTestData = () => {
      console.log('=== ADDING TEST DATA ===');
      const testPiece = {
        id: Date.now().toString(),
        title: 'Test Item',
        color: '#3b82f6',
        composer: 'Test Composer'
      };
      setPieces([testPiece]);
      console.log('Added test piece:', testPiece);
      console.log('=== END TEST DATA ===');
    };
    console.log('Debug functions available:');
    console.log('- window.manualLoadData()');
    console.log('- window.checkLocalStorage()');
    console.log('- window.addTestData()');
  }, []);



  return (
    <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black font-['Roboto']">
        {/* Settings and Repertoire Buttons */}
        <div className="fixed top-4 right-4 z-40 flex space-x-2">
          <div className="relative group">
            <button
              onClick={() => setIsPieceManagerOpen(true)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-300 p-3 rounded-lg shadow-lg transition-all duration-200 border border-gray-700 flex items-center justify-center"
            >
              <MaterialIcon icon="library_music" size={20} />
            </button>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Manage Repertoire
            </div>
          </div>
          <div className="relative group">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white p-3 rounded-lg shadow-lg transition-all duration-200 border border-gray-700 flex items-center justify-center"
            >
              <MaterialIcon icon="settings" size={20} />
            </button>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Settings
            </div>
          </div>
        </div>



        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6 pt-6">
          <WeeklyCalendar
            pieces={pieces}
            schedule={schedule}
            settings={settings}
            onAddPieceToDay={addPieceToDay}
            onRemovePieceFromDay={removePieceFromDay}
            onMovePiece={movePiece}
            onUpdateSchedule={(dayIndex, items) => {
              setSchedule(prev => ({
                ...prev,
                [dayIndex]: items
              }));
            }}
            onOpenPieceManager={() => setIsPieceManagerOpen(true)}
            onOpenPieceManagerWithAddForm={() => {
              setOpenPieceManagerWithAddForm(true);
              setIsPieceManagerOpen(true);
            }}
          />
        </main>

        {/* Settings Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-xl font-medium text-white">Settings</h2>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MaterialIcon icon="close" size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <SettingsPanel
                  settings={settings}
                  onUpdateSettings={setSettings}
                  onClearOldData={clearOldData}
                  pieces={pieces}
                  schedule={schedule}
                  onImportData={handleImportData}
                />
              </div>
            </div>
          </div>
        )}

        {/* Piece Manager Modal */}
        {isPieceManagerOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setIsPieceManagerOpen(false);
              setOpenPieceManagerWithAddForm(false);
            }}
          >
            <div 
              className="bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                  <MaterialIcon icon="library_music" size={24} className="text-blue-400" />
                  <h2 className="text-xl font-medium text-white">Manage Repertoire</h2>
                </div>
                <button
                  onClick={() => {
                    setIsPieceManagerOpen(false);
                    setOpenPieceManagerWithAddForm(false);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <MaterialIcon icon="close" size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[80vh]">
                <PieceManager 
                  pieces={pieces} 
                  onAddPiece={addPiece} 
                  onDeletePiece={deletePiece}
                  onUpdatePiece={updatePiece}
                  openWithAddForm={openPieceManagerWithAddForm}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;