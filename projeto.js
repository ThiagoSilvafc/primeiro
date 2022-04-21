/* referencia itens no DOM */
const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const form = document.querySelector('#form');

/* api do localstorage para armazenar as transações */
const localStorageTransactions = JSON.parse(
  localStorage.getItem('transactions')
);
/* retorna ou os itens do localstorage se não começa como array vazio */
let transactions =
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

/* remover item do DOM */
const removeTransaction = ID => {
  transactions = transactions.filter(transaction => transaction.id !== ID);
  updateLocalStorage();
  init();
  /* console.log(transactions); */
};

const addTransactionIntoDOM = ({ amount, name, id }) => {
  /* Ternários que retornam dependendo do valor da transação */
  const operator = amount < 0 ? '-' : '+';
  const CSSClass = amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(amount);
  /* cria o elemento no DOM  */
  const li = document.createElement('li');

  /* Adiciona a classe no item */
  li.classList.add(CSSClass);
  li.innerHTML = `
    ${name}
    <span>${operator} R$ ${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `;
  /* adiciona na lista */
  transactionUl.append(li);
};

const getExpenses = transactionsAmounts =>
  Math.abs(
    transactionsAmounts
      .filter(value => value < 0)
      .reduce((acc, value) => acc + value, 0)
  ).toFixed(2);

const getIncomes = transactionsAmounts =>
  transactionsAmounts
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0)
    .toFixed(2);

const getTotals = transactionsAmounts =>
  transactionsAmounts
    .reduce((acc, transaction) => acc + transaction, 0)
    .toFixed(2);

const updateBalanceValue = () => {
  /* retorna um novo array com apenas os valores de amount */
  const transactionsAmounts = transactions.map(({ amount }) => amount);

  /* pega os valores de AMOUNT e soma através de um metódo REDUCE */
  const total = getTotals(transactionsAmounts);
  /* retorna apenas os valores positivos e soma eles */
  const income = getIncomes(transactionsAmounts);
  /* retorna apenas os valores negativos e soma eles */
  const expense = getExpenses(transactionsAmounts);

  /* exibindo no html  */
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
  balanceDisplay.textContent = `R$ ${total}`;
};

/* Inicializa os itens do array no DOM */
const init = () => {
  /* limpo o array */
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM);

  /* chamadas das funções */
  updateBalanceValue();
};

/* chamadas da função init*/
init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions));
};

/* gera numero aleatório */
const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionsArray = (transactionName, transactionAmount) => {
  /* adiciona no array transactions  */
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};

const clearInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
};

const handleFormSubmit = event => {
  event.preventDefault();

  /* valores dos inputs */
  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

  /* caso os campos não sejam preenchidos */
  if (isSomeInputEmpty) {
    alert('Preencha todos os campos!');
    return;
  }

  /* cria o objeto transação */
  addToTransactionsArray(transactionName, transactionAmount);

  /* adiciona no ultimo index e atualiza */
  init();
  updateLocalStorage();

  /* limpa os inputs */
  clearInputs();
};

form.addEventListener('submit', handleFormSubmit);