// Task management

const Task = (() => {
    /**
     * Generate unique ID
     */
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Format date
     */
    function formatDate(date) {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    return {
        /**
         * Create a new task
         */
        create(text, priority = 'medium') {
            if (!text || !text.trim()) {
                throw new Error('Task text cannot be empty');
            }

            return {
                id: generateId(),
                text: text.trim(),
                priority: priority,
                completed: false,
                createdDate: new Date().toISOString()
            };
        },

        /**
         * Update task text
         */
        updateText(task, newText) {
            if (!newText || !newText.trim()) {
                throw new Error('Task text cannot be empty');
            }
            return { ...task, text: newText.trim() };
        },

        /**
         * Update task priority
         */
        updatePriority(task, priority) {
            return { ...task, priority };
        },

        /**
         * Toggle task completion
         */
        toggleCompletion(task) {
            return { ...task, completed: !task.completed };
        },

        /**
         * Format date for display
         */
        formatDate(dateString) {
            return formatDate(dateString);
        },

        /**
         * Get time ago string
         */
        getTimeAgo(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const seconds = Math.floor((now - date) / 1000);

            if (seconds < 60) return 'Just now';
            const minutes = Math.floor(seconds / 60);
            if (minutes < 60) return `${minutes}m ago`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}h ago`;
            const days = Math.floor(hours / 24);
            return `${days}d ago`;
        }
    };
})();
