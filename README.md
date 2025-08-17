# Planning Mate

A modern, responsive web application for organizing and scheduling your tasks and activities. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📅 **Weekly Schedule View** - Organize items across the 7 days of the week
- 🏷️ **Item Management** - Create, edit, and organize your items with custom colors
- 🎯 **Drag & Drop** - Easily schedule items by dragging them to specific days
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 💾 **Local Storage** - Your data persists across browser sessions
- 🌙 **Dark Theme** - Modern dark interface for comfortable use
- 🔍 **Day Modal** - Click any day to see a detailed view of scheduled items

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd planning-mate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Add Items**: Go to the "Items" tab to create new items with titles, descriptions, and custom colors
2. **Schedule Items**: Drag items from the "Available Items" section to any day in the calendar
3. **View Details**: Click on any day to open a modal with a detailed view of scheduled items
4. **Manage Schedule**: Remove items from days or move them between days using drag and drop
5. **Data Persistence**: Your items and schedule are automatically saved to your browser's local storage

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Data Persistence**: Browser localStorage

## Project Structure

```
planning-mate/
├── public/                 # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
├── src/
│   ├── components/        # React components
│   │   ├── PieceManager.tsx
│   │   ├── SettingsPanel.tsx
│   │   └── WeeklyCalendar.tsx
│   ├── App.tsx           # Main application component
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Browser Support

Planning Mate works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- localStorage API

## Privacy

Planning Mate stores all data locally in your browser using localStorage. No data is sent to external servers or services.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
