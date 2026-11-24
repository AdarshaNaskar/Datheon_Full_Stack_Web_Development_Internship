import {
  FiX,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowRight,
} from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { convertToINR, formatRupees } from "../utils/currency";

function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, calculateTotal } = useCart();

  const totals = calculateTotal();

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <div>
            <span className="section-tag">YOUR SELECTION</span>
            <h2>
              YOUR CART<span>.</span>
            </h2>
          </div>

          <button className="close-cart" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingBag />
            <h3>Your cart is empty.</h3>
            <p>Looks like you haven't added anything yet.</p>

            <button onClick={onClose}>
              Explore Products <FiArrowRight />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="cart-item-details">
                    <h3>{item.title}</h3>

                    <p className="cart-item-price">
                      {formatRupees(convertToINR(item.price))}
                    </p>

                    <div className="cart-item-actions">
                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                          aria-label="Decrease quantity"
                        >
                          <FiMinus />
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <button
                        className="remove-item"
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove product"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatRupees(totals.subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>{formatRupees(totals.tax)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {totals.shipping === 0
                    ? "FREE"
                    : formatRupees(totals.shipping)}
                </span>
              </div>

              <div className="summary-total">
                <span>Total</span>
                <h3>{formatRupees(totals.total)}</h3>
              </div>

              <button
                className="checkout-button"
                onClick={() => alert("Checkout coming soon!")}
              >
                Proceed to Checkout <FiArrowRight />
              </button>

              <button className="continue-shopping" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
