import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="hero-section py-5">
      <div className="container">
        <div className="row align-items-center">

          {/* LEFT */}
          <div className="col-md-6">
            <h1 className="fw-bold display-5 mt-3">
              From Idea to Ebook <br />
              <span className="text-primary">-Made Simple-</span>
            </h1>

            <p className="text-muted mt-3">
              Use intelligent tools to craft well-designed ebooks that are ready
              to share, sell, or publish in just a few steps.
            </p>
          </div>

          {/* RIGHT */}
          <div className="col-md-6 text-center">
            <img
              src="/images/1.jpg"
              className="img-fluid rounded shadow"
              alt="ebook preview"
              style={{ width: "400px", height: "400px", objectFit: "cover" }}
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
