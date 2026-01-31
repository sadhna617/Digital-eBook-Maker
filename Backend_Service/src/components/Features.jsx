const Features = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">

        <div className="row align-items-center mb-5">
          <div className="col-md-6">
            <img
              src="\public\images\3.jpg"
              className="img-fluid rounded shadow"
              alt="customize"
                style={{ width: "400px", height: "400px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6">
            <h3 className="fw-bold">Get Inspired & Accelerate Your Ideas</h3>
            <p className="text-muted mt-3">
              Quickly customize your HTML5 flipbook using built-in templates,
              themes, and scenes. No coding required.
            </p>

            <div className="d-flex gap-2 flex-wrap">
              <span className="badge bg-secondary">Custom Background</span>
              <span className="badge bg-secondary">Table of Contents</span>
              <span className="badge bg-secondary">Bookmarks</span>
              <span className="badge bg-secondary">Voice Assistant</span>
            </div>
          </div>
        </div>

        <div className="row align-items-center">
          <div className="col-md-6">
            <h3 className="fw-bold">Engage Your Audience with Dynamic Content</h3>
            <p className="text-muted mt-3">
              Drag & drop videos, audio, links, images, and animations for
              stronger engagement.
            </p>
          </div>
          <div className="col-md-6">
            <center>
            <img
              src="\public\images\2.webp"
              className="img-fluid rounded shadow"
              alt="dynamic"
                style={{ width: "400px", height: "400px", objectFit: "cover" }}
            />
             </center>
          </div>
        </div>


            <div className="row align-items-center">
        <div className="col-md-6 text-center">
            <img
            src="\public\images\4 (1).png"
            className="img-fluid rounded shadow"
            alt="dynamic"
            style={{ width: "400px", height: "400px", objectFit: "cover" }}
            />
        </div>

        <div className="col-md-6">
            <h3 className="fw-bold">Engage Your Audience with Dynamic Content</h3>
            <p className="text-muted mt-3">
            Drag & drop videos, audio, links, images, and animations for stronger engagement.
            </p>
        </div>
        </div>

   <div className="row align-items-center">
          <div className="col-md-6">
            <h3 className="fw-bold">Engage Your Audience with Dynamic Content</h3>
            <p className="text-muted mt-3">
              Drag & drop videos, audio, links, images, and animations for
              stronger engagement.
            </p>
          </div>
          <div className="col-md-6">
            <center>
            <img
              src="\public\images\4 (2).png"
              className="img-fluid rounded shadow"
              alt="dynamic"
                style={{ width: "400px", height: "400px", objectFit: "cover" }}
            />
             </center>
          </div>
        </div>


      </div>
    </section>
  );
};

export default Features;
