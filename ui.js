// UI management

const UI = (() => {
    let currentFilter = 'all';
    let tasks = [];
    let editingTaskId = null;

    const elements = {
        taskInput: document.getElementById('taskInput'),
        prioritySelect: document.getElementById('prioritySelect'),
        addBtn: document.getElementById('addBtn'),
        tasksList: document.getElementById('tasksList'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        clearCompletedBtn: document.getElementById('clearCompletedBtn'),
        clearAllBtn: document.getElementById('clearAllBtn'),
        exportBtn: document.getElementById('exportBtn'),
        totalCount: document.getElementById('totalCount'),
        completedCount: document.getElementById('completedCount'),
        editModal: document.getElementById('editModal'),
        closeEditModal: document.getElementById('closeEditModal'),
        editTaskInput: document.getElementById('editTaskInput'),
        editPrioritySelect: document.getElementById('editPrioritySelect'),
        saveEditBtn: document.getElementById('saveEditBtn'),
        cancelEditBtn: document.getElementById('cancelEditBtn'),
        confirmModal: document.getElementById('confirmModal'),
        closeConfirmModal: document.getElementById('closeConfirmModal'),
        confirmTitle: document.getElementById('confirmTitle'),
        confirmMessage: document.getElementById('confirmMessage'),
        confirmActionBtn: document.getElementById('confirmActionBtn'),
        confirmCancelBtn: document.getElementById('confirmCancelBtn'),
        toast: document.getElementById('toast')
    };

    let confirmAction = null;

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        elements.addBtn.addEventListener('click', handleAddTask);
        elements.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAddTask();
        });

        elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', handleFilter);
        });

        elements.clearCompletedBtn.addEventListener('click', handleClearCompleted);
        elements.clearAllBtn.addEventListener('click', handleClearAll);
        elements.exportBtn.addEventListener('click', handleExport);

        elements.closeEditModal.addEventListener('click', closeEditModal);
        elements.cancelEditBtn.addEventListener('click', closeEditModal);
        elements.saveEditBtn.addEventListener('click', handleSaveEdit);

        elements.closeConfirmModal.addEventListener('click', closeConfirmModal);
        elements.confirmCancelBtn.addEventListener('click', closeConfirmModal);
        elements.confirmActionBtn.addEventListener('click', () => {
            if (confirmAction) confirmAction();
            closeConfirmModal();
        });

        // Close modals on outside click
        window.addEventListener('click', (e) => {
            if (e.target === elements.editModal) closeEditModal();
            if (e.target === elements.confirmModal) closeConfirmModal();
        });
    }

    /**
     * Handle add task
     */
    function handleAddTask() {
        const text = elements.taskInput.value;
        const priority = elements.prioritySelect.value;

        if (!text.trim()) {
            showToast('Please enter a task', 'error');
            return;
        }

        try {
            const newTask = Task.create(text, priority);
            Storage.addTask(newTask);
            elements.taskInput.value = '';
            elements.prioritySelect.value = 'medium';
            showToast('Task added successfully!', 'success');
            renderTasks();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    /**
     * Handle filter change
     */
    function handleFilter(e) {
        const filter = e.currentTarget.dataset.filter;
        currentFilter = filter;

        elements.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        renderTasks();
    }

    /**
     * Handle clear completed
     */
    function handleClearCompleted() {
        const completedCount = tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            showToast('No completed tasks to clear', 'warning');
            return;
        }

        showConfirmation(
            'Clear Completed Tasks',
            `Remove ${completedCount} completed task(s)?`,
            () => {
                Storage.clearCompleted();
                renderTasks();
                showToast('Completed tasks cleared!', 'success');
            }
        );
    }

    /**
     * Handle clear all
     */
    function handleClearAll() {
        if (tasks.length === 0) {
            showToast('No tasks to clear', 'warning');
            return;
        }

        showConfirmation(
            'Clear All Tasks',
            `Remove all ${tasks.length} task(s)? This cannot be undone.`,
            () => {
                Storage.clearAll();
                renderTasks();
                showToast('All tasks cleared!', 'success');
            }
        );
    }

    /**
     * Handle export
     */
    function handleExport() {
        if (tasks.length === 0) {
            showToast('No tasks to export', 'warning');
            return;
        }

        const json = Storage.exportTasks();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        showToast('Tasks exported successfully!', 'success');
    }

    /**
     * Handle task checkbox
     */
    function handleToggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const updated = Task.toggleCompletion(task);
            Storage.updateTask(id, updated);
            renderTasks();
        }
    }

    /**
     * Handle edit task
     */
    function handleEditTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            editingTaskId = id;
            elements.editTaskInput.value = task.text;
            elements.editPrioritySelect.value = task.priority;
            openEditModal();
        }
    }

    /**
     * Handle save edit
     */
    function handleSaveEdit() {
        const text = elements.editTaskInput.value;
        const priority = elements.editPrioritySelect.value;

        if (!text.trim()) {
            showToast('Task text cannot be empty', 'error');
            return;
        }

        Storage.updateTask(editingTaskId, {
            text: text.trim(),
            priority: priority
        });
        renderTasks();
        closeEditModal();
        showToast('Task updated successfully!', 'success');
    }

    /**
     * Handle delete task
     */
    function handleDeleteTask(id) {
        const task = tasks.find(t => t.id === id);
        showConfirmation(
            'Delete Task',
            `Delete "${task.text}"?`,
            () => {
                Storage.deleteTask(id);
                renderTasks();
                showToast('Task deleted!', 'success');
            }
        );
    }

    /**
     * Filter tasks
     */
    function filterTasks(tasksToFilter) {
        switch (currentFilter) {
            case 'active':
                return tasksToFilter.filter(t => !t.completed);
            case 'completed':
                return tasksToFilter.filter(t => t.completed);
            case 'high':
                return tasksToFilter.filter(t => t.priority === 'high');
            default:
                return tasksToFilter;
        }
    }

    /**
     * Render tasks
     */
    function renderTasks() {
        tasks = Storage.getAllTasks();
        const filteredTasks = filterTasks(tasks);

        updateStats();

        if (filteredTasks.length === 0) {
            elements.tasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>${currentFilter === 'all' ? 'No tasks yet. Add one to get started!' : `No ${currentFilter} tasks.`}</p>
                </div>
            `;
            return;
        }

        elements.tasksList.innerHTML = filteredTasks.map(task => createTaskElement(task)).join('');

        // Add event listeners to task elements
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                handleToggleTask(e.target.dataset.id);
            });
        });

        document.querySelectorAll('.edit-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                handleEditTask(e.currentTarget.dataset.id);
            });
        });

        document.querySelectorAll('.delete-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                handleDeleteTask(e.currentTarget.dataset.id);
            });
        });
    }

    /**
     * Create task element HTML
     */
    function createTaskElement(task) {
        const priorityClass = `${task.priority}-priority`;
        const completedClass = task.completed ? 'completed' : '';
        const timeAgo = Task.getTimeAgo(task.createdDate);

        return `
            <div class="task-item ${priorityClass} ${completedClass}">
                <input 
                    type="checkbox" 
                    class="checkbox"
                    data-id="${task.id}"
                    ${task.completed ? 'checked' : ''}
                >
                <div class="task-content">
                    <div class="task-text">${escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="priority-badge ${task.priority}">${task.priority}</span>
                        <span class="task-date">${timeAgo}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-icon-btn edit edit-action" data-id="${task.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon-btn delete delete-action" data-id="${task.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Update statistics
     */
    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        elements.totalCount.textContent = total;
        elements.completedCount.textContent = completed;
    }

    /**
     * Show confirmation modal
     */
    function showConfirmation(title, message, action) {
        elements.confirmTitle.textContent = title;
        elements.confirmMessage.textContent = message;
        confirmAction = action;
        elements.confirmModal.classList.add('active');
    }

    /**
     * Close confirmation modal
     */
    function closeConfirmModal() {
        elements.confirmModal.classList.remove('active');
        confirmAction = null;
    }

    /**
     * Open edit modal
     */
    function openEditModal() {
        elements.editModal.classList.add('active');
        elements.editTaskInput.focus();
    }

    /**
     * Close edit modal
     */
    function closeEditModal() {
        elements.editModal.classList.remove('active');
        editingTaskId = null;
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        elements.toast.textContent = message;
        elements.toast.className = `toast ${type} show`;

        setTimeout(() => {
            elements.toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Escape HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    return {
        init() {
            initEventListeners();
            renderTasks();
        },
        renderTasks,
        showToast
    };
})();
