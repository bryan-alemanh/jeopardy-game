// Main application controller

const App = (() => {
    let categories = [];
    let currentEditingCategory = null;

    // DOM Elements
    const elements = {
        newGameBtn: document.getElementById('newGameBtn'),
        importBtn: document.getElementById('importBtn'),
        editModeBtn: document.getElementById('editModeBtn'),
        gameSection: document.getElementById('gameSection'),
        editSection: document.getElementById('editSection'),
        board: document.getElementById('board'),
        scoreboard: document.getElementById('scoreboard'),
        score: document.getElementById('score'),
        questionModal: document.getElementById('questionModal'),
        closeModal: document.getElementById('closeModal'),
        categoryLabel: document.getElementById('categoryLabel'),
        valueLabel: document.getElementById('valueLabel'),
        questionText: document.getElementById('questionText'),
        answerDisplay: document.getElementById('answerDisplay'),
        answerText: document.getElementById('answerText'),
        revealAnswerBtn: document.getElementById('revealAnswerBtn'),
        correctBtn: document.getElementById('correctBtn'),
        incorrectBtn: document.getElementById('incorrectBtn'),
        importModal: document.getElementById('importModal'),
        closeImportModal: document.getElementById('closeImportModal'),
        csvInput: document.getElementById('csvInput'),
        uploadCsvBtn: document.getElementById('uploadCsvBtn'),
        addCategoryBtn: document.getElementById('addCategoryBtn'),
        exportCsvBtn: document.getElementById('exportCsvBtn'),
        exitEditBtn: document.getElementById('exitEditBtn'),
        editBoard: document.getElementById('editBoard')
    };

    function initializeEventListeners() {
        elements.newGameBtn.addEventListener('click', startNewGame);
        elements.importBtn.addEventListener('click', openImportModal);
        elements.editModeBtn.addEventListener('click', enterEditMode);
        elements.closeModal.addEventListener('click', closeQuestionModal);
        elements.revealAnswerBtn.addEventListener('click', revealAnswer);
        elements.correctBtn.addEventListener('click', () => answerQuestion(true));
        elements.incorrectBtn.addEventListener('click', () => answerQuestion(false));
        elements.closeImportModal.addEventListener('click', closeImportModal);
        elements.uploadCsvBtn.addEventListener('click', uploadCSV);
        elements.addCategoryBtn.addEventListener('click', addNewCategory);
        elements.exportCsvBtn.addEventListener('click', exportData);
        elements.exitEditBtn.addEventListener('click', exitEditMode);

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === elements.questionModal) {
                closeQuestionModal();
            }
            if (e.target === elements.importModal) {
                closeImportModal();
            }
        });
    }

    function startNewGame() {
        Game.initGame();
        categories = Database.getAllData().categories;
        renderBoard();
        updateScore();
        elements.gameSection.style.display = 'flex';
        elements.editSection.style.display = 'none';
    }

    function renderBoard() {
        elements.board.innerHTML = '';

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';

            const titleDiv = document.createElement('div');
            titleDiv.className = 'category-title';
            titleDiv.textContent = category.name;
            categoryDiv.appendChild(titleDiv);

            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'questions';

            category.questions.forEach(q => {
                const tileDiv = document.createElement('button');
                tileDiv.className = 'question-tile';
                tileDiv.textContent = Utils.formatCurrency(q.value);

                if (Game.isAnswered(category.id, q.value)) {
                    tileDiv.classList.add('answered');
                    tileDiv.disabled = true;
                } else {
                    tileDiv.addEventListener('click', () => selectQuestion(category.id, q.value));
                }

                questionsDiv.appendChild(tileDiv);
            });

            categoryDiv.appendChild(questionsDiv);
            elements.board.appendChild(categoryDiv);
        });
    }

    function selectQuestion(categoryId, value) {
        const question = Game.selectQuestion(categoryId, value);
        if (!question) return;

        elements.categoryLabel.textContent = question.categoryName;
        elements.valueLabel.textContent = Utils.formatCurrency(question.value);
        elements.questionText.textContent = question.question;
        elements.answerText.textContent = question.answer;
        elements.answerDisplay.style.display = 'none';
        elements.revealAnswerBtn.style.display = 'block';

        elements.questionModal.classList.add('active');
    }

    function revealAnswer() {
        elements.answerDisplay.style.display = 'block';
        elements.revealAnswerBtn.style.display = 'none';
    }

    function answerQuestion(correct) {
        const question = Game.getState().currentQuestion;
        if (!question) return;

        if (correct) {
            Game.addScore(question.value);
        } else {
            Game.subtractScore(question.value);
        }

        Game.markAnswered(question.categoryId, question.value);
        updateScore();
        closeQuestionModal();
        renderBoard();
    }

    function updateScore() {
        elements.score.textContent = Utils.formatCurrency(Game.getScore());
    }

    function closeQuestionModal() {
        elements.questionModal.classList.remove('active');
    }

    function openImportModal() {
        elements.importModal.classList.add('active');
    }

    function closeImportModal() {
        elements.importModal.classList.remove('active');
        elements.csvInput.value = '';
    }

    function uploadCSV() {
        const file = elements.csvInput.files[0];
        if (!file) {
            alert('Please select a CSV file');
            return;
        }

        Utils.readFileAsText(file).then(csv => {
            try {
                Database.importFromCSV(csv);
                alert('CSV imported successfully!');
                closeImportModal();
                if (elements.gameSection.style.display !== 'none') {
                    startNewGame();
                }
            } catch (error) {
                alert('Error importing CSV: ' + error.message);
            }
        });
    }

    function enterEditMode() {
        categories = Database.getAllData().categories;
        elements.gameSection.style.display = 'none';
        elements.editSection.style.display = 'block';
        renderEditBoard();
    }

    function exitEditMode() {
        elements.editSection.style.display = 'none';
        elements.gameSection.style.display = 'flex';
        startNewGame();
    }

    function renderEditBoard() {
        elements.editBoard.innerHTML = '';

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'edit-category';

            const titleDiv = document.createElement('h3');
            titleDiv.innerHTML = `
                <input type="text" value="${category.name}" data-category-id="${category.id}" class="category-name-input" />
                <button class="btn btn-danger" data-category-id="${category.id}" onclick="App.deleteCategory('${category.id}')">Delete</button>
            `;
            titleDiv.querySelector('.category-name-input').addEventListener('change', (e) => {
                Database.updateCategoryName(category.id, e.target.value);
            });
            categoryDiv.appendChild(titleDiv);

            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'edit-questions';

            category.questions.forEach(q => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'edit-question';
                questionDiv.innerHTML = `
                    <label>Value: $${q.value}</label>
                    <label>Question:</label>
                    <input type="text" value="${q.question}" class="question-input" data-category-id="${category.id}" data-value="${q.value}" />
                    <label>Answer:</label>
                    <input type="text" value="${q.answer}" class="answer-input" data-category-id="${category.id}" data-value="${q.value}" />
                `;

                const questionInput = questionDiv.querySelector('.question-input');
                const answerInput = questionDiv.querySelector('.answer-input');

                questionInput.addEventListener('change', (e) => {
                    updateQuestion(category.id, q.value, e.target.value, answerInput.value);
                });

                answerInput.addEventListener('change', (e) => {
                    updateQuestion(category.id, q.value, questionInput.value, e.target.value);
                });

                questionsDiv.appendChild(questionDiv);
            });

            categoryDiv.appendChild(questionsDiv);
            elements.editBoard.appendChild(categoryDiv);
        });
    }

    function addNewCategory() {
        const categoryName = prompt('Enter new category name:');
        if (categoryName && categoryName.trim()) {
            Database.addCategory(categoryName);
            categories = Database.getAllData().categories;
            renderEditBoard();
        }
    }

    function updateQuestion(categoryId, value, question, answer) {
        if (question.trim() && answer.trim()) {
            Database.updateQuestion(categoryId, value, question, answer);
        }
    }

    function exportData() {
        const csv = Database.exportToCSV();
        Utils.downloadFile(csv, 'jeopardy-export.csv', 'text/csv');
    }

    return {
        init() {
            initializeEventListeners();
            startNewGame();
        },

        deleteCategory(categoryId) {
            if (confirm('Are you sure you want to delete this category?')) {
                Database.deleteCategory(categoryId);
                categories = Database.getAllData().categories;
                renderEditBoard();
            }
        }
    };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}