function CategoryFilter({ activeCategory, onCategoryChange }) {
  const categories = ["All", "Electronics", "Jewelery", "Clothing"];

  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          className={
            activeCategory === category ? "filter-btn active" : "filter-btn"
          }
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
