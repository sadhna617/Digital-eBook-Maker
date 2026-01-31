const Footer = () => {
  return (
    <footer className="footer bg-dark text-light pt-5">
      <div className="container">

        <div className="row">

          {/* Brand */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">📘 AI eBook Creator</h5>
            <p className="text-muted mt-3">
              Create, design, and publish professional eBooks using AI-powered
              tools — faster than ever.
            </p>
          </div>

          {/* Product */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Product</h6>
            <ul className="list-unstyled mt-3">
              <li><a href="#" className="footer-link">Features</a></li>
              <li><a href="#" className="footer-link">Pricing</a></li>
              <li><a href="#" className="footer-link">Templates</a></li>
              <li><a href="#" className="footer-link">Examples</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Company</h6>
            <ul className="list-unstyled mt-3">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Support</h6>
            <ul className="list-unstyled mt-3">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Documentation</a></li>
              <li><a href="#" className="footer-link">Privacy Policy</a></li>
              <li><a href="#" className="footer-link">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-bold">Newsletter</h6>
            <p className="text-muted small mt-3">
              Get product updates & tips.
            </p>
            <input
              type="email"
              className="form-control form-control-sm mb-2"
              placeholder="Email address"
            />
            <button className="btn btn-primary btn-sm w-100">
              Subscribe
            </button>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-0 text-muted small">
            © {new Date().getFullYear()} AI eBook Creator. All rights reserved.
          </p>

          <div className="d-flex gap-3">
            <a href="#" className="footer-link">Facebook</a>
            <a href="#" className="footer-link">Twitter</a>
            <a href="#" className="footer-link">LinkedIn</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
