
const form = document.getElementById("expense-form");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const expenseList = document.getElementById("expense-list");
const totalElement = document.getElementById("total");
const emptyMessage = document.getElementById("empty-message");

let expenses = [];

try {
    const savedExpenses = JSON.parse(
        localStorage.getItem("expenses") || "[]"
    );

    if (Array.isArray(savedExpenses)) {
        expenses = savedExpenses.filter(expense =>
            expense &&
            typeof expense.title === "string" &&
            typeof expense.amount === "number" &&
            Number.isFinite(expense.amount) &&
            expense.amount > 0 &&
            typeof expense.category === "string"
        );
    }
} catch (error) {
    expenses = [];
}

const categories = [
    "Food", "Travel", "College", "Shopping", "Other"
];

const chartColors = [
    "#2563eb", "#16a34a", "#f59e0b",
    "#db2777", "#9333ea"
];

let chart = null;

function saveExpenses() {
    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}

function renderExpenses() {
    expenseList.innerHTML = "";

    let total = 0;

    expenses.forEach((expense, index) => {
        total += expense.amount;

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = expense.title;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;

        const amountCell = document.createElement("td");
        amountCell.textContent =
            "₹" + expense.amount.toFixed(2);

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            expenses.splice(index, 1);
            saveExpenses();
            renderExpenses();
        });

        actionCell.appendChild(deleteButton);
        row.append(nameCell, categoryCell, amountCell, actionCell);
        expenseList.appendChild(row);
    });

    totalElement.textContent = "₹" + total.toFixed(2);

    emptyMessage.style.display =
        expenses.length === 0 ? "block" : "none";

    updateChart();
}

function updateChart() {
    const categoryTotals = categories.map(category => {
        return expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0);
    });

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(
        document.getElementById("expense-chart"),
        {
            type: "pie",
            data: {
                labels: categories,
                datasets: [{
                    data: categoryTotals,
                    backgroundColor: chartColors,
                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        }
    );
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;

    if (
        !title ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        !categories.includes(category)
    ) {
        alert("Please enter valid expense details.");
        return;
    }

    expenses.push({
        title: title,
        amount: amount,
        category: category
    });

    saveExpenses();
    renderExpenses();
    form.reset();
    titleInput.focus();
});

renderExpenses();