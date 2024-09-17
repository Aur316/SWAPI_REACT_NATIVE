import { useState, useCallback } from "react";
import axios from "axios";
import { Character } from "../types/types";

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const searchCharacters = useCallback(
    async (searchQuery: string, page: number, pageSize: number) => {
      setLoading(true);
      setError(null);
      let apiURL = searchQuery
        ? `https://swapi.dev/api/people/?search=${searchQuery}&page=${page}`
        : `https://swapi.dev/api/people/?page=${page}`;

      try {
        const response = await axios.get(apiURL);
        const results = response.data.results as Character[];

        if (results.length === 0) {
          setError("No characters found.");
          setCharacters([]);
          setTotalPages(1);
          return;
        }

        const count = response.data.count;
        const totalPages = Math.ceil(count / pageSize);

        const blueEyedCharacters = results
          .filter((char) => char.eye_color.includes("blue"))
          .sort((a, b) => a.name.localeCompare(b.name));

        const otherCharacters = results
          .filter((char) => !char.eye_color.includes("blue"))
          .sort(
            (a, b) =>
              new Date(a.created).getTime() - new Date(b.created).getTime()
          );

        setCharacters([...blueEyedCharacters, ...otherCharacters]);
        setTotalPages(totalPages);
      } catch (error: any) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("No characters found.");
          } else if (error.response.status === 500) {
            setError("Server error. Please try again later.");
          } else {
            setError("Unexpected error. Please try again.");
          }
        } else if (error.request) {
          setError("Network error. Please check your internet connection.");
        } else {
          setError("An error occurred. Please try again.");
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { characters, loading, error, totalPages, searchCharacters };
}
