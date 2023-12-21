import { useEffect, useState } from "react";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import {
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
} from "victory-native";
import { StyleSheet, View } from "react-native";

export default function Page() {
  interface DataPoint {
    price: number;
    time: string;
  }

  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    socket.onopen = () => {
      console.log("WebSocket Connected");
      const subscribeMessage = {
        type: "subscribe",
        channels: [{ name: "ticker", product_ids: ["BTC-USD"] }],
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (e) => {
      const rawData = JSON.parse(e.data);
      const dataPoint: DataPoint = {
        price: parseFloat(rawData.price),
        time: rawData.time,
      };
      console.log(dataPoint);
      if (!isNaN(dataPoint.price) && dataPoint.time) {
        setData((prev) => [...prev, dataPoint].slice(-100));
      }
    };

    socket.onerror = (e) => {
      console.error("WebSocket error occurred");
      console.log(e); // Log the entire event object for any available info
    };

    socket.onclose = (e) => {
      console.log("WebSocket Disconnected");
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <PaperProvider theme={DefaultTheme}>
      <View style={styles.container}>
        <VictoryChart width={350} theme={VictoryTheme.material}>
          <VictoryAxis
            tickCount={1}
            tickLabelComponent={<VictoryLabel textAnchor="start" />}
          />
          <VictoryAxis dependentAxis />
          <VictoryLine data={data} x="time" y="price" />
        </VictoryChart>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
