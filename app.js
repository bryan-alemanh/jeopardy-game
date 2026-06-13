// Main application controller

const App = (() => {
    let categories = [];
    let currentEditingCategory = null;
    let selectedPreset = null;

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
        categoryPresetBtn: document.getElementById('categoryPresetBtn'),
        exportCsvBtn: document.getElementById('exportCsvBtn'),
        exitEditBtn: document.getElementById('exitEditBtn'),
        editBoard: document.getElementById('editBoard'),
        customValuesModal: document.getElementById('customValuesModal'),
        closeCustomModal: document.getElementById('closeCustomModal'),
        customValuesInput: document.getElementById('customValuesInput'),
        applyCustomValuesBtn: document.getElementById('applyCustomValuesBtn'),
        closeCustomValuesBtn: document.getElementById('closeCustomValuesBtn')
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
        elements.categoryPresetBtn.addEventListener('change', handlePresetSelection);
        elements.exportCsvBtn.addEventListener('click', exportData);
        elements.exitEditBtn.addEventListener('click', exitEditMode);
        elements.closeCustomModal.addEventListener('click', closeCustomValuesModal);
        elements.closeCustomValuesBtn.addEventListener('click', closeCustomValuesModal);
        elements.applyCustomValuesBtn.addEventListener('click', applyCustomValues);

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === elements.questionModal) {
                closeQuestionModal();
            }
            if (e.target === elements.importModal) {
                closeImportModal();
            }
            if (e.target === elements.customValuesModal) {
                closeCustomValuesModal();
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

    function handlePresetSelection(e) {
        const preset = e.target.value;
        elements.categoryPresetBtn.value = '';

        if (!preset) return;

        if (preset === 'custom') {
            openCustomValuesModal();
        } else {
            const presets = Database.getValuePresets();
            if (presets[preset]) {
                Database.setCustomValues(presets[preset]);
                addNewCategory();
            }
        }
    }

    function openCustomValuesModal() {
        elements.customValuesInput.value = Database.getCustomValues().join(',');
        elements.customValuesModal.classList.add('active');
    }

    function closeCustomValuesModal() {
        elements.customValuesModal.classList.remove('active');
        elements.customValuesInput.value = '';
    }

    function applyCustomValues() {
        const input = elements.customValuesInput.value.trim();
        const values = input.split(',').map(v => {
            const num = parseInt(v.trim());
            return isNaN(num) ? null : num;
        }).filter(v => v !== null);

        if (values.length === 0) {
            alert('Please enter valid numbers separated by commas');
            return;
        }

        Database.setCustomValues(values);
        closeCustomValuesModal();
        addNewCategory();
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
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = category.name;
            nameInput.className = 'category-header-input';
            nameInput.addEventListener('change', (e) => {
                Database.updateCategoryName(category.id, e.target.value);
                category.name = e.target.value;
            });

            const actionDiv = document.createElement('div');
            actionDiv.className = 'category-actions';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => App.deleteCategory(category.id));

            actionDiv.appendChild(deleteBtn);
            titleDiv.appendChild(nameInput);
            titleDiv.appendChild(actionDiv);
            categoryDiv.appendChild(titleDiv);

            const questionsDiv = document.createElement('div');
            questionsDiv.className = 'edit-questions';

            category.questions.forEach(q => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'edit-question';

                const valueLabel = document.createElement('label');
                valueLabel.textContent = 'Value:';

                const valueInput = document.createElement('input');
                valueInput.type = 'number';
                valueInput.value = q.value;
                valueInput.className = 'question-value-input';

                const questionLabel = document.createElement('label');
                questionLabel.textContent = 'Question:';

                const questionInput = document.createElement('input');
                questionInput.type = 'text';
                questionInput.value = q.question;
                questionInput.className = 'question-input';
                questionInput.placeholder = 'Enter question text';
                questionInput.setAttribute('data-category-id', category.id);
                questionInput.setAttribute('data-value', q.value);

                const answerLabel = document.createElement('label');
                answerLabel.textContent = 'Answer:';

                const answerInput = document.createElement('input');
                answerInput.type = 'text';
                answerInput.value = q.answer;
                answerInput.className = 'answer-input';
                answerInput.placeholder = 'Enter answer text';
                answerInput.setAttribute('data-category-id', category.id);
                answerInput.setAttribute('data-value', q.value);

                const saveUpdate = () => {
                    const newValue = parseInt(valueInput.value);
                    if (isNaN(newValue) || newValue <= 0) {
                        valueInput.value = q.value;
                        alert('Please enter a valid positive number');
                        return;
                    }
                    updateQuestion(category.id, q.value, newValue, questionInput.value, answerInput.value);
                    q.value = newValue;
                };

                valueInput.addEventListener('change', saveUpdate);
                questionInput.addEventListener('change', saveUpdate);
                answerInput.addEventListener('change', saveUpdate);

                questionDiv.appendChild(valueLabel);
                questionDiv.appendChild(valueInput);
                questionDiv.appendChild(questionLabel);
                questionDiv.appendChild(questionInput);
                questionDiv.appendChild(answerLabel);
                questionDiv.appendChild(answerInput);

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

    function updateQuestion(categoryId, oldValue, newValue, question, answer) {
        if (question.trim() && answer.trim()) {
            Database.updateQuestionValue(categoryId, oldValue, newValue, question, answer);
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