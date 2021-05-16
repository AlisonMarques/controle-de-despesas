// recebendo a referencia do html do lugar onde queremos adicionar nosso script
const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

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
const addTransactionIntoDOM = (transaction) => {
   //obtendo o operador matemático de acordo com o valor do amount
   const operator = transaction.amount < 0 ? '-' : '+';

   //Adicionando operador matemático para o elemento html de acordo com o operator do amount
   const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';

   // servindo para tirar a expressão do operador de subtração que vem dentro de um valor negativo (-)
   const amountWithoutOperator = Math.abs(transaction.amount);

   const li = document.createElement('li');

   li.classList.add(CSSClass);
   li.innerHTML = `
  ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
  `;

   //adicionando a li ao elemento transactions do html
   transactionsUl.append(li);
};

// RENDERIZANDO O SALDO ATUAL, RECEITAS E DESPESAS
const updateBalanceValues = () => {
   //Obtendo valores da renda

   //fazendo um map no objeto e pegando apenas a propriedade amount
   const transactionsAmounts = transactions.map(
      (transaction) => transaction.amount
   );

   // fazendo um reduce para transforma os valores de amount em um só resultado// um unico valor
   const total = transactionsAmounts
      .reduce((accumulator, transaction) => accumulator + transaction, 0)
      .toFixed(2);

   // fazendo um filter para retornar apenas os valores que seja maior que zero// renda
   const income = transactionsAmounts
      .filter((value) => value > 0)
      .reduce((accumulator, value) => accumulator + value, 0)
      .toFixed(2);

   // Obtendo valores das despesas
   // fazendo um filter para retornar apenas os valores que seja menor que zero// despesa
   const expense = Math.abs(
      transactionsAmounts
         .filter((value) => value < 0)
         .reduce((accumulator, value) => accumulator + value, 0)
   ).toFixed(2);

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

// Controlando o formulário de add transação
form.addEventListener('submit', (event) => {
   // evitando que os dados sejam enviados após o submit pq vamos tratar eles antes
   event.preventDefault();

   const transactionName = inputTransactionName.value.trim();
   const transactionAmount = inputTransactionAmount.value.trim();

   // verificando se os forms estão preenchidos
   if (transactionName === '' || transactionAmount === '') {
      alert(`Por favor, preencha tanto o "NOME" quanto o "VALOR DA TRANSAÇÃO`);
      return;
   }

   // Objeto que recebe os dados informados no form
   const transaction = {
      id: generateID(),
      name: transactionName,
      amount: Number(transactionAmount),
   };

   //Adicionando os dados das transaction
   transactions.push(transaction);
   //Atualizando os dados na interface
   init();

   // Atualizando os dados no localStorage
   updateLocalStorage();

   // Limpando os inputs dos forms após o submit
   inputTransactionName.value = '';
   inputTransactionAmount.value = '';
});
