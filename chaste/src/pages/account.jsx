import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PRODUCTS,
  PROFILE_KEY,
  readPointsBalance,
  readShoppingCart,
} from "../data/products";

function Account() {
  const location = useLocation();
  const [points] = useState(readPointsBalance);
  const [cartCount] = useState(() => readShoppingCart().reduce((sum, item) => sum + item.quantity, 0));
  const [profile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}") || {};
    } catch {
      return {};
    }
  });

  return (
    <div className="page account-page">
      <nav className="nav">
        <h1 className="logo">CHASTE</h1>
        <div className="nav-actions">
          <Link to="/" className="login-link">Home</Link>
          <Link to="/points/top-up" className="login-link">Buy Points</Link>
          <Link to="/account/details" className="login-link">My Details</Link>
          <Link to="/account/history" className="login-link">Purchase History</Link>
          <Link to="/cart" className="login-link">Cart ({cartCount})</Link>
        </div>
      </nav>

      <div className="account-header">
        <p className="eyebrow">CHASTE member space</p>
        <h2>Welcome back{profile.name || location.state?.welcomeName ? `, ${profile.name || location.state.welcomeName}` : ""}</h2>
        <p className="balance">
          You have <strong>{points.toLocaleString()}</strong> points
        </p>
        <Link className="account-primary-action" to="/points/top-up">Add points</Link>
      </div>

      <section className="account-toolkit" aria-label="Account information">
        <div className="account-panel profile-panel">
          <div className="panel-heading">
            <p className="eyebrow">Account settings</p>
            <h3>My Details</h3>
          </div>
          <p className="history-empty">View and update your name, email, and contact number.</p>
          <Link className="account-secondary-action" to="/account/details">Edit my details</Link>
        </div>

        <div className="account-panel history-panel">
          <div className="panel-heading">
            <p className="eyebrow">Orders and wallet</p>
            <h3>Purchase history</h3>
          </div>
          <p className="history-empty">See completed item purchases and points top-ups.</p>
          <Link className="account-secondary-action" to="/account/history">View purchase history</Link>
        </div>

        <div className="account-panel recovery-panel">
          <div className="panel-heading">
            <p className="eyebrow">Sign-in recovery</p>
            <h3>Security question</h3>
          </div>
          <p className="history-empty">
            {profile.security_question || "No security question is saved on this profile."}
          </p>
          <p className="recovery-note">Your answer is stored securely and is never shown here.</p>
        </div>
      </section>

      <section className="products">
        <h3>Spend Your Points</h3>
        <div className="product-list">
          {PRODUCTS.map((p, index) => (
            <article
              key={p.id}
              className="product-row"
              style={{ "--item-accent": p.accent, "--item-delay": `${index * 70}ms` }}
            >
              <img src={p.image} alt={p.name} className="product-row-image" />
              <div className="product-row-copy">
                <p className="product-kicker">CHASTE / {String(index + 1).padStart(2, "0")}</p>
                <h4>{p.name}</h4>
                <p className="product-description">{p.description}</p>
                <p className="product-price">{p.price.toLocaleString()} pts</p>
                <Link className="buy-btn" to={`/product/${p.slug}`}>
                  View item
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Account;