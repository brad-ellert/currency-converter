import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function App() {
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  // Hardcoded exchange rates for demonstration
  const exchangeRates = {
    USD_TO_EUR: 0.88,
    EUR_TO_USD: 1.14,
    // Add more as needed
  };

  const convertCurrency = (fromCurrency, toCurrency) => {
    // Implement conversion logic here
    // For example, converting USD to EUR
    let result = 0;
    if (fromCurrency === 'USD' && toCurrency === 'EUR') {
      result = amount * exchangeRates.USD_TO_EUR;
    }
    if (fromCurrency === 'EUR' && toCurrency === 'USD') {
      result = amount * exchangeRates.EUR_TO_USD;
    }
    // Add other conversion logic as needed

    setConvertedAmount(result.toFixed(2)); // Keeping two decimal places
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      {/* Simple buttons for selecting currencies */}
      <Button title="USD to EUR" onPress={() => convertCurrency('USD', 'EUR')} />
      <Button title="EUR to USD" onPress={() => convertCurrency('EUR', 'USD')} />
      {/* Display converted amount */}
      <Text style={styles.resultText}>Converted Amount: {convertedAmount}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
  },
});
