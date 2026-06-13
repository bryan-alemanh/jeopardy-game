// Storage management for To-Do List

const Storage = (() => {
    const STORAGE_KEY = 'todo_list_tasks';

    return {
        /**
         * Get all tasks from localStorage
         */
        getAllTasks() {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                return stored ? JSON.parse(stored) : [];
            } catch (error) {
                console.error('Error loading tasks:', error);
                return [];
            }
        },

        /**
         * Save all tasks to localStorage
         */
        saveTasks(tasks) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
                return true;
            } catch (error) {
                console.error('Error saving tasks:', error);
                return false;
            }
        },

        /**
         * Add a new task
         */
        addTask(task) {
            const tasks = this.getAllTasks();
            tasks.push(task);
            return this.saveTasks(tasks);
        },

        /**
         * Update a task
         */
        updateTask(id, updatedTask) {
            const tasks = this.getAllTasks();
            const index = tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...updatedTask };
                return this.saveTasks(tasks);
            }
            return false;
        },

        /**
         * Delete a task
         */
        deleteTask(id) {
            const tasks = this.getAllTasks();
            const filtered = tasks.filter(t => t.id !== id);
            return this.saveTasks(filtered);
        },

        /**
         * Clear all tasks
         */
        clearAll() {
            return this.saveTasks([]);
        },

        /**
         * Clear completed tasks
         */
        clearCompleted() {
            const tasks = this.getAllTasks();
            const filtered = tasks.filter(t => !t.completed);
            return this.saveTasks(filtered);
        },

        /**
         * Export tasks as JSON
         */
        exportTasks() {
            const tasks = this.getAllTasks();
            return JSON.stringify(tasks, null, 2);
        },

        /**
         * Export tasks as CSV
         */
        exportTasksAsCSV() {
            const tasks = this.getAllTasks();
            let csv = 'ID,Task,Priority,Completed,Created Date\n';
            
            tasks.forEach(task => {
                const text = `"${task.text.replace(/"/g, '""')}"`;
                csv += `${task.id},${text},${task.priority},${task.completed},${task.createdDate}\n`;
            });
            
            return csv;
        },

        /**
         * Import tasks from JSON
         */
        importTasks(jsonString) {
            try {
                const importedTasks = JSON.parse(jsonString);
                if (!Array.isArray(importedTasks)) {
                    throw new Error('Invalid format: must be an array of tasks');
                }
                return this.saveTasks(importedTasks);
            } catch (error) {
                console.error('Error importing tasks:', error);
                return false;
            }
        }
    };
})();
