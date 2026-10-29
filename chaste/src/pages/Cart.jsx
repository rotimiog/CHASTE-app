import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    POINTS_BALANCE_KEY,
    PRODUCTS,
    PURCHASE_HISTORY_KEY,
    readPointsBalance,
    isUserLoggedIn,
    readShoppingCart,
    saveShoppingCart,
} from "../data/products";

function Cart() {
    const location = useLocation();
    const navigate = useNavigate();
    const [cart, setCart] = useState(readShoppingCart);
    const [balance, setBalance] = useState(readPointsBalance);
    const [receipt, setReceipt] = useState(null);
    const [checkoutError, setCheckoutError] = useState("");
    const items = cart
        .map((cartItem) => {
            const product = PRODUCTS.find((item) => item.slug === cartItem.slug);
            return product ? { ...product, quantity: cartItem.quantity } : null;
        })
        .filter(Boolean);
    const totalPoints = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    function updateCart(updatedCart) {
        setCart(updatedCart);
        saveShoppingCart(updatedCart);
        setCheckoutError("");
    }

    function changeQuantity(slug, quantity) {
        if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) return;
        updateCart(cart.map((item) => item.slug === slug ? { ...item, quantity } : item));
    }

    function removeItem(slug) {
        updateCart(cart.filter((item) => item.slug !== slug));
    }

    function confirmPurchase() {
        if (!isUserLoggedIn()) {
            navigate("/signup", { state: { from: location } });
            return;
        }

        if (totalPoints > balance) {
            setCheckoutError("You do not have enough points for this purchase. Remove an item or top up your points.");
            return;
        }
        if (totalPoints < 1) return;

        const completedPurchase = {
            items: items.map(({ slug, name, price, quantity }) => ({ slug, name, price, quantity })),
            totalPoints,
            purchasedAt: new Date().toISOString(),
        };
        let purchaseHistory = [];
        try {
            purchaseHistory = JSON.parse(localStorage.getItem(PURCHASE_HISTORY_KEY) || "[]");
            if (!Array.isArray(purchaseHistory)) purchaseHistory = [];
        } catch {
            purchaseHistory = [];
        }

        const updatedBalance = balance - totalPoints;
        localStorage.setItem(POINTS_BALANCE_KEY, String(updatedBalance));
        localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify([...purchaseHistory, completedPurchase]));
        saveShoppingCart([]);
        setBalance(updatedBalance);
        setCart([]);
        setReceipt(completedPurchase);
        setCheckoutError("");
    }

    return (
        <div className="page cart-page">
            <nav className="nav">
                <h1 className="logo">CHASTE</h1>
                <div className="nav-actions">
                    <Link to="/" className="login-link">Home</Link>
                    <Link to="/account" className="login-link">Account</Link>
                </div>
            </nav>

            <main className="cart-content">
                {receipt ? (
                    <section className="checkout-result" role="status">
                        <p className="eyebrow">Purchase complete</p>
                        <h2>Your order is confirmed</h2>
                        <p>{receipt.totalPoints.toLocaleString()} points were deducted from your balance.</p>
                        <p className="balance">Points remaining: <strong>{balance.toLocaleString()}</strong></p>
                        <Link className="cta" to="/account">Continue shopping</Link>
                    </section>
                ) : (
                    <>
                        <div className="cart-heading">
                            <div>
                                <p className="eyebrow">Your selection</p>
                                <h2>Shopping Cart</h2>
                                <Link className="cart-back-link" to="/account">Back to shop</Link>
                            </div>
                            <div className="cart-heading-actions">
                                <p className="cart-balance">Available points <strong>{balance.toLocaleString()}</strong></p>
                                {items.length > 0 && (
                                    <button className="clear-cart" type="button" onClick={() => updateCart([])}>
                                        Clear cart
                                    </button>
                                )}
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <section className="empty-cart">
                                <h3>Your cart is empty</h3>
                                <p>Choose an item and add it here to pay with points.</p>
                                <Link className="cta" to="/account">Browse items</Link>
                            </section>
                        ) : (
                            <div className="cart-layout">
                                <section className="cart-items" aria-label="Items in cart">
                                    {items.map((item) => (
                                        <article className="cart-item" key={item.slug}>
                                            <img src={item.image} alt={item.name} />
                                            <div className="cart-item-info">
                                                <h3>{item.name}</h3>
                                                <p>{item.price.toLocaleString()} pts each</p>
                                                <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                                                    <button type="button" onClick={() => changeQuantity(item.slug, item.quantity - 1)} aria-label={`Remove one ${item.name}`}>−</button>
                                                    <input
                                                        className="quantity-input"
                                                        type="number"
                                                        min="1"
                                                        max="99"
                                                        step="1"
                                                        value={item.quantity}
                                                        aria-label={`Quantity for ${item.name}`}
                                                        onChange={(event) => changeQuantity(item.slug, Number(event.target.value))}
                                                    />
                                                    <button type="button" onClick={() => changeQuantity(item.slug, item.quantity + 1)} aria-label={`Add one ${item.name}`}>+</button>
                                                </div>
                                            </div>
                                            <div className="cart-item-total">
                                                <strong>{(item.price * item.quantity).toLocaleString()} pts</strong>
                                                <button className="remove-item" type="button" onClick={() => removeItem(item.slug)}>Remove</button>
                                            </div>
                                        </article>
                                    ))}
                                </section>

                                <aside className="checkout-summary">
                                    <h3>Pay with points</h3>
                                    <div><span>Items</span><span>{totalItems}</span></div>
                                    <div><span>Total</span><strong>{totalPoints.toLocaleString()} pts</strong></div>
                                    <div><span>After purchase</span><strong>{Math.max(0, balance - totalPoints).toLocaleString()} pts</strong></div>
                                    {checkoutError && <p className="checkout-error" role="alert">{checkoutError}</p>}
                                    {totalPoints > balance && (
                                        <>
                                            <p className="checkout-error" role="alert">Your cart costs more points than your current balance.</p>
                                            <Link className="top-up-shortcut" to="/points/top-up">Top up points</Link>
                                        </>
                                    )}
                                    <button
                                        className="buy-btn checkout-button"
                                        type="button"
                                        onClick={confirmPurchase}
                                        disabled={totalPoints > balance}
                                    >
                                        Confirm purchase
                                    </button>
                                </aside>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default Cart;