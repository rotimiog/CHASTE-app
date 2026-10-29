import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { isUserLoggedIn, PRODUCTS, readShoppingCart, saveShoppingCart } from "../data/products";

function Product() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const product = PRODUCTS.find((item) => item.slug === slug);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [slug]);

    function addToCart() {
        if (!isUserLoggedIn()) {
            navigate("/signup", { state: { from: location } });
            return;
        }

        const cart = readShoppingCart();
        const existingItem = cart.find((item) => item.slug === product.slug);
        const updatedCart = existingItem
            ? cart.map((item) => item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item)
            : [...cart, { slug: product.slug, quantity: 1 }];
        saveShoppingCart(updatedCart);
        navigate("/cart");
    }

    if (!product) {
        return (
            <div className="page product-detail-page product-not-found-page">
                <nav className="nav">
                    <h1 className="logo">CHASTE</h1>
                    <div className="nav-actions">
                        <Link to="/" className="login-link">Home</Link>
                        <Link to="/account" className="login-link">Back</Link>
                    </div>
                </nav>
                <div className="account-header">
                    <h2>Product not found</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="page product-detail-page">
            <nav className="nav">
                <h1 className="logo">CHASTE</h1>
                <div className="nav-actions">
                    <Link to="/" className="login-link">Home</Link>
                    <Link to="/account" className="login-link">Back to Account</Link>
                </div>
            </nav>

            <div className="product-detail">
                <div className="detail-gallery">
                    <img
                        src={product.gallery[selectedImageIndex].src}
                        alt={`${product.name} - ${product.gallery[selectedImageIndex].name}`}
                        className="detail-image main-image"
                    />
                    <span className="detail-label selected-image-label">
                        {product.gallery[selectedImageIndex].name}
                    </span>
                    {product.gallery.length > 1 && (
                        <div className="detail-thumbnails" aria-label={`${product.name} images`}>
                            {product.gallery.map((image, index) => (
                                <button
                                    key={`${product.slug}-${image.src}`}
                                    type="button"
                                    className={`thumbnail-button${selectedImageIndex === index ? " is-selected" : ""}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                    aria-label={`Show ${image.name}`}
                                    aria-pressed={selectedImageIndex === index}
                                >
                                    <img src={image.src} alt="" className="thumbnail-image" />
                                    <span>{image.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <p className="eyebrow">Item</p>
                    <h2>{product.name}</h2>
                    <p className="detail-price">{product.price.toLocaleString()} pts</p>
                    <p className="detail-desc">{product.description}</p>
                    <button className="cta" type="button" onClick={addToCart}>
                        Confirm Purchase
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Product;
