
const STORAGE_KEY = "calculatorHubHistory";
const MAX_HISTORY_ITEMS = 50;

export function getHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const history = saved ? JSON.parse(saved) : [];

    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error("Could not load calculation history:", error);
    return [];
  }
}

export function addHistoryEntry({
  calculator,
  expression,
  result
}) {
  const entry = {
    id: `${Date.now()}-${Math.random()}`,
    calculator,
    expression: String(expression),
    result: String(result),
    date: new Date().toLocaleString("en-IN")
  };

  const history = getHistory();

  history.unshift(entry);

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS))
    );
  } catch (error) {
    console.error("Could not save calculation history:", error);
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

export function renderHistory(container) {
  const history = getHistory();

  container.innerHTML = `
    <section class="history-workspace">
      <div class="history-heading">
        <div>
          <span class="module-tag">MODULE 5</span>
          <h2>Calculation History</h2>
          <p>Review your recent calculator results.</p>
        </div>

        <button
          type="button"
          id="clear-history-button"
          class="secondary-button"
          ${history.length === 0 ? "disabled" : ""}
        >
          Clear History
        </button>
      </div>

      ${
        history.length === 0
          ? `
            <div class="history-empty">
              <h3>No calculations yet</h3>
              <p>Your calculations will appear here when you use a calculator.</p>
            </div>
          `
          : `
            <div class="history-table-wrapper">
              <table class="history-table">
                <thead>
                  <tr>
                    <th>Calculator</th>
                    <th>Expression / Details</th>
                    <th>Result</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${history.map((item) => `
                    <tr>
                      <td>${escapeHTML(item.calculator)}</td>
                      <td>${escapeHTML(item.expression)}</td>
                      <td>${escapeHTML(item.result)}</td>
                      <td>${escapeHTML(item.date)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          `
      }
    </section>
  `;

  const clearButton = container.querySelector("#clear-history-button");

  clearButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all calculation history?")) {
      clearHistory();
      renderHistory(container);
    }
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}
