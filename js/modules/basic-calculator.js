import { addHistoryEntry } from "./history.js";
let displayValue = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;
let justCalculated = false;
let calculatorActive = false;

const MAX_DIGITS = 14;

function resetCalculator() {
  displayValue = "0";
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  justCalculated = false;
}

function formatResult(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Invalid calculation");
  }

  // Avoid displaying long floating-point artifacts.
  return String(Number(value.toPrecision(12)));
}

function calculate(a, b, op) {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      if (b === 0) {
        throw new Error("Cannot divide by zero");
      }
      return a / b;
    default:
      return b;
  }
}

function updateDisplay(container) {
  const display = container.querySelector("#calc-display");
  if (display) {
    display.textContent = displayValue;
  }
}

function showError(container, message) {
  const status = container.querySelector("#calc-status");
  if (status) {
    status.textContent = message;
  }
}

function clearStatus(container) {
  showError(container, "");
}

function enterDigit(digit, container) {
  clearStatus(container);

  if (waitingForSecondOperand || justCalculated) {
    displayValue = digit;
    waitingForSecondOperand = false;
    justCalculated = false;
  } else if (displayValue === "0") {
    displayValue = digit;
  } else if (displayValue.replace(/[^0-9]/g, "").length < MAX_DIGITS) {
    displayValue += digit;
  }

  updateDisplay(container);
}

function enterDecimal(container) {
  clearStatus(container);

  if (waitingForSecondOperand || justCalculated) {
    displayValue = "0.";
    waitingForSecondOperand = false;
    justCalculated = false;
  } else if (!displayValue.includes(".")) {
    displayValue += ".";
  }

  updateDisplay(container);
}

function chooseOperator(nextOperator, container) {
  clearStatus(container);

  const inputValue = Number(displayValue);

  if (!Number.isFinite(inputValue)) {
    return;
  }

  if (operator && !waitingForSecondOperand) {
    try {
      const result = calculate(firstOperand, inputValue, operator);
      displayValue = formatResult(result);
      firstOperand = result;
    } catch (error) {
      showError(container, error.message);
      return;
    }
  } else {
    firstOperand = inputValue;
  }

  operator = nextOperator;
  waitingForSecondOperand = true;
  justCalculated = false;
  updateDisplay(container);
}


function performEquals(container) {
  clearStatus(container);

  if (operator === null || waitingForSecondOperand) {
    return;
  }

  try {
    const secondOperand = Number(displayValue);
    const calculationOperator = operator;
    const firstNumber = firstOperand;

    const result = calculate(
      firstNumber,
      secondOperand,
      calculationOperator
    );

    const formattedResult = formatResult(result);

    // Save the successful calculation to History.
    addHistoryEntry({
      calculator: "Basic Calculator",
      expression: `${firstNumber} ${calculationOperator} ${secondOperand}`,
      result: formattedResult
    });

    // Update the calculator display.
    displayValue = formattedResult;
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    justCalculated = true;
  } catch (error) {
    showError(container, error.message);
    return;
  }

  updateDisplay(container);
}


function performPercent(container) {
  clearStatus(container);

  const result = Number(displayValue) / 100;
  displayValue = formatResult(result);
  justCalculated = false;

  updateDisplay(container);
}

function toggleSign(container) {
  clearStatus(container);

  if (Number(displayValue) !== 0) {
    displayValue = displayValue.startsWith("-")
      ? displayValue.slice(1)
      : "-" + displayValue;
  }

  updateDisplay(container);
}

function deleteLast(container) {
  clearStatus(container);

  if (waitingForSecondOperand || justCalculated) {
    displayValue = "0";
    waitingForSecondOperand = false;
    justCalculated = false;
  } else {
    displayValue = displayValue.slice(0, -1);

    if (displayValue === "" || displayValue === "-") {
      displayValue = "0";
    }
  }

  updateDisplay(container);
}

function handleAction(action, value, container) {
  switch (action) {
    case "digit":
      enterDigit(value, container);
      break;
    case "decimal":
      enterDecimal(container);
      break;
    case "operator":
      chooseOperator(value, container);
      break;
    case "equals":
      performEquals(container);
      break;
    case "clear":
      resetCalculator();
      clearStatus(container);
      updateDisplay(container);
      break;
    case "delete":
      deleteLast(container);
      break;
    case "percent":
      performPercent(container);
      break;
    case "sign":
      toggleSign(container);
      break;
  }
}

export function renderBasicCalculator(container) {
  calculatorActive = true;
  resetCalculator();

  container.innerHTML = `
    <section class="calculator-workspace">
      <div class="calculator-intro">
        <span class="module-tag">MODULE 2</span>
        <h2>Basic Calculator</h2>
        <p>Perform everyday arithmetic with ease.</p>
      </div>

      <div class="calculator-shell">
        <div class="calculator-screen" aria-live="polite">
          <div id="calc-status" class="calculator-status"></div>
          <div id="calc-display" class="calculator-display">0</div>
        </div>

        <div class="calculator-keypad">
          <button class="calc-key utility" data-action="clear">AC</button>
          <button class="calc-key utility" data-action="delete">DEL</button>
          <button class="calc-key utility" data-action="percent">%</button>
          <button class="calc-key operator" data-action="operator" data-value="÷">÷</button>

          <button class="calc-key" data-action="digit" data-value="7">7</button>
          <button class="calc-key" data-action="digit" data-value="8">8</button>
          <button class="calc-key" data-action="digit" data-value="9">9</button>
          <button class="calc-key operator" data-action="operator" data-value="×">×</button>

          <button class="calc-key" data-action="digit" data-value="4">4</button>
          <button class="calc-key" data-action="digit" data-value="5">5</button>
          <button class="calc-key" data-action="digit" data-value="6">6</button>
          <button class="calc-key operator" data-action="operator" data-value="−">−</button>

          <button class="calc-key" data-action="digit" data-value="1">1</button>
          <button class="calc-key" data-action="digit" data-value="2">2</button>
          <button class="calc-key" data-action="digit" data-value="3">3</button>
          <button class="calc-key operator" data-action="operator" data-value="+">+</button>

          <button class="calc-key utility" data-action="sign">±</button>
          <button class="calc-key" data-action="digit" data-value="0">0</button>
          <button class="calc-key" data-action="decimal">.</button>
          <button class="calc-key equals" data-action="equals">=</button>
        </div>

        <p class="calculator-hint">
          Keyboard: numbers, +, -, *, /, Enter, Backspace and Escape
        </p>
      </div>
    </section>
  `;

  updateDisplay(container);
}

export function disposeBasicCalculator() {
  calculatorActive = false;
}

// Use one shared keyboard listener instead of adding a new
// listener every time the user opens the calculator.
document.addEventListener("click", (event) => {
  const button = event.target.closest("#page-content .calc-key");

  if (!button || !calculatorActive) {
    return;
  }

  const container = document.getElementById("page-content");

  handleAction(
    button.dataset.action,
    button.dataset.value,
    container
  );
});

document.addEventListener("keydown", (event) => {
  if (!calculatorActive) {
    return;
  }

  // Do not intercept shortcuts while typing into a form field.
  if (
    event.target instanceof HTMLElement &&
    event.target.matches("input, textarea, select")
  ) {
    return;
  }

  const container = document.getElementById("page-content");
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    event.preventDefault();
    enterDigit(key, container);
  } else if (key === ".") {
    event.preventDefault();
    enterDecimal(container);
  } else if (key === "+") {
    event.preventDefault();
    chooseOperator("+", container);
  } else if (key === "-") {
    event.preventDefault();
    chooseOperator("−", container);
  } else if (key === "*") {
    event.preventDefault();
    chooseOperator("×", container);
  } else if (key === "/") {
    event.preventDefault();
    chooseOperator("÷", container);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    performEquals(container);
  } else if (key === "Backspace") {
    event.preventDefault();
    deleteLast(container);
  } else if (key === "Escape") {
    resetCalculator();
    clearStatus(container);
    updateDisplay(container);
  } else if (key === "%") {
    event.preventDefault();
    performPercent(container);
  }
});
