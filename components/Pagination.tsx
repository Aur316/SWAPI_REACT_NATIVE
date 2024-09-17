import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { PaginationProps } from "../types/types";
import { useFont } from "../context/FontContext";

const Pagination: React.FC<PaginationProps> = React.memo(
  ({ currentPage, totalPages, onPageChange }) => {
    const { fontsLoaded } = useFont();

    const prevPage = useCallback(() => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }, [currentPage, onPageChange]);

    const nextPage = useCallback(() => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }, [currentPage, totalPages, onPageChange]);

    if (!fontsLoaded) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.button, currentPage === 1 && styles.disabledButton]}
          onPress={prevPage}
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
          onPress={nextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
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
});

export default Pagination;
