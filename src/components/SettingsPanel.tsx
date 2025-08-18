import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';
import { AppSettings } from '../App';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onClearOldData?: () => void;
  pieces: any[];
  schedule: any;
  onImportData?: (data: { pieces: any[]; schedule: any; settings: AppSettings }) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClearOldData,
  pieces,
  schedule,
  onImportData
}) => {
  const [showCopyData, setShowCopyData] = useState(false);
  const [copyDataText, setCopyDataText] = useState<string>('');
  const [importError, setImportError] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<boolean>(false);



  const generateCopyData = () => {
    const data = {
      pieces,
      schedule,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(data, null, 2);
    setCopyDataText(jsonString);
    setShowCopyData(true);
    setCopySuccess(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(copyDataText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate the imported data
        if (data.pieces && data.schedule && data.settings) {
          // Update the app data
          if (onImportData) {
            onImportData(data);
            setImportError('');
          }
        } else {
          setImportError('Invalid file format. Please select a valid Planning Mate backup file.');
        }
      } catch (error) {
        setImportError('Error reading file. Please try again.');
      }
    };
    reader.readAsText(file);
  };

  const handlePasteImport = () => {
    navigator.clipboard.readText().then(text => {
      try {
        const data = JSON.parse(text);
        
        // Validate the imported data
        if (data.pieces && data.schedule && data.settings) {
          // Update the app data
          if (onImportData) {
            onImportData(data);
            setImportError('');
          }
        } else {
          setImportError('Invalid data format. Please paste valid Planning Mate data.');
        }
      } catch (error) {
        setImportError('Error parsing pasted data. Please try again.');
      }
    }).catch(error => {
      setImportError('Error reading clipboard. Please try again.');
    });
  };
  const handleStartDayChange = (startDay: number) => {
    onUpdateSettings({ ...settings, startDay });
  };

  return (
    <div className="space-y-6">

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 divide-y divide-gray-700">
        {/* Week Start Day */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Week Start Day</h3>
          <p className="text-sm text-gray-400 mb-4">Choose which day your practice week begins</p>
          
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleStartDayChange(0)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.startDay === 0
                  ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="font-medium">Sunday</div>
              </div>
            </button>
            
            <button
              onClick={() => handleStartDayChange(1)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.startDay === 1
                  ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="font-medium">Monday</div>
              </div>
            </button>

            <button
              onClick={() => handleStartDayChange(-1)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.startDay === -1
                  ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="font-medium">Current Day ({['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]})</div>
              </div>
            </button>
          </div>
        </div>



        {/* App Info */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">About</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <MaterialIcon icon="palette" size={16} />
              <span>Planning Mate PWA</span>
            </div>
            <p>This progressive web app lets you organize your weekly practice plan. Add items to your list and drag them onto your calendar to plan your week.</p>

          </div>
        </div>

        {/* Data Management */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
          <p className="text-sm text-gray-400 mb-4">Export and import your data across devices</p>
          
          <div className="space-y-4">

            {/* Copy Data Export */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Copy Data Between Browsers</h4>
              <button
                onClick={generateCopyData}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center space-x-2"
              >
                <MaterialIcon icon="content_copy" size={16} />
                <span>Generate Copy Data</span>
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Generate text data that you can copy and paste between browsers.
              </p>
            </div>

            {/* Copy Data Display */}
            {showCopyData && copyDataText && (
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-white">Copy this data</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1"
                    >
                      <MaterialIcon icon="content_copy" size={12} />
                      <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => setShowCopyData(false)}
                      className="text-gray-400 hover:text-gray-200"
                    >
                      <MaterialIcon icon="close" size={16} />
                    </button>
                  </div>
                </div>
                <textarea
                  value={copyDataText}
                  readOnly
                  className="w-full h-32 bg-gray-800 text-gray-300 text-xs p-2 rounded border border-gray-600 font-mono resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Copy this text and paste it in another browser's import section.
                </p>
              </div>
            )}

            {/* Paste Data Import */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Import Data</h4>
              <div className="flex space-x-2">
                <button
                  onClick={handlePasteImport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
                >
                  <MaterialIcon icon="content_paste" size={16} />
                  <span>Import from Clipboard</span>
                </button>
                <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2 cursor-pointer">
                  <MaterialIcon icon="upload_file" size={16} />
                  <span>Import from File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Import data from clipboard or a previously exported JSON file.
              </p>
            </div>

            {/* Import Error */}
            {importError && (
              <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
                <p className="text-sm text-red-300">{importError}</p>
              </div>
            )}

            {/* Clear Old Data */}
            {onClearOldData && (
              <div className="pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-white mb-2">Clear Old Data</h4>
                <button
                  onClick={onClearOldData}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Clear Old Data
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Remove old data from previous app versions and clean up localStorage.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};