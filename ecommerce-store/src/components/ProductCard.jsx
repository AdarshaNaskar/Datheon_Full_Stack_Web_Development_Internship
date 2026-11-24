import { FiShoppingBag, FiArrowUpRight } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { formatINR } from "../utils/currency";

function ProductCard({ product }) {
  const { title, price, image, category, rating } = product;

  const { addToCart } = useCart();

  const badge =
    rating.rate >= 4.5 ? "TOP RATED" : rating.count >= 100 ? "POPULAR" : null;

  return (
    <div className="product-card">
      <div className="product-image-container">
        {badge && <span className="product-badge">{badge}</span>}

        <img src={image} alt={title} className="product-image" />

        <button
          className="quick-add"
          onClick={() => addToCart(product)}
          aria-label={`Add ${title} to cart`}
        >
          <FiShoppingBag />
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">{category}</span>

        <h3>{title}</h3>

        <div className="product-rating">
          <span>★ {rating.rate}</span>
          <span>({rating.count} reviews)</span>
        </div>

        <div className="product-bottom">
          <h4>{formatINR(price)}</h4>

          <button className="product-add" onClick={() => addToCart(product)}>
            Add to Cart <FiArrowUpRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
