import React, { useRef, useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";

const TimePicker = ({ data, onItemSelected }) => {
  const scrollRef = useRef(null);
  const itemHeight = 50;
  const dataLength = data.length;

  const extendedData = [...data, ...data, ...data];
  const middleIndex = Math.floor(extendedData.length / 3);

  const [selectedItem, setSelectedItem] = useState(data[0]);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const selectedIndex = Math.round(offsetY / itemHeight);
    const trueIndex = selectedIndex % dataLength;

    if (trueIndex >= 0 && trueIndex < dataLength) {
      const item = data[trueIndex];
      setSelectedItem(item);
      onItemSelected(item);
    }
  };

  useEffect(() => {
    const middleOffsetY = middleIndex * itemHeight;
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: middleOffsetY, animated: false });
    }
    setSelectedItem(data[0]);
  }, []);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        style={styles.picker}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
      >
        {extendedData.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.overlay}>
        <Text style={styles.selectedItemText}>{selectedItem}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 50,
    width: 70,
    overflow: "hidden",
    marginHorizontal: 5,
  },
  picker: {
    flex: 1,
  },
  container: {
    alignItems: "center",
  },
  item: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 70,
  },
  itemText: {
    fontSize: 24,
    color: "transparent", 
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none", 
    borderRadius: 10
  },
  selectedItemText: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
  },
});

export default TimePicker;