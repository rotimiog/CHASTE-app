import SiteNav from "../components/SiteNav";

function About() {
    return (
        <div className="page home-page landing-page brand-page">
            <SiteNav />
            <main className="brand-content about-content">
                <header className="about-heading">
                    <p className="campaign-eyebrow"><span /> THE CHASTE POINT OF VIEW</p>
                    <h1>Less noise.<br /><span>More intention.</span></h1>
                    <p className="about-intro">
                        CHASTE is an independent streetwear label for people who move through the world on their own terms.
                    </p>
                </header>

                <figure className="about-image">
                    <img src="/tees1.jpg" alt="CHASTE streetwear, photographed for the collection" />
                    <figcaption><span>01 / THE EVERYDAY UNIFORM</span><span>CHASTE, EST. 2026</span></figcaption>
                </figure>

                <section className="about-philosophy">
                    <p className="about-section-label">OUR PHILOSOPHY</p>
                    <div>
                        <h2>Wear what<br />moves with you.</h2>
                        <p>
                            We believe the best pieces earn their place in your life. That means considered design, honest materials, and quality you can feel every time you reach for them. No unnecessary noise. Just a better standard for the things you wear every day.
                        </p>
                    </div>
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

export default About;