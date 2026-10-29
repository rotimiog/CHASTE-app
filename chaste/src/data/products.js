export const PRODUCTS = [
    {
        id: 1,
        slug: "signature-tee",
        name: "The Standard Tee",
        accent: "#e7a963",
        price: 1500,
        image: "/tees.jpg",
        gallery: [
            { src: "/tees.jpg", name: "Front Studio" },
            { src: "/tees1.jpg", name: "Side Outline" },
            { src: "/tees2.jpg", name: "Back Drop" },
        ],
        description: "A sharp everyday essential with premium cotton comfort and a relaxed CHASTE fit.",
    },
    {
        id: 2,
        slug: "oversized-hoodie",
        name: "Drift Hoodie",
        accent: "#76b5a2",
        price: 3000,
        image: "/hoodie.jpg",
        gallery: [{ src: "/hoodie.jpg", name: "Front Fit" }],
        description: "Heavyweight softness, oversized structure, and a clean silhouette built for all-day wear.",
    },
    {
        id: 3,
        slug: "cargo-pants",
        name: "Urban Utility Pant",
        accent: "#a9b86b",
        price: 2500,
        image: "/cargo.jpg",
        gallery: [{ src: "/cargo.jpg", name: "Utility Front" }],
        description: "Utility-inspired styling with a modern street fit, made for movement and everyday layering.",
    },
    {
        id: 4,
        slug: "logo-cap",
        name: "Monogram Cap",
        accent: "#78a9d2",
        price: 800,
        image: "/cap.jpg",
        gallery: [
            { src: "/cap.jpg", name: "Crown View" },
            { src: "/cap1.jpg", name: "Profile Angle" },
            { src: "/cap2.jpg", name: "Back Panel" },
            { src: "/cap3.jpg", name: "Side Detail" },
            { src: "/cap4.jpg", name: "Monogram Close" },
            { src: "/cap5.jpg", name: "Street Fit" },
            { src: "/cap6.jpg", name: "Low Light Look" },
        ],
        description: "A structured cap with a subtle logo mark and premium streetwear finish.",
    },
    {
        id: 5,
        slug: "tank-top",
        name: "Flow Tank",
        accent: "#d887a4",
        price: 1200,
        image: "/tank.jpg",
        gallery: [{ src: "/tank.jpg", name: "Clean Front" }],
        description: "Minimal but bold, designed for warm days and layered looks with a clean CHASTE edge.",
    },
];

export const POINTS_BALANCE_KEY = "chaste-points-balance";
export const SHOPPING_CART_KEY = "chaste-shopping-cart";
export const PURCHASE_HISTORY_KEY = "chaste-purchase-history";
export const POINTS_PURCHASE_HISTORY_KEY = "chaste-points-purchase-history";
export const PROFILE_KEY = "chaste-profile";
export const LOGGED_IN_USER_KEY = "loggedInUser";

export function isUserLoggedIn() {
    const storedUser = localStorage.getItem(LOGGED_IN_USER_KEY);
    if (storedUser === null) return false;

    try {
        const user = JSON.parse(storedUser);
        return user === true || Boolean(user?.email);
    } catch {
        return storedUser === "true";
    }
}

export function readPointsBalance() {
    const savedBalance = localStorage.getItem(POINTS_BALANCE_KEY);
    return savedBalance === null ? 5000 : Number(savedBalance);
}

export function readShoppingCart() {
    try {
        const cart = JSON.parse(localStorage.getItem(SHOPPING_CART_KEY) || "[]");
        return Array.isArray(cart) ? cart : [];
    } catch {
        return [];
    }
}

export function saveShoppingCart(cart) {
    localStorage.setItem(SHOPPING_CART_KEY, JSON.stringify(cart));
}

export function readStoredList(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value : [];
    } catch {
        return [];
    }
}

export function readProfile() {
    try {
        const profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || "{}");
        return profile && typeof profile === "object" && !Array.isArray(profile) ? profile : {};
    } catch {
        return {};
    }
}

export function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}