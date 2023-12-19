import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
  DefaultTheme,
  PaperProvider,
  TextInput,
  HelperText,
} from "react-native-paper";
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
  const [error, setError] = useState(false);

  type ExchangeRates = {
    [key: string]: number;
  };
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({ USD: 1 });

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

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
    if (amount === "") {
      setError(false);
      setConvertedAmount("");
      return;
    }
    const num = parseFloat(amount);
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    if (!isFinite(num) || fromRate === undefined || toRate === undefined) {
      setError(true);
      setConvertedAmount("");
      return;
    }
    setError(false);
    // setAmount(formatNumberAsCurrencyWithoutSymbol(num, fromCurrency));
    setConvertedAmount(
      formatNumberAsCurrencyWithoutSymbol((num / fromRate) * toRate, toCurrency)
    );
  };

  return (
    <PaperProvider theme={DefaultTheme}>
      <View style={styles.container}>
        {/* 'from' amount input and picker */}
        <View style={styles.row}>
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
          <View style={styles.textInputContainer}>
            <TextInput
              keyboardType="numeric"
              value={amount}
              error={error}
              onChangeText={setAmount}
            />
          </View>
        </View>
        <HelperText type="error" visible={error}>
          Invalid
        </HelperText>

        {/* 'to' amount display and picker */}
        <View style={styles.row}>
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
          <View style={styles.textInputContainer}>
            <TextInput disabled={true} value={convertedAmount} />
          </View>
        </View>

        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  picker: {
    width: 120,
    height: 50,
  },
  textInputContainer: {
    flex: 1, // Take up remaining space in the row
  },
  button: {
    margin: 20,
  },
});
