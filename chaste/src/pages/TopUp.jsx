import { useState } from "react";
import { Link } from "react-router-dom";
import {
    POINTS_BALANCE_KEY,
    POINTS_PURCHASE_HISTORY_KEY,
    readPointsBalance,
} from "../data/products";

const packages = [
    { points: 1000 },
    { points: 2500 },
    { points: 5000 },
];

const formatNaira = (amount) =>
    new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
    }).format(amount);

function TopUp() {
    const [selectedPackage, setSelectedPackage] = useState(packages[0]);
    const [customPoints, setCustomPoints] = useState("");
    const [balance, setBalance] = useState(readPointsBalance);
    const [purchaseComplete, setPurchaseComplete] = useState(false);
    const pointsToBuy = selectedPackage ? selectedPackage.points : Number(customPoints);
    const hasValidAmount = Number.isSafeInteger(pointsToBuy) && pointsToBuy > 0;

    function handlePurchase(event) {
        event.preventDefault();
        if (!hasValidAmount || pointsToBuy > Number.MAX_SAFE_INTEGER - balance) return;

        const purchaseHistory = JSON.parse(localStorage.getItem(POINTS_PURCHASE_HISTORY_KEY) || "[]");
        const purchase = {
            points: pointsToBuy,
            amountNaira: pointsToBuy,
            currency: "NGN",
            purchasedAt: new Date().toISOString(),
        };
        const updatedBalance = balance + pointsToBuy;
        localStorage.setItem(POINTS_BALANCE_KEY, String(updatedBalance));
        localStorage.setItem(POINTS_PURCHASE_HISTORY_KEY, JSON.stringify([...purchaseHistory, purchase]));
        setBalance(updatedBalance);
        setPurchaseComplete(true);
    }

    return (
        <div className="page top-up-page">
            <nav className="nav">
                <h1 className="logo">CHASTE</h1>
                <div className="nav-actions">
                    <Link to="/" className="login-link">Home</Link>
                    <Link to="/account" className="login-link">Back to Account</Link>
                </div>
            </nav>

            <main className="top-up-content">
                <div className="top-up-heading">
                    <p className="eyebrow">Points wallet</p>
                    <h2>Buy points</h2>
                    <p>Choose a package or enter an amount. Each point costs ₦1.</p>
                </div>

                <div className="wallet-balance">
                    <span>Current balance</span>
                    <strong>{balance.toLocaleString()} points</strong>
                </div>

                <form className="top-up-form" onSubmit={handlePurchase}>
                    <fieldset className="package-options">
                        <legend>Select a package</legend>
                        {packages.map((item) => (
                            <label className={`package-option${selectedPackage?.points === item.points ? " is-selected" : ""}`} key={item.points}>
                                <input
                                    type="radio"
                                    name="points-package"
                                    value={item.points}
                                    checked={selectedPackage?.points === item.points}
                                    onChange={() => {
                                        setSelectedPackage(item);
                                        setPurchaseComplete(false);
                                    }}
                                />
                                <span>{item.points.toLocaleString()} points</span>
                                <strong>{formatNaira(item.points)}</strong>
                            </label>
                        ))}
                        <label className={`package-option custom-package${selectedPackage === null ? " is-selected" : ""}`}>
                            <input
                                type="radio"
                                name="points-package"
                                checked={selectedPackage === null}
                                onChange={() => {
                                    setSelectedPackage(null);
                                    setPurchaseComplete(false);
                                }}
                            />
                            <span>Choose your amount</span>
                            <input
                                className="custom-points-input"
                                type="number"
                                min="1"
                                max={Number.MAX_SAFE_INTEGER}
                                step="1"
                                inputMode="numeric"
                                value={customPoints}
                                onFocus={() => setSelectedPackage(null)}
                                onChange={(event) => {
                                    setSelectedPackage(null);
                                    setCustomPoints(event.target.value);
                                    setPurchaseComplete(false);
                                }}
                                placeholder="Enter points"
                                aria-label="Custom points amount"
                            />
                            <strong>{hasValidAmount && selectedPackage === null ? formatNaira(pointsToBuy) : "₦1 per point"}</strong>
                        </label>
                    </fieldset>

                    <div className="top-up-checkout">
                        <div>
                            <span>Amount to add</span>
                            <strong>{hasValidAmount ? `${pointsToBuy.toLocaleString()} points` : "Enter a valid amount"}</strong>
                        </div>
                        <div>
                            <span>Total</span>
                            <strong>{hasValidAmount ? formatNaira(pointsToBuy) : "₦0"}</strong>
                        </div>
                    </div>

                    <button className="buy-btn top-up-submit" type="submit" disabled={!hasValidAmount}>
                        Buy {hasValidAmount ? `${pointsToBuy.toLocaleString()} points` : "points"}
                    </button>

                    {purchaseComplete && (
                        <p className="transfer-status" role="status">
                            {pointsToBuy.toLocaleString()} points added. Your new balance is {balance.toLocaleString()} points.
                        </p>
                    )}
                    <p className="transfer-disclaimer">Demo checkout: this adds points to this browser only. It does not charge real money. Live payments need a payment provider.</p>
                </form>
            </main>
        </div>
    );
}

export default TopUp;