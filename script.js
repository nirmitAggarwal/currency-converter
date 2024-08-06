document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("converter-form");
  const fromCurrencySelect = document.getElementById("from-currency");
  const toCurrencySelect = document.getElementById("to-currency");
  const resultDiv = document.getElementById("result");

  const apiUrl = "https://api.exchangerate-api.com/v4/latest/USD"; // You can use any exchange rate API

  // Fetch exchange rates and populate currency options
  const fetchRates = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      populateCurrencyOptions(data.rates);
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  const populateCurrencyOptions = (rates) => {
    // Clear existing options
    fromCurrencySelect.innerHTML = "";
    toCurrencySelect.innerHTML = "";

    // Populate options
    for (const [currencyCode] of Object.entries(rates)) {
      const option = document.createElement("option");
      option.value = currencyCode;
      option.textContent = currencyCode;
      fromCurrencySelect.appendChild(option);
      toCurrencySelect.appendChild(option.cloneNode(true));
    }
  };

  // Convert currencies
  const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const rate = data.rates[toCurrency] / data.rates[fromCurrency];
      return (amount * rate).toFixed(2);
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;

    if (amount && fromCurrency && toCurrency) {
      const convertedAmount = await convertCurrency(
        amount,
        fromCurrency,
        toCurrency
      );
      resultDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    }
  });

  // Initial fetch
  fetchRates();
});
