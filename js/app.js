import {
  renderBasicCalculator,
  disposeBasicCalculator
} from "./modules/basic-calculator.js";

import {
  renderSimpleInterest
} from "./modules/simple-interest.js";

import {
  renderBMICalculator
} from "./modules/bmi-calculator.js";

const pageTitle = document.getElementById("page-title");
const pageContent = document.getElementById("page-content");

const calculators = [
  {
    id: "basic",
    title: "Basic Calculator",
    description: "Perform addition, subtraction, multiplication and division.",
    icon: "＋",
    color: "purple"
  },
  {
    id: "interest",
    title: "Simple Interest",
    description: "Calculate interest and the total amount on your principal.",
    icon: "%",
    color: "green"
  },
  {
    id: "bmi",
    title: "BMI Calculator",
    description: "Calculate your body mass index using height and weight.",
    icon: "♡",
    color: "pink"
  }
];

const pages = {
  basic: {
    title: "Basic Calculator",
    description: "A dedicated workspace for everyday arithmetic.",
    status: "Coming in Module 2"
  },
  interest: {
    title: "Simple Interest Calculator",
    description: "Enter principal, interest rate and time to calculate interest.",
    status: "Coming in Module 3"
  },
  bmi: {
    title: "BMI Calculator",
    description: "Enter your height and weight to calculate your BMI.",
    status: "Coming in Module 4"
  },
  settings: {
    title: "Settings",
    description: "Preferences and additional application features will be added here.",
    status: "Coming in a future module"
  }
};

// Build the dashboard cards from the calculator data.
function renderDashboard() {
  pageTitle.textContent = "Dashboard";

  pageContent.innerHTML = `
    <section class="welcome-panel">
      <span class="welcome-label">WELCOME TO CALCHUB</span>
      <h2>Calculate smarter, every day.</h2>
      <p>
        Your everyday calculations, organized in one simple
        workspace. Choose a tool below to get started.
      </p>
    </section>

    <section>
      <div class="section-heading">
        <div>
          <h2>Available Tools</h2>
          <p>Choose a calculator to open its workspace.</p>
        </div>

        <input
          type="search"
          id="calculator-search"
          class="search-input"
          placeholder="Search calculators..."
          aria-label="Search calculators"
        />
      </div>

      <div id="calculator-grid" class="calculator-grid"></div>
      <p id="empty-state" class="empty-state" hidden>
        No calculators match your search.
      </p>
    </section>
  `;

  renderCalculatorCards(calculators);

  document
    .getElementById("calculator-search")
    .addEventListener("input", (event) => {
      const query = event.target.value.trim().toLowerCase();

      const filtered = calculators.filter((calculator) => {
        return (
          calculator.title.toLowerCase().includes(query) ||
          calculator.description.toLowerCase().includes(query)
        );
      });

      renderCalculatorCards(filtered);
    });
}

// Render the cards using reusable data.
function renderCalculatorCards(items) {
  const grid = document.getElementById("calculator-grid");
  const emptyState = document.getElementById("empty-state");

  grid.innerHTML = items.map((calculator) => `
    <button
      class="calculator-card"
      type="button"
      data-open-page="${calculator.id}"
    >
      <span class="card-icon ${calculator.color}">
        ${calculator.icon}
      </span>
      <h3>${calculator.title}</h3>
      <p>${calculator.description}</p>
      <span class="card-action">Open calculator →</span>
    </button>
  `).join("");

  emptyState.hidden = items.length !== 0;
}

// Render an individual module placeholder.

function renderModule(pageId) {
  const page = pages[pageId];

  if (!page) {
    renderDashboard();
    return;
  }

  pageTitle.textContent = page.title;

  // Open the real Basic Calculator module.
  if (pageId === "basic") {
    renderBasicCalculator(pageContent);
    return;
  }

  if (pageId === "interest") {
  renderSimpleInterest(pageContent);
  return;
}

if (pageId === "bmi") {
  renderBMICalculator(pageContent);
  return;
}

  // Keep other modules as placeholders for now.
  pageContent.innerHTML = `
    <section class="module-panel">
      <span class="module-tag">${page.status}</span>
      <h2>${page.title}</h2>
      <p>${page.description}</p>
      <p>
        This workspace will be implemented in its own
        development module.
      </p>
      <button class="nav-item active" type="button" data-page="home">
        ← Back to Dashboard
      </button>
    </section>
  `;
}


// Central navigation controller.

function navigateTo(pageId) {
  const validPage = pageId === "home" || Boolean(pages[pageId]);
  const destination = validPage ? pageId : "home";

  // Stop calculator keyboard handling before switching pages.
  disposeBasicCalculator();

  document.querySelectorAll("[data-page]").forEach((button) => {
    const isActive = button.dataset.page === destination;

    button.classList.toggle("active", isActive);

    if (button.classList.contains("nav-item")) {
      if (isActive) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    }
  });

  if (destination === "home") {
    renderDashboard();
  } else {
    renderModule(destination);
  }
}


// Handle clicks on sidebar items, brand and calculator cards.
document.addEventListener("click", (event) => {
  const pageButton = event.target.closest("[data-page]");
  const cardButton = event.target.closest("[data-open-page]");

  if (pageButton) {
    event.preventDefault();
    navigateTo(pageButton.dataset.page);
  } else if (cardButton) {
    navigateTo(cardButton.dataset.openPage);
  }
});

// Start the application.
navigateTo("home");
