import React from 'react';
import { Calendar, Clock, Palette } from 'lucide-react';
import { AppSettings } from '../App';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onClearOldData?: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onUpdateSettings,
  onClearOldData
}) => {
  const handleStartDayChange = (startDay: number) => {
    onUpdateSettings({ ...settings, startDay });
  };

  const handleWeekFormatChange = (weekFormat: '7-day' | '5-day') => {
    onUpdateSettings({ ...settings, weekFormat });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="w-6 h-6 text-gray-400" />
        <h2 className="text-2xl font-medium text-white">Settings</h2>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 divide-y divide-gray-700">
        {/* Week Start Day */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Week Start Day</h3>
          <p className="text-sm text-gray-400 mb-4">Choose which day your practice week begins</p>
          
          <div className="grid grid-cols-2 gap-3">
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
              <div className="text-sm opacity-75 mt-1">Traditional weekend start</div>
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
              <div className="text-sm opacity-75 mt-1">Work week start</div>
            </button>
          </div>
        </div>

        {/* Week Format */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">Week Format</h3>
          <p className="text-sm text-gray-400 mb-4">Choose how many days to display in your calendar</p>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleWeekFormatChange('7-day')}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.weekFormat === '7-day'
                  ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="font-medium">7-Day Week</div>
              <div className="text-sm opacity-75 mt-1">Include weekends</div>
            </button>
            
            <button
              onClick={() => handleWeekFormatChange('5-day')}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.weekFormat === '5-day'
                  ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                  : 'border-gray-600 hover:border-gray-500 text-gray-300'
              }`}
            >
              <div className="font-medium">5-Day Week</div>
              <div className="text-sm opacity-75 mt-1">Weekdays only</div>
            </button>
          </div>
          
          {settings.weekFormat === '5-day' && (
            <div className="mt-4 p-3 bg-amber-900/20 border border-amber-700 rounded-lg">
              <div className="flex items-start space-x-2">
                <Clock className="w-4 h-4 text-amber-400 mt-0.5" />
                <div className="text-sm text-amber-300">
                  <strong>Note:</strong> 5-day week format will only show weekdays (Monday-Friday) in your calendar view.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-white mb-4">About</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Planning Mate PWA</span>
            </div>
            <p>A progressive web app for organizing your weekly planning schedule. Add items to your list and drag them onto your calendar to plan your week.</p>
            
            <div className="pt-3 border-t border-gray-700">
              <h4 className="font-medium text-white mb-2">Features:</h4>
              <ul className="space-y-1 text-gray-400">
                <li>• Drag and drop scheduling</li>
                <li>• Color-coded items</li>
                <li>• Customizable week start day</li>
                <li>• Offline support (PWA)</li>
                <li>• Local data storage</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Management */}
        {onClearOldData && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
            <p className="text-sm text-gray-400 mb-4">Clear old data from previous app versions</p>
            
            <button
              onClick={onClearOldData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Clear Old Data
            </button>
            
            <p className="text-xs text-gray-500 mt-2">
              This will remove old data from the previous app version and clean up localStorage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};