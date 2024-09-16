import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import App from "../App";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("App", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<App />);
    expect(getByPlaceholderText("Character name")).toBeTruthy();
    expect(getByText("SEARCH")).toBeTruthy();
  });

  it("fetches and displays characters on search", async () => {
    const mockData = {
      data: {
        results: [
          {
            name: "Luke Skywalker",
            birth_year: "19BBY",
            eye_color: "blue",
            created: "2014-12-09T13:50:51.644000Z",
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockData);

    const { getByPlaceholderText, getByText, queryByText } = render(<App />);
    const input = getByPlaceholderText("Character name");
    fireEvent.changeText(input, "Luke");
    const button = getByText("SEARCH");
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://swapi.dev/api/people/?search=Luke"
      );
    });

    expect(queryByText("Luke Skywalker")).toBeTruthy();
  });
});
