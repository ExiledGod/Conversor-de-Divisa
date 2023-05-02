const inputCurrencyEl = document.getElementById('input-currency');
const outputCurrencyEl = document.getElementById('output-currency');
const inputAmountEl = document.getElementById('input-amount');
const outputAmountEl = document.getElementById('output-amount');
const convertBtnEl = document.getElementById('convert-btn');
const historyBtnEl = document.getElementById('history-btn');
const historyEl = document.getElementById('history');

const EXCHANGE_RATES_API_URL = 'https://data.fixer.io/api/latest?access_key='; // = api key
let exchangeRates = new Map();

function updateConversion() {
    const inputCurrency = inputCurrencyEl.value;
    const outputCurrency = outputCurrencyEl.value;
    const inputAmount = inputAmountEl.value;
    const outputAmount = inputAmount * exchangeRates.get(outputCurrency) / exchangeRates.get(inputCurrency);
    outputAmountEl.innerText = outputAmount.toFixed(2);
}

function updateExchangeRates() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', EXCHANGE_RATES_API_URL, true);
    xhr.onload = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response && response.rates) {
          Object.entries(response.rates).forEach(([currency, rate]) => {
            exchangeRates.set(currency, rate);
          });
          console.log('Exchange rates updated');
        } else {
          console.error('Invalid response');
        }
      } else {
        console.error('Error fetching exchange rates');
      }
    };
    xhr.send();
}

function loadExchangeRates() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', EXCHANGE_RATES_API_URL, true);
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log(response)
        }
    };
    xhr.send();
}

function saveConversionToHistory() {
    const inputCurrency = inputCurrencyEl.value;
    const outputCurrency = outputCurrencyEl.value;
    const inputAmount = inputAmountEl.value;
    const outputAmount = outputAmountEl.textContent;
    const conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    conversionHistory.push({ inputCurrency, outputCurrency, inputAmount, outputAmount });
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
}

function showConversionHistory() {
    const conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    historyEl.innerHTML = '';
    conversionHistory.forEach(conversion => {
        const conversionEl = document.createElement('div');
        conversionEl.innerHTML = '${conversion.inputAmount} ${conversion.inputCurrency} = ${conversion.outputAmount} ${conversion.outputCurrency}';
        historyEl.appendChild(conversionEl);
    });
}


convertBtnEl.addEventListener('onclick',() =>{
    updateConversion;
    saveConversionToHistory;
});

historyBtnEl.addEventListener('onclick', () => {
    showConversionHistory();
});

function updateExchangeRates() {
    loadExchangeRates();
    setTimeout(updateExchangeRates, 4 * 60 * 60 * 1000); // actualiza cada 4 horas los datos ya que tenemos un limite de req mensual de 200 max
}

updateExchangeRates();