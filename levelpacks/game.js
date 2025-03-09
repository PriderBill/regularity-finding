// 导入题目数据
import questions from 'priderbill.github.io/json/questions.json' assert { type: 'json' };

class GameManager {
    constructor() {
        // 初始化元素引用
        this.elements = {
            levelTitle: document.getElementById('levelTitle'),
            questionText: document.getElementById('questionText'),
            answerInput: document.getElementById('answerInput'),
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            questionForm: document.getElementById('questionForm'),
            customAlert: document.getElementById('customAlert'),
            alertText: document.getElementById('alertText'),
            alertPrevBtn: document.getElementById('alertPrevBtn'),
            alertNextBtn: document.getElementById('alertNextBtn'),
            alertRestartBtn: document.getElementById('alertRestartBtn')
        };

        // 状态初始化
        this.currentLevel = this.getCurrentLevel();
        this.totalLevels = questions.length;
        this.initialize();
    }

    initialize() {
        // 事件监听
        this.elements.questionForm.addEventListener('submit', (e) => this.checkAnswer(e));
        this.elements.alertPrevBtn.addEventListener('click', () => this.navigate(-1));
        this.elements.alertNextBtn.addEventListener('click', () => this.navigate(1));
        this.elements.alertRestartBtn.addEventListener('click', () => this.restartLevel());
        
        // 初始加载
        this.loadQuestion();
        this.updateNavigation();
        this.elements.answerInput.focus();
    }

    getCurrentLevel() {
        const params = new URLSearchParams(window.location.search);
        let level = parseInt(params.get('level')) || 1;
        return Math.max(1, Math.min(level, this.totalLevels));
    }

    loadQuestion() {
        const question = questions[this.currentLevel - 1];
        this.elements.levelTitle.textContent = `第 ${this.currentLevel} 关`;
        this.elements.questionText.textContent = question.problem;
        this.elements.answerInput.value = '';
        this.elements.answerInput.maxLength = question.answer.toString().length;
    }

    updateNavigation() {
        // 更新导航按钮状态
        this.elements.prevBtn.disabled = this.currentLevel === 1;
        this.elements.nextBtn.disabled = !this.isLevelPassed(this.currentLevel);

        // 更新弹窗按钮状态
        this.elements.alertPrevBtn.disabled = this.currentLevel === 1;
        this.elements.alertNextBtn.disabled = !this.isLevelPassed(this.currentLevel);
    }

    isLevelPassed(level) {
        return localStorage.getItem(`level-${level}`) === 'passed';
    }

    checkAnswer(e) {
        e.preventDefault();
        const userAnswer = this.elements.answerInput.value.trim();
        const correctAnswer = questions[this.currentLevel - 1].answer.toString();

        if (userAnswer === correctAnswer) {
            this.handleCorrect();
        } else {
            this.handleWrong();
        }
    }

    handleCorrect() {
        localStorage.setItem(`level-${this.currentLevel}`, 'passed');
        this.showAlert('✅ 答案正确！', true);
        this.updateNavigation();
        
        // 解锁下一关
        if (this.currentLevel < this.totalLevels) {
            localStorage.setItem(`level-${this.currentLevel + 1}`, 'unlocked');
        }
    }

    handleWrong() {
        this.showAlert('❌ 答案错误，请再试一次', false);
        this.elements.answerInput.value = '';
        this.elements.answerInput.focus();
    }

    showAlert(message, isSuccess) {
        this.elements.alertText.textContent = message;
        this.elements.customAlert.style.display = 'flex';
        this.elements.customAlert.className = `custom-alert ${isSuccess ? 'success' : 'error'}`;
    }

    hideAlert() {
        this.elements.customAlert.style.display = 'none';
    }

    navigate(direction) {
        const newLevel = this.currentLevel + direction;
        if (newLevel < 1 || newLevel > this.totalLevels) return;
        
        this.currentLevel = newLevel;
        history.replaceState({}, '', `?level=${newLevel}`);
        this.loadQuestion();
        this.updateNavigation();
        this.hideAlert();
        this.elements.answerInput.focus();
    }

    restartLevel() {
        localStorage.removeItem(`level-${this.currentLevel}`);
        this.hideAlert();
        this.loadQuestion();
        this.updateNavigation();
        this.elements.answerInput.focus();
    }
}

// 初始化游戏
const game = new GameManager();