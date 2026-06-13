// Database management for Jeopardy game

const Database = (() => {
    const STORAGE_KEY = 'jeopardy_game_data';
    const DEFAULT_DATA = {
        categories: [
            {
                id: Utils.generateId(),
                name: 'Literature',
                questions: [
                    { value: 100, question: 'This author wrote "Pride and Prejudice"', answer: 'Jane Austen' },
                    { value: 200, question: 'The Great Gatsby was written by', answer: 'F. Scott Fitzgerald' },
                    { value: 300, question: 'Who wrote "To Kill a Mockingbird"?', answer: 'Harper Lee' },
                    { value: 400, question: 'This is the author of "1984"', answer: 'George Orwell' },
                    { value: 500, question: 'Who wrote the Harry Potter series?', answer: 'J.K. Rowling' }
                ]
            },
            {
                id: Utils.generateId(),
                name: 'Science',
                questions: [
                    { value: 100, question: 'What is the chemical symbol for gold?', answer: 'Au' },
                    { value: 200, question: 'How many planets are in our solar system?', answer: 'Eight' },
                    { value: 300, question: 'What is the speed of light?', answer: '300,000 kilometers per second' },
                    { value: 400, question: 'What gas do plants absorb from the atmosphere?', answer: 'Carbon dioxide' },
                    { value: 500, question: 'Who developed the theory of evolution?', answer: 'Charles Darwin' }
                ]
            },
            {
                id: Utils.generateId(),
                name: 'History',
                questions: [
                    { value: 100, question: 'In what year did Columbus discover America?', answer: '1492' },
                    { value: 200, question: 'Who was the first President of the United States?', answer: 'George Washington' },
                    { value: 300, question: 'The Great Wall of China was built to protect against whom?', answer: 'Mongol invasions' },
                    { value: 400, question: 'In what year did the Titanic sink?', answer: '1912' },
                    { value: 500, question: 'Who signed the Magna Carta?', answer: 'King John' }
                ]
            },
            {
                id: Utils.generateId(),
                name: 'Geography',
                questions: [
                    { value: 100, question: 'What is the capital of France?', answer: 'Paris' },
                    { value: 200, question: 'Which is the largest continent?', answer: 'Asia' },
                    { value: 300, question: 'What is the capital of Japan?', answer: 'Tokyo' },
                    { value: 400, question: 'The Sahara Desert is located in which continent?', answer: 'Africa' },
                    { value: 500, question: 'What is the highest mountain in the world?', answer: 'Mount Everest' }
                ]
            },
            {
                id: Utils.generateId(),
                name: 'Sports',
                questions: [
                    { value: 100, question: 'How many players are on a basketball team on the court?', answer: 'Five' },
                    { value: 200, question: 'In tennis, what is a score of 0-0?', answer: 'Deuce' },
                    { value: 300, question: 'How many holes are there in a standard golf course?', answer: 'Eighteen' },
                    { value: 400, question: 'In what country did rugby originate?', answer: 'England' },
                    { value: 500, question: 'How many times has Argentina won the FIFA World Cup?', answer: 'Three' }
                ]
            }
        ]
    };

    // Value presets for templates
    const VALUE_PRESETS = {
        standard: [100, 200, 300, 400, 500],
        double: [200, 400, 600, 800, 1000],
        final: [1000],
        custom: null
    };

    let data = loadData();
    let customValues = VALUE_PRESETS.standard;

    function loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading data:', e);
                return Utils.deepClone(DEFAULT_DATA);
            }
        }
        return Utils.deepClone(DEFAULT_DATA);
    }

    function saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    return {
        /**
         * Get all categories and questions
         */
        getAllData() {
            return Utils.deepClone(data);
        },

        /**
         * Get a specific category
         */
        getCategory(categoryId) {
            return Utils.deepClone(data.categories.find(c => c.id === categoryId));
        },

        /**
         * Add a new category with custom values
         */
        addCategory(name, values = null) {
            const valuesToUse = values || customValues;
            const category = {
                id: Utils.generateId(),
                name: name,
                questions: valuesToUse.map(value => ({
                    value: value,
                    question: '',
                    answer: ''
                }))
            };
            data.categories.push(category);
            saveData();
            return Utils.deepClone(category);
        },

        /**
         * Delete a category
         */
        deleteCategory(categoryId) {
            const index = data.categories.findIndex(c => c.id === categoryId);
            if (index !== -1) {
                data.categories.splice(index, 1);
                saveData();
                return true;
            }
            return false;
        },

        /**
         * Update a category name
         */
        updateCategoryName(categoryId, name) {
            const category = data.categories.find(c => c.id === categoryId);
            if (category) {
                category.name = name;
                saveData();
                return true;
            }
            return false;
        },

        /**
         * Update a question's value
         */
        updateQuestionValue(categoryId, oldValue, newValue, question, answer) {
            const category = data.categories.find(c => c.id === categoryId);
            if (category) {
                const questionIdx = category.questions.findIndex(q => q.value === oldValue);
                if (questionIdx !== -1) {
                    category.questions[questionIdx].value = newValue;
                    category.questions[questionIdx].question = question;
                    category.questions[questionIdx].answer = answer;
                    saveData();
                    return true;
                }
            }
            return false;
        },

        /**
         * Update a question
         */
        updateQuestion(categoryId, value, question, answer) {
            const category = data.categories.find(c => c.id === categoryId);
            if (category) {
                const q = category.questions.find(q => q.value === value);
                if (q) {
                    q.question = question;
                    q.answer = answer;
                    saveData();
                    return true;
                }
            }
            return false;
        },

        /**
         * Set custom values for new categories
         */
        setCustomValues(values) {
            if (Array.isArray(values) && values.length > 0) {
                customValues = values;
                return true;
            }
            return false;
        },

        /**
         * Get current custom values
         */
        getCustomValues() {
            return [...customValues];
        },

        /**
         * Get value presets
         */
        getValuePresets() {
            return VALUE_PRESETS;
        },

        /**
         * Import data from CSV
         */
        importFromCSV(csv) {
            try {
                const lines = Utils.parseCSV(csv);
                if (lines.length < 3) {
                    throw new Error('CSV must have at least 3 rows');
                }

                // First row contains category names and values
                const headerRow = lines[0];
                const categoryName = headerRow[0];
                const values = headerRow.slice(1).map(v => parseInt(v)).filter(v => !isNaN(v));

                if (values.length === 0) {
                    throw new Error('No valid values found in header row');
                }

                // Second row contains questions
                const questionRow = lines[1];
                // Third row contains answers
                const answerRow = lines[2];

                if (questionRow.length < values.length + 1 || answerRow.length < values.length + 1) {
                    throw new Error('Questions and answers must match the number of values');
                }

                const category = {
                    id: Utils.generateId(),
                    name: categoryName,
                    questions: values.map((value, index) => ({
                        value: value,
                        question: questionRow[index + 1],
                        answer: answerRow[index + 1]
                    }))
                };

                // Check if category already exists
                const existingIndex = data.categories.findIndex(c => c.name === categoryName);
                if (existingIndex !== -1) {
                    data.categories[existingIndex] = category;
                } else {
                    data.categories.push(category);
                }

                saveData();
                return true;
            } catch (error) {
                console.error('CSV import error:', error);
                throw error;
            }
        },

        /**
         * Export data to CSV format
         */
        exportToCSV() {
            const csvData = [];

            data.categories.forEach(category => {
                // Header row: Category name, then values
                const headerRow = [category.name, ...category.questions.map(q => q.value)];
                csvData.push(headerRow);

                // Question row
                const questionRow = ['Questions', ...category.questions.map(q => q.question)];
                csvData.push(questionRow);

                // Answer row
                const answerRow = ['Answers', ...category.questions.map(q => q.answer)];
                csvData.push(answerRow);

                // Add blank row between categories
                csvData.push([]);
            });

            return Utils.arrayToCSV(csvData);
        },

        /**
         * Reset to default data
         */
        reset() {
            data = Utils.deepClone(DEFAULT_DATA);
            customValues = VALUE_PRESETS.standard;
            saveData();
        },

        /**
         * Clear all data
         */
        clear() {
            data = { categories: [] };
            saveData();
        }
    };
})();