import { Link } from "react-router-dom";
import {
    POINTS_PURCHASE_HISTORY_KEY,
    PURCHASE_HISTORY_KEY,
    readStoredList,
} from "../data/products";

const dateFormatter = new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
});

function PurchaseHistory() {
    const itemOrders = readStoredList(PURCHASE_HISTORY_KEY).map((order) => ({
        ...order,
        kind: "items",
    }));
    const pointsOrders = readStoredList(POINTS_PURCHASE_HISTORY_KEY).map((order) => ({
        ...order,
        kind: "points",
    }));
    const history = [...itemOrders, ...pointsOrders].sort(
        (first, second) => new Date(second.purchasedAt) - new Date(first.purchasedAt),
    );

    return (
        <div className="page account-page">
            <nav className="nav">
                <h1 className="logo">CHASTE</h1>
                <div className="nav-actions">
                    <Link to="/" className="login-link">Home</Link>
                    <Link to="/account" className="login-link">Account</Link>
                </div>
            </nav>

            <main className="account-subpage history-page">
                <header className="subpage-heading">
                    <p className="eyebrow">Your activity</p>
                    <h2>Purchase History</h2>
                    <p>Review item purchases and points added to your wallet.</p>
                </header>

                {history.length === 0 ? (
                    <section className="history-empty-state">
                        <h3>No purchases yet</h3>
                        <p>Completed item purchases and demo points top-ups will appear here.</p>
                        <Link className="account-primary-action" to="/account">Browse items</Link>
                    </section>
                ) : (
                    <div className="full-history-list">
                        {history.map((entry, index) => (
                            <article className={`full-history-entry ${entry.kind}`} key={`${entry.kind}-${entry.purchasedAt}-${index}`}>
                                <div className="history-entry-heading">
                                    <span className="history-type">{entry.kind === "items" ? "Item purchase" : "Points top-up"}</span>
                                    <time dateTime={entry.purchasedAt}>
                                        {dateFormatter.format(new Date(entry.purchasedAt))}
                                    </time>
                                </div>
                                <div className="history-entry-detail">
                                    <div>
                                        {entry.kind === "items" ? (
                                            <ul>
                                                {entry.items.map((item) => (
                                                    <li key={item.slug}>{item.name} <span>× {item.quantity}</span></li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>{entry.points.toLocaleString()} points added · ₦{entry.amountNaira.toLocaleString()}</p>
                                        )}
                                    </div>
                                    <strong className={entry.kind === "items" ? "points-out" : "points-in"}>
                                        {entry.kind === "items" ? "−" : "+"}{entry.kind === "items" ? entry.totalPoints : entry.points} pts
                                    </strong>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                <p className="local-data-note">History is temporarily stored in this browser. It will be ready to connect to your database later.</p>
            </main>
        </div>
    );
}

export default PurchaseHistory;
