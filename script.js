// recebendo a referencia do html do lugar onde queremos adicionar nosso script
const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');
const transactionsNameEl = document.querySelector(
   '[data-js="transactions-container"]'
);

const amountsValueEl = document.querySelector('[data-js="amounts-container"]');

const localStorageTransactions = JSON.parse(
   localStorage.getItem('transactions')
);

//Salvando os dados no localStorage ou um array vazio caso não haja dados
let transactions =
   localStorage.getItem('transactions') !== null
      ? localStorageTransactions
      : [];

// Função que remove uma transação pelo botão (X)
const removeTransaction = (ID) => {
   //Fazendo que o transactions receba os dados menos o que foi clicado
   transactions = transactions.filter((transaction) => transaction.id !== ID);

   // Atualizando os dados no localStorage
   updateLocalStorage();

   //Atualizando a lista com a transaction removida
   init();
};

// RENDERIZANDO AS TRANSAÇÕES
const addTransactionIntoDOM = ({ amount, name, id }) => {
   //obtendo o operador matemático de acordo com o valor do amount
   const operator = amount < 0 ? '-' : '+';

   //Adicionando operador matemático para o elemento html de acordo com o operator do amount
   const CSSClass = amount < 0 ? 'minus' : 'plus';

   // servindo para tirar a expressão do operador de subtração que vem dentro de um valor negativo (-)
   const amountWithoutOperator = Math.abs(amount);

   const li = document.createElement('li');

   li.classList.add(CSSClass);
   li.innerHTML = `
  ${name} <span>${operator} R$ ${amountWithoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${id})">x</button>
  `;

   //adicionando a li ao elemento transactions do html
   transactionsUl.append(li);
};

// fazendo um filter para retornar apenas os valores que seja menor que zero// despesa
const getExpenses = (transactionsAmounts) =>
   Math.abs(
      transactionsAmounts
         .filter((value) => value < 0)
         .reduce((accumulator, value) => accumulator + value, 0)
   ).toFixed(2);

// fazendo um filter para retornar apenas os valores que seja maior que zero// renda
const getIncome = (transactionsAmounts) =>
   transactionsAmounts
      .filter((value) => value > 0)
      .reduce((accumulator, value) => accumulator + value, 0)
      .toFixed(2);

// fazendo um reduce para transforma os valores de amount em um só resultado// um unico valor
const getTotal = (transactionsAmounts) =>
   transactionsAmounts
      .reduce((accumulator, transaction) => accumulator + transaction, 0)
      .toFixed(2);

// RENDERIZANDO O SALDO ATUAL, RECEITAS E DESPESAS
const updateBalanceValues = () => {
   //Obtendo valores da renda

   //fazendo um map no objeto e pegando apenas a propriedade amount
   const transactionsAmounts = transactions.map(({ amount }) => amount);

   const total = getTotal(transactionsAmounts);
   const income = getIncome(transactionsAmounts);

   // Obtendo valores das despesas
   const expense = getExpenses(transactionsAmounts);

   // Passando os dados para os elementos
   balanceDisplay.textContent = `R$ ${total}`;
   incomeDisplay.textContent = `R$ ${income}`;
   expenseDisplay.textContent = `R$ ${expense}`;
};

// função que vai executar o preenchimento das informações do estado da aplicação quando a pagina for carregada
const init = () => {
   // limpando o init para que não duplique os dados
   transactionsUl.innerHTML = '';
   // iterando as informações
   transactions.forEach(addTransactionIntoDOM);
   updateBalanceValues();
};

init();

// Atualizando os dados para o local storage
const updateLocalStorage = () => {
   localStorage.setItem('transactions', JSON.stringify(transactions));
};

//gerando os ids aleatorio
const generateID = () => Math.round(Math.random() * 1000);

// Objeto que recebe os dados informados no form
const addTransactionsArray = (transactionName, transactionAmount) => {
   //Adicionando os dados das transactions
   transactions.push({
      id: generateID(),
      name: transactionName,
      amount: Number(transactionAmount),
   });
};

const cleanInputs = () => {
   // Limpando os inputs dos forms após o submit
   inputTransactionName.value = '';
   inputTransactionAmount.value = '';
};

// Controlando o formulário de add transação
const handleFormSubmit = (event) => {
   // evitando que os dados sejam enviados após o submit pq vamos tratar eles antes
   event.preventDefault();

   const transactionName = inputTransactionName.value.trim();
   const transactionAmount = inputTransactionAmount.value.trim();
   // verificando se os forms estão preenchidos
   const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

   // Alert personalizado com bootstrap
   const transactionsAlert = (type, position) => {
      const div = document.createElement('div');
      const button = document.createElement('button');

      div.textContent = `Por favor, preencha o ${type} da transação`;
      div.classList.add(
         'alert',
         'alert-warning',
         'alert-dismissible',
         'fade',
         'show'
      );
      div.setAttribute('role', 'alert');
      button.classList.add('btn-close');
      button.setAttribute('type', 'button');
      button.setAttribute('Atrribute', 'Close');

      //removendo a messagem de alerta
      button.addEventListener('click', () => {
         div.remove();
      });

      div.appendChild(button);

      if (position === 'afterend') {
         transactionsNameEl.insertAdjacentElement(`${position}`, div);
         return;
      }

      amountsValueEl.insertAdjacentElement('beforeend', div);
   };
   // verificando se o form está preenchido
   if (transactionName === '') {
      transactionsAlert('nome', 'afterend');
      return;
   }

   // verificando se o form amount está preenchido
   if (transactionAmount === '') {
      transactionsAlert('valor');
      return;
   }

   // Objeto que recebe os dados informados no form
   addTransactionsArray(transactionName, transactionAmount);

   //Atualizando os dados na interface
   init();

   // Atualizando os dados no localStorage
   updateLocalStorage();

   // Limpando os inputs dos forms após o submit
   cleanInputs();
};

// Controlando o formulário de add transação
form.addEventListener('submit', handleFormSubmit);
