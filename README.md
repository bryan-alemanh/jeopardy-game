# Jeopardy Game

A fully functional, offline-capable Jeopardy game built with HTML, CSS, and JavaScript. Store your game data in a local CSV database.

## Features

✅ **Offline Gameplay** - Play without internet connection
✅ **CSV Database** - Import and export questions using CSV files
✅ **Custom Categories** - Add, edit, and delete custom categories and questions
✅ **Score Tracking** - Keep track of your score throughout the game
✅ **Responsive Design** - Works on desktop and mobile devices
✅ **Local Storage** - Game data persists in browser's local storage
✅ **Easy Management** - User-friendly interface for managing questions

## Quick Start

1. Open `index.html` in your web browser
2. Click "New Game" to start playing
3. Click on any question tile to answer
4. Reveal the answer and select if it was correct or incorrect
5. Your score updates automatically

## Managing Questions

### Add New Category
1. Click "Edit Questions"
2. Click "Add Category"
3. Enter the category name
4. Edit the questions and answers

### Import CSV
1. Click "Import CSV"
2. Select your CSV file with the proper format (see below)
3. Click "Upload CSV"

### Export CSV
1. Click "Edit Questions"
2. Click "Export CSV"
3. Your questions will be downloaded as a CSV file

## CSV Format

The CSV format should follow this structure:

```
Category Name,100,200,300,400,500
Category Name,Question 1,Question 2,Question 3,Question 4,Question 5
Category Name,Answer 1,Answer 2,Answer 3,Answer 4,Answer 5
```

### Example:
```
Literature,100,200,300,400,500
Literature,Author of Pride and Prejudice,Author of Great Gatsby,Author of To Kill a Mockingbird,Author of 1984,Author of Harry Potter
Literature,Jane Austen,F. Scott Fitzgerald,Harper Lee,George Orwell,J.K. Rowling
```

## File Structure

- `index.html` - Main HTML file
- `styles.css` - Styling and layout
- `utils.js` - Utility functions (CSV parsing, file operations, etc.)
- `database.js` - Data management and local storage
- `game.js` - Game logic and state management
- `app.js` - Application controller and UI management
- `sample-data.csv` - Sample CSV file for import testing

## How It Works

### Data Flow

1. **Database** (`database.js`) - Manages all data, stores in browser's localStorage
2. **Game** (`game.js`) - Handles game state, scoring, and question selection
3. **App** (`app.js`) - Controls UI and user interactions
4. **Utils** (`utils.js`) - Provides helper functions

### Local Storage

All game data is stored in the browser's localStorage under the key `jeopardy_game_data`. This means:
- Your data persists even after closing the browser
- No server or internet connection needed
- Data is stored locally on your device

## Keyboard Shortcuts (Coming Soon)

- `ESC` - Close modal
- `R` - Reveal answer
- `C` - Mark correct
- `I` - Mark incorrect

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Tips for Adding Questions

1. Keep questions concise but clear
2. Format answers in "What is...?" response format for authenticity
3. Ensure answer values match the monetary amounts (100, 200, 300, 400, 500)
4. You can use any values you want, not just the standard amounts
5. Special characters in CSV should be enclosed in quotes

## Customization

### Change Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1f3a93;      /* Main blue */
    --secondary-color: #ffd700;    /* Gold */
    --dark-bg: #000080;            /* Dark blue */
    /* ... more colors ... */
}
```

### Change Default Values
Edit the `DEFAULT_DATA` in `database.js` to set different question values or categories.

## License

Free to use and modify.

## Troubleshooting

### CSV Won't Import
- Ensure the CSV format matches the specification
- Check that special characters are properly escaped
- Try the sample-data.csv file first to verify the format

### Data Not Saving
- Check if localStorage is enabled in your browser
- Try clearing browser cache and refreshing
- Ensure you have enough storage space

### Questions Not Showing
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check the browser console for errors
- Verify the CSV import was successful

## Future Enhancements

- [ ] Multiple players support
- [ ] Timer for questions
- [ ] Question categories search
- [ ] Statistics and analytics
- [ ] Keyboard shortcuts
- [ ] Sound effects
- [ ] Different difficulty levels
- [ ] Team mode
