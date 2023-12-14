import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function App() {
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");

  type ExchangeRates = {
    [key: string]: number;
  };
  // Hardcoded exchange rates for demonstration
  // Base currency is USD
  const exchangeRates: ExchangeRates = {
    USD: 1,
    EUR: 0.88,
    JPY: 110,
    // Add more currencies as needed
  };

  const convertCurrency = (fromCurrency: string, toCurrency: string) => {
    const num = parseFloat(amount);
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    if (!isFinite(num) || fromRate === undefined || toRate === undefined) {
      setConvertedAmount("");
      return;
    }
    setConvertedAmount(((num / fromRate) * toRate).toFixed(2));
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
      {/* Create a button for every pair of currencies */}
      {Object.keys(exchangeRates)
        .flatMap((fromCurrency) =>
          Object.keys(exchangeRates).map((toCurrency) => ({
            from: fromCurrency,
            to: toCurrency,
            title: `${fromCurrency} to ${toCurrency}`,
          }))
        )
        .filter((pair) => pair.from !== pair.to)
        .map((pair) => (
          <Button
            key={pair.title}
            title={pair.title}
            onPress={() => convertCurrency(pair.from, pair.to)}
          />
        ))}
      {/* Display converted amount */}
      <Text style={styles.resultText}>Converted Amount: {convertedAmount}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
  },
});
