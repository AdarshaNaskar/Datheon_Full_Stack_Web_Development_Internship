import "./App.css";

import { useState, useMemo } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import CategoryFilter from "./components/CategoryFilter";
import SearchBar from "./components/SearchBar";
import CartDrawer from "./components/CartDrawer";

import useProducts from "./hooks/useProducts";

function App() {
  const { products, loading, error } = useProducts();

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        activeCategory === "All" ||
        (activeCategory === "Clothing"
          ? product.category.includes("clothing")
          : product.category.toLowerCase() === activeCategory.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [products, activeCategory, searchTerm]);

  return (
    <>
      <Navbar onCartClick={() => setIsCartOpen(true)} />

      <Hero />

      <section className="shop-section" id="shop">
        <div className="shop-heading">
          <div>
            <span className="section-tag">✦ CURATED FOR YOU</span>
            <h2>
              THE COLLECTION<span>.</span>
            </h2>
          </div>

          <p>Find your next favorite thing.</p>
        </div>

        <div className="shop-controls">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="product-count">
          SHOWING {filteredProducts.length} PRODUCTS
        </div>

        {loading && <p>Loading products...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && filteredProducts.length > 0 && (
          <ProductGrid products={filteredProducts} />
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="empty-results">
            No products found. Try another search.
          </p>
        )}
      </section>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default App;
