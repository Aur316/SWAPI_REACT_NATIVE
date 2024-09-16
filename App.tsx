import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

interface Character {
  name: string;
  birth_year: string;
  eye_color: string;
  created: string;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>("name");

  const totalPages = Math.ceil(characters.length / pageSize);

  const searchCharacters = async () => {
    setLoading(true);
    let allCharacters: Character[] = [];
    let apiURL = searchQuery
      ? `https://swapi.dev/api/people/?search=${searchQuery}`
      : `https://swapi.dev/api/people/`;

    try {
      while (apiURL) {
        const response = await axios.get(apiURL);
        let results = response.data.results as Character[];
        allCharacters = [...allCharacters, ...results];
        apiURL = response.data.next;
      }
      // Fetch version
      /*
    while (apiURL) {
      const response = await fetch(apiURL);
      const data = await response.json();
      let results = data.results as Character[];
      allCharacters = [...allCharacters, ...results];
      apiURL = data.next;
    }
    */
      const blueEyedCharacters = allCharacters
        .filter((char) => char.eye_color.includes("blue"))
        .sort((a, b) => a.name.localeCompare(b.name));

      const otherCharacters = allCharacters
        .filter((char) => !char.eye_color.includes("blue"))
        .sort(
          (a, b) =>
            new Date(a.created).getTime() - new Date(b.created).getTime()
        );

      setCharacters([...blueEyedCharacters, ...otherCharacters]);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortBy = (field: keyof Character) => {
    setSortField(field);
    const sortedCharacters = [...characters].sort((a, b) =>
      a[field].localeCompare(b[field])
    );
    setCharacters(sortedCharacters);
  };

  const paginatedCharacters = characters.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const renderItem = ({ item, index }: { item: Character; index: number }) => (
    <View style={index === 0 ? styles.firstItem : styles.item}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>Birth: {item.birth_year}</Text>
      <Text style={styles.subtitle}>Eye color: {item.eye_color}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Star Wars Characters Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Character name"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#777"
      />
      <TouchableOpacity style={styles.searchButton} onPress={searchCharacters}>
        <Text style={styles.searchButtonText}>SEARCH</Text>
      </TouchableOpacity>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Page size:</Text>
        <Picker
          selectedValue={pageSize}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setPageSize(itemValue);
            setCurrentPage(1);
          }}
        >
          <Picker.Item label="25" value={25} />
          <Picker.Item label="50" value={50} />
          <Picker.Item label="100" value={100} />
          <Picker.Item label="150" value={150} />
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <FlatList
            data={paginatedCharacters}
            keyExtractor={(item) => item.name}
            renderItem={renderItem}
            initialNumToRender={10}
            getItemLayout={(data, index) => ({
              length: 70,
              offset: 70 * index,
              index,
            })}
            ListHeaderComponent={
              <View style={styles.tableHeader}>
                <TouchableOpacity onPress={() => sortBy("name")}>
                  <Text style={styles.headerCell}>Name</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sortBy("birth_year")}>
                  <Text style={styles.headerCell}>Birth</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sortBy("eye_color")}>
                  <Text style={styles.headerCell}>Eye color</Text>
                </TouchableOpacity>
              </View>
            }
          />
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[
                styles.button,
                currentPage === 1 && styles.disabledButton,
              ]}
              onPress={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              <Text style={styles.buttonText}>Prev</Text>
            </TouchableOpacity>

            <Text style={styles.paginationText}>
              {currentPage} / {totalPages || 1}
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                currentPage === totalPages && styles.disabledButton,
              ]}
              onPress={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  searchButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
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
    fontWeight: "bold",
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
    fontWeight: "bold",
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
    fontWeight: "bold",
  },
});
