import { useEffect, useState } from "react";
import SiteNav from "../components/SiteNav";
import { PRODUCTS } from "../data/products";

const campaignSlides = PRODUCTS.map((product) => ({
  src: product.image,
  alt: product.name,
  name: product.name,
  detail: product.description,
}));

function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % campaignSlides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="page home-page landing-page brand-page">
      <SiteNav />

      <main className="campaign-hero" id="home">
        <div className="campaign-image" aria-label="CHASTE collection imagery">
          {campaignSlides.map((slide, index) => (
            <img
              key={slide.src}
              className={index === activeSlide ? "campaign-slide is-active" : "campaign-slide"}
              src={slide.src}
              alt={slide.alt}
              aria-hidden={index !== activeSlide}
            />
          ))}
          <div className="campaign-image-shade" />
        </div>

        <section className="campaign-copy" aria-live="polite">
          <p className="campaign-eyebrow"><span /> INDEPENDENT STREETWEAR · EST. 2026</p>
          <h1>Wear the<br /><span>Standard.</span></h1>
          <p className="campaign-description">
            Clean cuts. Real quality. No noise.
            <span>For people who move with intention.</span>
          </p>
          <div className="campaign-current-item">
            <span className="campaign-rule" />
            <div>
              <span className="campaign-item-label">NOW IN FRAME</span>
              <p>{campaignSlides[activeSlide].name}</p>
            </div>
            <span className="campaign-counter">0{activeSlide + 1} <i>/</i> 0{campaignSlides.length}</span>
          </div>
        </section>

        <div className="campaign-controls" role="group" aria-label="Choose campaign image">
          {campaignSlides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className={index === activeSlide ? "campaign-indicator is-active" : "campaign-indicator"}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show ${slide.name}`}
              aria-pressed={index === activeSlide}
            />
          ))}
        </div>

        <p className="campaign-side-note">MADE TO MOVE / BUILT TO LAST</p>
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

export default Home;