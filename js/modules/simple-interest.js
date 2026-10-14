import { addHistoryEntry } from "./history.js";
export function renderSimpleInterest(container) {
  container.innerHTML = `
    <section class="interest-workspace">
      <div class="interest-intro">
        <span class="module-tag">MODULE 3</span>
        <h2>Simple Interest Calculator</h2>
        <p>
          Calculate the interest earned and the total amount
          using your principal, annual rate and time period.
        </p>
      </div>

      <div class="interest-layout">
        <form id="interest-form" class="interest-form">
          <h3>Enter your details</h3>

          <div class="form-field">
            <label for="principal">Principal amount (₹)</label>
            <input
              id="principal"
              class="form-input"
              type="number"
              min="0.01"
              step="any"
              placeholder="e.g. 10000"
              required
            />
          </div>

          <div class="form-field">
            <label for="rate">Annual interest rate (%)</label>
            <input
              id="rate"
              class="form-input"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 5"
              required
            />
          </div>

          <div class="form-field">
            <label for="time">Time period</label>
            <div class="time-input-row">
              <input
                id="time"
                class="form-input"
                type="number"
                min="0.01"
                step="any"
                placeholder="e.g. 2"
                required
              />

              <select id="time-unit" class="form-input" aria-label="Time unit">
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div class="interest-actions">
            <button type="submit" class="primary-button">
              Calculate Interest
            </button>
            <button type="reset" class="secondary-button">
              Reset
            </button>
          </div>

          <p id="interest-error" class="form-error" role="alert"></p>
        </form>

        <section class="interest-results" aria-live="polite">
          <div class="results-heading">
            <span class="result-icon">%</span>
            <div>
              <h3>Calculation Results</h3>
              <p>Your results will appear here.</p>
            </div>
          </div>

          <div class="result-highlight">
            <p>Simple interest</p>
            <h2 id="interest-result">₹0.00</h2>
          </div>

          <div class="result-row">
            <span>Principal amount</span>
            <strong id="principal-result">₹0.00</strong>
          </div>

          <div class="result-row">
            <span>Total amount</span>
            <strong id="total-result">₹0.00</strong>
          </div>

          <div class="result-row">
            <span>Annual interest rate</span>
            <strong id="rate-result">0%</strong>
          </div>

          <div class="result-row">
            <span>Time in years</span>
            <strong id="time-result">0</strong>
          </div>

          <p class="result-note">
            Assumes a fixed annual rate and simple interest,
            without additional fees or compounding.
          </p>
        </section>
      </div>
    </section>
  `;

  const form = container.querySelector("#interest-form");
  const errorElement = container.querySelector("#interest-error");

  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function formatCurrency(value) {
    return currency.format(value);
  }

  function clearResults() {
    container.querySelector("#interest-result").textContent =
      formatCurrency(0);

    container.querySelector("#principal-result").textContent =
      formatCurrency(0);

    container.querySelector("#total-result").textContent =
      formatCurrency(0);

    container.querySelector("#rate-result").textContent = "0%";
    container.querySelector("#time-result").textContent = "0";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorElement.textContent = "";

    const principal = Number(
      container.querySelector("#principal").value
    );

    const rate = Number(
      container.querySelector("#rate").value
    );

    const timeInput = Number(
      container.querySelector("#time").value
    );

    const unit = container.querySelector("#time-unit").value;

    if (
      !Number.isFinite(principal) ||
      !Number.isFinite(rate) ||
      !Number.isFinite(timeInput) ||
      principal <= 0 ||
      rate < 0 ||
      timeInput <= 0
    ) {
      errorElement.textContent =
        "Enter a positive principal, a non-negative rate, and a positive time period.";
      return;
    }

    const timeInYears =
      unit === "months" ? timeInput / 12 : timeInput;

 
    
const interest = (principal * rate * timeInYears) / 100;
const totalAmount = principal + interest;

if (
  !Number.isFinite(interest) ||
  !Number.isFinite(totalAmount)
) {
  errorElement.textContent =
    "These values are too large to calculate safely.";
  return;
}

// Save the successful calculation to History.
addHistoryEntry({
  calculator: "Simple Interest",
  expression: `Principal: ₹${principal}, Rate: ${rate}%, Time: ${timeInput} ${unit}`,
  result: `Interest: ${formatCurrency(interest)}, Total: ${formatCurrency(totalAmount)}`
});

container.querySelector("#interest-result").textContent =
  formatCurrency(interest);

container.querySelector("#principal-result").textContent =
  formatCurrency(principal);

container.querySelector("#total-result").textContent =
  formatCurrency(totalAmount);

container.querySelector("#rate-result").textContent =
  `${rate}%`;

container.querySelector("#time-result").textContent =
  String(Number(timeInYears.toFixed(6)));


    container.querySelector("#interest-result").textContent =
      formatCurrency(interest);

    container.querySelector("#principal-result").textContent =
      formatCurrency(principal);

    container.querySelector("#total-result").textContent =
      formatCurrency(totalAmount);

    container.querySelector("#rate-result").textContent =
      `${rate}%`;

    container.querySelector("#time-result").textContent =
      String(Number(timeInYears.toFixed(6)));
  });

  form.addEventListener("reset", () => {
    errorElement.textContent = "";

    // Wait until the form's native reset has taken effect.
    setTimeout(() => {
      clearResults();
    }, 0);
  });
}
