# To-Do List Application

A fully-featured to-do list application with local storage functionality. Organize, manage, and track your tasks with ease.

## Features

✅ **Task Management**
- Add, edit, and delete tasks
- Mark tasks as complete/incomplete
- Set priority levels (Low, Medium, High)
- View task creation time (relative time display)

✅ **Filtering & Sorting**
- Filter by: All, Active, Completed, High Priority
- Real-time task statistics
- Color-coded priority indicators

✅ **Local Storage**
- All tasks persist in browser's localStorage
- No internet connection required
- Data survives browser restarts

✅ **Import/Export**
- Export tasks as JSON file
- Backup your tasks
- Download with timestamp

✅ **User Interface**
- Clean, modern design
- Responsive on all devices
- Smooth animations and transitions
- Toast notifications for feedback
- Modal dialogs for confirmations

✅ **Accessibility**
- Keyboard support (Enter to add task)
- ARIA labels for screen readers
- Font Awesome icons
- High contrast colors

## Quick Start

1. **Open the app**: Simply open `index.html` in your web browser
2. **Add a task**: Type in the input field, select priority, and click "Add Task" or press Enter
3. **Manage tasks**: 
   - Check the checkbox to mark complete
   - Click edit icon to modify
   - Click delete icon to remove
4. **Filter tasks**: Use filter buttons to view specific task types
5. **Export tasks**: Click "Export" to download your tasks as JSON

## Usage Guide

### Adding Tasks
- Enter task description
- Select priority level (Low, Medium, High)
- Click "Add Task" or press Enter

### Editing Tasks
- Click the edit (pencil) icon on any task
- Modify the task text and priority
- Click "Save Changes" to update

### Filtering
- **All**: View all tasks
- **Active**: View incomplete tasks
- **Completed**: View finished tasks
- **High Priority**: View only high-priority items

### Clearing Tasks
- **Clear Completed**: Remove all finished tasks
- **Clear All**: Delete all tasks (with confirmation)

### Exporting
- Click "Export" to download tasks as JSON
- File includes all task details
- Timestamped filename for easy organization

## File Structure

```
.
├── index.html       # Main HTML file
├── styles.css       # Styling and layout
├── storage.js       # Local storage management
├── task.js         # Task utilities and helpers
├── ui.js           # UI rendering and event handling
├── app.js          # Application initialization
└── README.md       # This file
```

## How It Works

### Architecture

1. **Storage Layer** (`storage.js`)
   - Manages localStorage operations
   - Save, load, and export tasks
   - Handles data persistence

2. **Task Logic** (`task.js`)
   - Task creation and manipulation
   - Date formatting utilities
   - Task validation

3. **UI Layer** (`ui.js`)
   - Renders task elements
   - Handles user interactions
   - Shows notifications and modals
   - Manages filters and sorting

4. **Application** (`app.js`)
   - Initializes the application
   - Coordinates between modules

### Data Structure

Each task is stored as:
```javascript
{
  id: "unique-timestamp-based-id",
  text: "Task description",
  priority: "low|medium|high",
  completed: false,
  createdDate: "2024-01-15T10:30:00.000Z"
}
```

## Local Storage Details

- **Storage Key**: `todo_list_tasks`
- **Format**: JSON array of task objects
- **Limit**: ~5-10 MB per domain (varies by browser)
- **Persistence**: Survives browser restarts and crashes

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Add new task (when input focused) |
| Escape | Close modals |

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --danger-color: #ef4444;
    --success-color: #10b981;
    /* ... more variables ... */
}
```

### Add New Priority Levels
1. Update priority select options in `index.html`
2. Add CSS styling in `styles.css`
3. Update badge styling for new priority

### Change Storage Key
Update `STORAGE_KEY` in `storage.js` to use a different localStorage key

## Tips & Tricks

1. **Organize by Priority**: Use High Priority filter to focus on important tasks
2. **Quick Add**: Press Enter instead of clicking Add Task
3. **Batch Cleanup**: Use Clear Completed to remove done tasks
4. **Backup**: Export tasks regularly to have a backup
5. **Multiple Lists**: Create separate instances with different storage keys

## Limitations

- LocalStorage limited to ~5-10 MB
- No cloud synchronization
- No password protection
- No recurring tasks (yet)
- No task categories (coming soon)

## Future Enhancements

- [ ] Task categories/tags
- [ ] Recurring tasks
- [ ] Due dates and reminders
- [ ] Multiple lists/projects
- [ ] Cloud sync via service
- [ ] Drag and drop reordering
- [ ] Task subtasks
- [ ] Dark mode
- [ ] Search functionality
- [ ] Import from JSON

## Troubleshooting

### Tasks not saving
- Check if localStorage is enabled in browser
- Ensure enough storage space available
- Clear browser cache and try again
- Check browser console for errors

### Tasks disappeared
- Check if you cleared browser data
- Try opening in private/incognito mode
- Verify localStorage is not disabled
- Check storage quota with DevTools

### Export not working
- Disable browser ad blockers
- Check if pop-ups are blocked
- Try different browser
- Check browser console for errors

## Performance

- Efficient re-rendering
- Minimal DOM operations
- Fast localStorage operations
- Smooth animations
- Responsive on all devices

## License

Free to use and modify for personal and commercial projects.

## Support

For issues or suggestions, open an issue or submit a pull request.
