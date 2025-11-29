import { Helmet } from "react-helmet-async";

const HomePage = () => (
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>CodeNodeX Hosting</title>
      <style>{`
    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0 }
    body { background: #0f172a; color: #ffffff; font-family: sans-serif; }
    img, picture { display: block; max-width: 100%; height: auto; }
    a { color: #06b6d4; text-decoration: none; }
    .hero-section {
      position: relative;
      width: 100%;
      min-height: 75vh;
      background-position: center;
      background-size: cover;
    }
    .hero-overlay {
      position: absolute; inset: 0;
      background: rgba(15,23,42,0.85);
    }
    .hero-content {
      position: relative;
      z-index: 1;
      padding: 80px 20px;
      text-align: center;
    }
    .hero-content h1 {
      font-size: 2.8rem;
      margin-bottom: 16px;
    }
    .hero-content p {
      font-size: 1.2rem;
      margin-bottom: 24px;
    }
    .features-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      justify-content: center;
      padding: 40px 20px;
    }
    .feature {
      width: 120px;
      text-align: center;
      color: #fff;
    }
    .feature img {
      border-radius: 12px;
    }
    .feature p {
      margin-top: 8px;
      font-size: 0.95rem;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 24px;
      padding: 40px 20px;
    }
    .card {
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      color: #fff;
      text-align: center;
    }
    .card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .card-content {
      padding: 16px;
    }
    .card-content h3 {
      margin-bottom: 8px;
      font-size: 1.25rem;
    }
    .card-content p {
      font-size: 0.95rem;
      opacity: 0.85;
    }
  `}</style>
    </Helmet>

    <div
      className="hero-section"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&auto=format&fm=webp')",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Start My Server in 10 Seconds</h1>
        <p>Your game hosting, redefined — fast, reliable, scalable.</p>
        <a href="/order">Get Started →</a>
      </div>
    </div>

    <div className="features-grid">
      <div className="feature">
        <picture>
          <source
            srcSet="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fm=webp"
            type="image/webp"
          />
          <source
            srcSet="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fm=jpg"
            type="image/jpeg"
          />
          <img
            src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&q=80"
            alt="NVMe SSD Storage"
            loading="lazy"
            width="80"
            height="80"
            style={{ objectFit: "cover", borderRadius: "12px" }}
          />
        </picture>
        <p>NVMe SSD Storage</p>
      </div>

      <div className="feature">
        <picture>
          <source
            srcSet="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fm=webp"
            type="image/webp"
          />
          <source
            srcSet="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fm=jpg"
            type="image/jpeg"
          />
        <img
          src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80"
          alt="Global Network"
          loading="lazy"
          width="120"
          height="120"
          style={{ objectFit: "cover", borderRadius: "12px", opacity: 0.8 }}
        />
        </picture>
        <p>Global POPs</p>
      </div>

      <div className="feature">
        <img
          src="https://illustrations.popsy.co/amber/rocket-launch.svg"
          alt="Fast Deployment"
          loading="lazy"
          width="64"
          height="64"
        />
        <p>Start in 10s</p>
      </div>

      <div className="feature">
        <picture>
          <source
            srcSet="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fm=webp"
            type="image/webp"
          />
          <source
            srcSet="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fm=jpg"
            type="image/jpeg"
          />
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80"
            alt="AI Monitoring"
            loading="lazy"
            width="80"
            height="80"
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
        </picture>
        <p>AI HealthGuard</p>
      </div>

      <div className="feature">
        <img
          src="https://illustrations.popsy.co/amber/one-click.svg"
          alt="1-Click Mod Installer"
          loading="lazy"
          width="64"
          height="64"
        />
        <p>1-Click Mods</p>
      </div>

      <div className="feature">
        <img
          src="https://illustrations.popsy.co/amber/shield-security.svg"
          alt="DDoS Protection"
          loading="lazy"
          width="64"
          height="64"
        />
        <p>Advanced DDoS</p>
      </div>
    </div>

    <div className="cards-grid">
      <div className="card">
        <picture>
          <source
            srcSet="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=1200&auto=format&fm=webp"
            type="image/webp"
          />
          <source
            srcSet="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=1200&auto=format&fm=jpg"
            type="image/jpeg"
          />
          <img
            src="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80"
            alt="Minecraft Hosting"
            loading="lazy"
          />
        </picture>
        <div className="card-content">
          <h3>Minecraft Hosting</h3>
          <p>Java & Bedrock Editions</p>
        </div>
      </div>

      <div className="card">
        <picture>
          <source
            srcSet="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fm=webp"
            type="image/webp"
          />
          <source
            srcSet="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&auto=format&fm=jpg"
            type="image/jpeg"
          />
          <img
            src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80"
            alt="Game Servers"
            loading="lazy"
          />
        </picture>
        <div className="card-content">
          <h3>Game Servers</h3>
          <p>Valheim · Rust · ARK · Palworld & More</p>
        </div>
      </div>

      <div className="card">
        <picture>
          <source
            srcSet="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fm=webp"
            type="image/webp"
          />
          <source
            srcSet="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&auto=format&fm=jpg"
            type="image/jpeg"
          />
          <img
            src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80"
            alt="Voice Servers"
            loading="lazy"
          />
        </picture>
        <div className="card-content">
          <h3>Voice Servers</h3>
          <p>TS3 · Mumble · Discord Bot Hosting</p>
        </div>
      </div>

      <div className="card">
        <img
          src="https://illustrations.popsy.co/amber/web-development.svg"
          alt="Web Hosting"
          loading="lazy"
          style={{ objectFit: "contain", padding: "20px" }}
        />
        <div className="card-content">
          <h3>Web Hosting</h3>
          <p>Shared & WordPress Hosting</p>
        </div>
      </div>
    </div>
  </>
);

export default HomePage;
