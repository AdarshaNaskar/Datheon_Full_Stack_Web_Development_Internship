import { FiArrowUpRight } from "react-icons/fi";

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <span className="hero-tag">✦ THE NEXT GENERATION OF SHOPPING</span>

        <h1>
          SHOP
          <br />
          BEYOND
          <br />
          <span>ORDINARY.</span>
        </h1>

        <p>
          Discover products that match your lifestyle. From everyday essentials
          to things you never knew you needed.
        </p>

        <a href="#shop" className="hero-button">
          Explore Collection <FiArrowUpRight />
        </a>

        <div className="hero-stats">
          <div>
            <h3>20+</h3>
            <span>Unique Products</span>
          </div>

          <div>
            <h3>4.5★</h3>
            <span>Quality Focused</span>
          </div>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-circle">
          <div className="hero-circle-text">
            NEXORA — STYLE YOUR WORLD — NEXORA —
          </div>

          <div className="hero-product">
            <span>
              YOUR NEXT
              <br />
              FAVORITE
              <br />
              THING.
            </span>
          </div>
        </div>

        <div className="hero-sticker">
          NEW
          <br />
          DROP
        </div>
      </div>
    </section>
  );
}

export default Hero;
