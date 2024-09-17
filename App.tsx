import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import CharacterList from "./components/CharacterList";
import Pagination from "./components/Pagination";
import { useCharacters } from "./api/useCharacters";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Feather";
import { Character } from "./types/types";
import { FontProvider, useFont } from "./context/FontContext";

const { width, height } = Dimensions.get("window");
const generateStars = (count: number) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const starSize = Math.random() * 2 + 1;
    stars.push({
      top: Math.random() * height,
      left: Math.random() * width,
      size: starSize,
    });
  }
  return stars;
};
const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { characters, loading, error, totalPages, searchCharacters } =
    useCharacters();
  const { fontsLoaded } = useFont();
  const stars = useMemo(() => generateStars(100), []);

  const search = useCallback(() => {
    searchCharacters(searchQuery, currentPage, pageSize);
  }, [searchQuery, currentPage, pageSize, searchCharacters]);

  const pageSizeChange = useCallback(
    (itemValue) => {
      setPageSize(itemValue);
      setCurrentPage(1);
      searchCharacters(searchQuery, 1, itemValue);
    },
    [searchQuery, searchCharacters]
  );

  const pageChange = useCallback(
    (page) => {
      setCurrentPage(page);
      searchCharacters(searchQuery, page, pageSize);
    },
    [searchQuery, pageSize, searchCharacters]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Character; index: number }) => (
      <View style={index === 0 ? styles.firstItem : styles.item}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>Birth: {item.birth_year}</Text>
        <Text style={styles.subtitle}>Eye color: {item.eye_color}</Text>
      </View>
    ),
    []
  );

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.starryBackground}>
        {stars.map((star, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              backgroundColor: "#fff",
              borderRadius: star.size / 2,
            }}
          />
        ))}
      </View>
      <Text style={styles.header}>Star Wars Characters Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Character name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#777"
      />
      <TouchableOpacity style={styles.searchButton} onPress={search}>
        <Text style={styles.searchButtonText}>SEARCH</Text>
      </TouchableOpacity>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Page size:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={pageSize}
            style={styles.picker}
            onValueChange={pageSizeChange}
          >
            <Picker.Item label="25" value={25} />
            <Picker.Item label="50" value={50} />
            <Picker.Item label="100" value={100} />
            <Picker.Item label="150" value={150} />
          </Picker>
          <Icon
            name="chevron-down"
            size={24}
            color="#fff"
            style={styles.icon}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : characters.length === 0 ? (
        <Text style={styles.noResultsText}>No characters found.</Text>
      ) : (
        <>
          <CharacterList characters={characters} renderItem={renderItem} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={pageChange}
          />
        </>
      )}
    </View>
  );
};

const IndexApp = () => {
  return (
    <FontProvider>
      <App />
    </FontProvider>
  );
};

export default IndexApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#000",
  },
  starryBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    color: "#ffe81f",
    textAlign: "center",
    fontFamily: "Title",
  },
  input: {
    height: 50,
    borderColor: "#ffe81f",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    color: "#ffff",
    backgroundColor: "rgba(0,0,0,0.08727240896358546) 49%)",
    fontFamily: "Details",
  },
  searchButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "yellow",
    borderStyle: "solid",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },

  searchButtonText: {
    color: "#ffe81f",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Other",
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
    color: "#fff",
  },
  pickerWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 8,
    height: 35,
    width: 120,
    paddingHorizontal: 5,
  },
  picker: {
    flex: 1,
    height: 40,
    color: "#fff",
    backgroundColor: "transparent",
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerCell: {
    fontFamily: "Details",
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    flex: 1,
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    marginVertical: 5,
  },
  firstItem: {
    backgroundColor: "#e0f7fa",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    marginVertical: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: "Details",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  paginationText: {
    fontSize: 16,
    color: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Details",
  },
  noResultsText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Details",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "Title",
  },
  retryButton: {
    fontSize: 16,
    color: "#007bff",
    textDecorationLine: "underline",
  },
});
