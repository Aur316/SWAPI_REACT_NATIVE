import React from "react";
import { FlatList } from "react-native";
import { CharacterListProps } from "../types/types";

const CharacterList: React.FC<CharacterListProps> = React.memo(
  ({ characters, renderItem }) => {
    return (
      <FlatList
        data={characters}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
      />
    );
  }
);

export default CharacterList;
