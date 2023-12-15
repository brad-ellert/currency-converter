import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider, Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

function formatNumberAsCurrencyWithoutSymbol(amount: number, currency: string) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  })
    .format(amount)
    .replace(/[^\d.]/g, ""); // Removes anything that's not a digit or period
}

export default function App() {
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");

  type ExchangeRates = {
    [key: string]: number;
  };
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ USD: 1 });

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD");
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    }
  };

  const convertCurrency = () => {
    const num = parseFloat(amount);
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    if (!isFinite(num) || fromRate === undefined || toRate === undefined) {
      setAmount("");
      setConvertedAmount("");
      return;
    }
    setAmount(formatNumberAsCurrencyWithoutSymbol(num, fromCurrency));
    setConvertedAmount(
      formatNumberAsCurrencyWithoutSymbol((num / fromRate) * toRate, toCurrency)
    );
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Wrapper for 'from' amount input and picker */}
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={fromCurrency}
            style={styles.picker}
            onValueChange={setFromCurrency}
            mode="dropdown"
          >
            {Object.keys(exchangeRates).map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
          <TextInput
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Convert button */}
        <Button
          style={styles.inputWrapper}
          mode="contained-tonal"
          onPress={() => convertCurrency()}
        >
          Convert
        </Button>

        {/* Wrapper for 'to' amount display and picker */}
        <View style={styles.inputWrapper}>
          <Picker
            selectedValue={toCurrency}
            style={styles.picker}
            onValueChange={setToCurrency}
            mode="dropdown"
          >
            {Object.keys(exchangeRates).map((currency) => (
              <Picker.Item key={currency} label={currency} value={currency} />
            ))}
          </Picker>
          <TextInput disabled={true} value={convertedAmount} />
        </View>

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
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
  },
  picker: {
    width: 120,
    height: 50,
  },
});
