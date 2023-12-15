import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { PaperProvider, Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";

export default function App() {
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [fromRate, setFromRate] = useState(1);
  const [toRate, setToRate] = useState(1);

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

  const convertCurrency = () => {
    const num = parseFloat(amount);
    if (!isFinite(num)) {
      setConvertedAmount("");
      return;
    }
    setConvertedAmount(((num / fromRate) * toRate).toFixed(2));
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Wrapper for 'from' amount input and picker */}
        <View style={styles.inputWrapper}>
          <TextInput
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Picker
            selectedValue={fromRate}
            style={styles.picker}
            onValueChange={setFromRate}
            mode="dropdown"
          >
            {Object.entries(exchangeRates).map(([currency, rate]) => (
              <Picker.Item key={currency} label={currency} value={rate} />
            ))}
          </Picker>
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
          <TextInput disabled={true} value={convertedAmount} />
          <Picker
            selectedValue={toRate}
            style={styles.picker}
            onValueChange={setToRate}
            mode="dropdown"
          >
            {Object.entries(exchangeRates).map(([currency, rate]) => (
              <Picker.Item key={currency} label={currency} value={rate} />
            ))}
          </Picker>
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
    width: 110,
    height: 50,
  },
});
