// 1. Ambil data
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// 2. Akses DOM
const transactionForm = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transaction-list");
const balanceElement = document.getElementById("balance");
const incomeElement = document.getElementById("total-income");
const expenseElement = document.getElementById("total-expense");

// 3. Formatting rupiah
function formattingRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
}

// 4. Store data ke localstorage
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// 5. Fungsi untuk menghitung saldo, pemasukkan dan pengeluaran
function updateSummary() {
  let totalIncome = 0;
  let totalExpanse = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else {
      totalExpanse += transaction.amount;
    }
  }
  const balance = totalIncome - totalExpanse;

  balanceElement.textContent = formattingRupiah(balance);
  incomeElement.textContent = formattingRupiah(totalIncome);
  expenseElement.textContent = formattingRupiah(totalExpanse);
}

// 6. Menampilkan transaksi ke halaman
function transactionRender() {
  transactionList.innerHTML = " ";

  if (transactions.length === 0) {
    transactionList.innerHTML =
      '<li class="empty-message">Belum ada transaksi</li>';

    updateSummary();
    return;
  }

  for (const transaction of transactions) {
    const listItem = document.createElement("li");
    listItem.className = `transaction-item ${transaction.type}`;

    const sign = transaction.type === "income" ? "+" : "-";
    const typeLabel =
      transaction.type === "income" ? "Pemasukkan" : "Pengeluaran";

    listItem.innerHTML = `
        <div class="transaction-info">
            <h3>${transaction.description}</h3>
            <p>${typeLabel}</p>
        </div>

        <span class="transaction-amount">
            ${sign}${formattingRupiah(transaction.amount)}
        </span>

        <button class="delete-button" data-id="${transaction.id}" type="button">
            Hapus
        </button>
      `;

    transactionList.appendChild(listItem);
  }

  updateSummary();
}

// 7. Mengambil proses transaksi dari Form
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Menghilang behaviour bawaan javascript (untuk refresh)

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (description === "" || amount <= 0) {
    alert("Deskripsi dan nomimal harus diisi dengan benar.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    description: description,
    amount: amount,
    type: type,
  };

  transactions.push(newTransaction);

  saveTransactions();
  transactionRender();

  transactionForm.reset();
  descriptionInput.focus();
});

// 8. Menghapus Transaksi menggunakan event delegation
transactionList.addEventListener("click", function (e) {
  if (!e.target.classList.contains("delete-button")) {
    return;
  }

  const transactionId = Number(e.target.dataset.id);

  transactions = transactions.filter(function (transaction) {
    return transaction.id !== transactionId;
  });

  saveTransactions();
  transactionRender();
});

transactionRender();
