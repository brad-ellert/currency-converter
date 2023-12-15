import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider, Button, Text, TextInput } from "react-native-paper";

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
    <PaperProvider>
      <View style={styles.container}>
        <TextInput
          style={styles.spacing}
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
              style={styles.spacing}
              key={pair.title}
              mode="contained-tonal"
              onPress={() => convertCurrency(pair.from, pair.to)}
            >
              {pair.title}
            </Button>
          ))}
        {/* Display converted amount */}
        <Text style={styles.spacing} variant="bodyLarge">
          Converted Amount: {convertedAmount}
        </Text>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  spacing: {
    margin: 10,
  },
});
