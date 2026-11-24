import { FiShoppingBag, FiArrowUpRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";

function Navbar({ onCartClick }) {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <a href="/" className="logo">
        NEX<span>ORA.</span>
      </a>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#shop">Shop</a>
        <a href="#about">About</a>
      </div>

      <div className="nav-actions">
        <button
          className="cart-button"
          onClick={onCartClick}
          aria-label="Open shopping cart"
        >
          <FiShoppingBag />
          <span>{cartCount}</span>
        </button>

        <button className="nav-cta">
          Explore Store <FiArrowUpRight />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
