import { FiSearch } from "react-icons/fi";

function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="search-container">
      <FiSearch />

      <input
        type="text"
        placeholder="Search your next favorite thing..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;
