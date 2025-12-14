class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) return; // Prevent division by zero
                computation = prev / current;
                break;
            default:
                return;
        }
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText =
            this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('[data-action="compute"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const allClearButton = document.querySelector('[data-action="clear"]');
const percentButton = document.querySelector('[data-action="percent"]');

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
        animateButton(button);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operator'));
        calculator.updateDisplay();
        animateButton(button);
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
    animateButton(equalsButton);
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
    animateButton(allClearButton);
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
    animateButton(deleteButton);
});

// Add Percent functionality separately as it's an immediate action usually
percentButton.addEventListener('click', () => {
    if (calculator.currentOperand === '') return;
    calculator.currentOperand = parseFloat(calculator.currentOperand) / 100;
    calculator.updateDisplay();
    animateButton(percentButton);
});


// JavaScript Animation Helper
function animateButton(button) {
    // Reset animation
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// Keyboard Support
document.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key === 'Enter') key = '=';
    if (key === 'Escape') key = 'AC';
    if (key === 'Backspace') key = 'DEL';

    // Find the corresponding button to trigger visual feedback
    let button;
    if (!isNaN(key) || key === '.') {
        button = Array.from(numberButtons).find(btn => btn.innerText === key);
        if (button) button.click();
    } else if (['+', '-', '*', '/'].includes(key)) {
        button = Array.from(operationButtons).find(btn => btn.getAttribute('data-operator') === key);
        if (button) button.click();
    } else if (key === '=') {
        equalsButton.click();
    } else if (key === 'AC') {
        allClearButton.click();
    } else if (key === 'DEL') {
        deleteButton.click();
    } else if (key === '%') {
        percentButton.click();
    }
});
