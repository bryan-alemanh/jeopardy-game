// Main application initialization

const App = (() => {
    return {
        init() {
            UI.init();
            console.log('To-Do List app initialized!');
        }
    };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
