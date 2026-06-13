// Game logic for Jeopardy

const Game = (() => {
    let gameState = {
        score: 0,
        answered: new Set(),
        currentQuestion: null,
        gameActive: false
    };

    return {
        /**
         * Initialize new game
         */
        initGame() {
            gameState = {
                score: 0,
                answered: new Set(),
                currentQuestion: null,
                gameActive: true
            };
            return gameState;
        },

        /**
         * Select a question
         */
        selectQuestion(categoryId, value) {
            if (gameState.answered.has(`${categoryId}-${value}`)) {
                return null;
            }

            const category = Database.getCategory(categoryId);
            if (!category) return null;

            const question = category.questions.find(q => q.value === value);
            if (!question) return null;

            gameState.currentQuestion = {
                categoryId,
                categoryName: category.name,
                value,
                question: question.question,
                answer: question.answer
            };

            return gameState.currentQuestion;
        },

        /**
         * Mark question as answered
         */
        markAnswered(categoryId, value) {
            gameState.answered.add(`${categoryId}-${value}`);
        },

        /**
         * Add points to score
         */
        addScore(amount) {
            gameState.score += amount;
            return gameState.score;
        },

        /**
         * Subtract points from score
         */
        subtractScore(amount) {
            gameState.score -= amount;
            return gameState.score;
        },

        /**
         * Get current game state
         */
        getState() {
            return Utils.deepClone(gameState);
        },

        /**
         * Check if question has been answered
         */
        isAnswered(categoryId, value) {
            return gameState.answered.has(`${categoryId}-${value}`);
        },

        /**
         * Get score
         */
        getScore() {
            return gameState.score;
        },

        /**
         * Reset game
         */
        reset() {
            gameState = {
                score: 0,
                answered: new Set(),
                currentQuestion: null,
                gameActive: false
            };
        }
    };
})();