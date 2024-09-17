export interface Character {
  name: string;
  birth_year: string;
  eye_color: string;
  created?: string;
}
export interface CharacterListProps {
  characters: Character[];
  renderItem: ({
    item,
    index,
  }: {
    item: Character;
    index: number;
  }) => JSX.Element;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
