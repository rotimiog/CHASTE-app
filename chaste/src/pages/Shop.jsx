import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SiteNav from "../components/SiteNav";
import { isUserLoggedIn, PRODUCTS, readShoppingCart, saveShoppingCart } from "../data/products";

function Shop() {
    const [cart, setCart] = useState(readShoppingCart);
    const [addedSlug, setAddedSlug] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    function addToCart(product) {
        if (!isUserLoggedIn()) {
            navigate("/signup", { state: { from: location } });
            return;
        }

        const existingItem = cart.find((item) => item.slug === product.slug);
        const updatedCart = existingItem
            ? cart.map((item) => item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item)
            : [...cart, { slug: product.slug, quantity: 1 }];
        setCart(updatedCart);
        saveShoppingCart(updatedCart);
        setAddedSlug(product.slug);
        window.setTimeout(() => setAddedSlug(""), 1400);
    }

    return (
        <div className="page home-page landing-page brand-page">
            <SiteNav />
            <main className="brand-content shop-content">
                <header className="brand-page-heading">
                    <p className="campaign-eyebrow"><span /> CHASTE / THE COLLECTION</p>
                    <h1>Uniform for<br /><span>your own way.</span></h1>
                    <p>Considered essentials. Made for movement, built to stay in rotation.</p>
                </header>

                <section className="shop-grid" aria-label="CHASTE products">
                    {PRODUCTS.map((product, index) => (
                        <article className="shop-card" key={product.id}>
                            <Link to={`/product/${product.slug}`} className="shop-card-image-link" aria-label={`View ${product.name}`}>
                                <div className="shop-card-image-wrap">
                                    <img src={product.image} alt={product.name} className="shop-card-image" />
                                    <span className="shop-card-index">0{index + 1} / 0{PRODUCTS.length}</span>
                                </div>
                            </Link>
                            <div className="shop-card-info">
                                <div>
                                    <p className="shop-card-kicker">CHASTE / ESSENTIALS</p>
                                    <h2><Link to={`/product/${product.slug}`}>{product.name}</Link></h2>
                                </div>
                                <p className="shop-card-price">{product.price.toLocaleString()} <span>PTS</span></p>
                            </div>
                            <button
                                className="shop-add-button"
                                type="button"
                                onClick={() => addToCart(product)}
                                aria-label={`Add ${product.name} to cart`}
                            >
                                {addedSlug === product.slug ? "Added to cart" : "Add to cart"}
                                <span aria-hidden="true">{addedSlug === product.slug ? "✓" : "+"}</span>
                            </button>
                        </article>
                    ))}
                </section>
            </main>
            <footer className="landing-footer">
                <p>Follow the movement</p>
                <div className="landing-socials">
                    <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                    <a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok</a>
                    <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
                </div>
                <p className="landing-copy">© 2026 CHASTE</p>
            </footer>
        </div>
    );
}

export default Shop;