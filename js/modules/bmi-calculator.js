import { addHistoryEntry } from "./history.js";
export function renderBMICalculator(container) {
  container.innerHTML = `
    <section class="bmi-workspace">
      <div class="bmi-intro">
        <span class="module-tag">MODULE 4</span>
        <h2>BMI Calculator</h2>
        <p>
          Calculate Body Mass Index using your height and weight.
          Adult categories are intended for screening, not diagnosis.
        </p>
      </div>

      <div class="bmi-layout">
        <form id="bmi-form" class="bmi-form">
          <h3>Enter your measurements</h3>

          <div class="form-field">
            <label for="bmi-weight">Weight (kg)</label>
            <input
              id="bmi-weight"
              class="form-input"
              type="number"
              min="1"
              max="500"
              step="any"
              placeholder="e.g. 65"
              required
            />
          </div>

          <div class="form-field">
            <label for="bmi-height">Height (cm)</label>
            <input
              id="bmi-height"
              class="form-input"
              type="number"
              min="50"
              max="300"
              step="any"
              placeholder="e.g. 170"
              required
            />
          </div>

          <div class="bmi-actions">
            <button type="submit" class="primary-button">
              Calculate BMI
            </button>
            <button type="reset" class="secondary-button">
              Reset
            </button>
          </div>

          <p id="bmi-error" class="form-error" role="alert"></p>
        </form>

        <section class="bmi-results" aria-live="polite">
          <div class="results-heading">
            <span class="result-icon bmi-result-icon">♡</span>
            <div>
              <h3>Your BMI Result</h3>
              <p>Enter your measurements to get started.</p>
            </div>
          </div>

          <div class="bmi-score-panel">
            <p>Body Mass Index</p>
            <h2 id="bmi-score">—</h2>
            <span id="bmi-category" class="bmi-category">
              Awaiting calculation
            </span>
          </div>

          <div class="bmi-scale" aria-label="Adult BMI categories">
            <div class="bmi-scale-segment underweight"></div>
            <div class="bmi-scale-segment healthy"></div>
            <div class="bmi-scale-segment overweight"></div>
            <div class="bmi-scale-segment obesity"></div>
          </div>

          <div class="bmi-scale-labels">
            <span>Underweight</span>
            <span>Healthy</span>
            <span>Overweight</span>
            <span>Obesity</span>
          </div>

          <p id="bmi-explanation" class="bmi-explanation">
            Your category will appear here after calculation.
          </p>

          <p class="result-note">
            Adult BMI categories are for people aged 20 and older.
            BMI is a screening measure, not a diagnosis.
          </p>
        </section>
      </div>
    </section>
  `;

  const form = container.querySelector("#bmi-form");
  const errorElement = container.querySelector("#bmi-error");

  const scoreElement = container.querySelector("#bmi-score");
  const categoryElement = container.querySelector("#bmi-category");
  const explanationElement =
    container.querySelector("#bmi-explanation");

  function resetResults() {
    scoreElement.textContent = "—";
    categoryElement.textContent = "Awaiting calculation";
    categoryElement.className = "bmi-category";

    explanationElement.textContent =
      "Your category will appear here after calculation.";
  }

  function getBMICategory(bmi) {
    if (bmi < 18.5) {
      return {
        name: "Underweight",
        className: "category-underweight",
        explanation:
          "Your BMI is below the standard adult healthy-weight range. BMI alone cannot determine your nutritional status."
      };
    }

    if (bmi < 25) {
      return {
        name: "Healthy weight range",
        className: "category-healthy",
        explanation:
          "Your BMI falls within the standard adult healthy-weight range. BMI is only one indicator of health."
      };
    }

    if (bmi < 30) {
      return {
        name: "Overweight",
        className: "category-overweight",
        explanation:
          "Your BMI falls within the standard adult overweight range. Consider your overall health and other relevant factors."
      };
    }

    return {
      name: "Obesity",
      className: "category-obesity",
      explanation:
        "Your BMI is within the standard adult obesity range. A healthcare professional can help interpret this result in context."
    };
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorElement.textContent = "";

    const weight = Number(
      container.querySelector("#bmi-weight").value
    );

    const heightCm = Number(
      container.querySelector("#bmi-height").value
    );

    if (
      !Number.isFinite(weight) ||
      !Number.isFinite(heightCm) ||
      weight < 1 ||
      weight > 500 ||
      heightCm < 50 ||
      heightCm > 300
    ) {
      errorElement.textContent =
        "Enter a weight from 1 to 500 kg and a height from 50 to 300 cm.";
      return;
    }

    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);

    if (!Number.isFinite(bmi)) {
      errorElement.textContent =
        "Unable to calculate BMI from these values.";
      return;
    }

    const result = getBMICategory(bmi);
    // Save the successful BMI calculation to History.
addHistoryEntry({
  calculator: "BMI Calculator",
  expression: `Weight: ${weight} kg, Height: ${heightCm} cm`,
  result: `BMI: ${bmi.toFixed(1)} — ${result.name}`
});

    scoreElement.textContent = bmi.toFixed(1);
    categoryElement.textContent = result.name;
    categoryElement.className =
      `bmi-category ${result.className}`;

    explanationElement.textContent = result.explanation;
  });

  form.addEventListener("reset", () => {
    errorElement.textContent = "";

    resetResults();
  });
}
