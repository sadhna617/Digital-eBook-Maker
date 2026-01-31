const Examples = () => {
  const examplesData = [
    {
      title: "Restaurant Menu Guide",
      image: "/images/4 (4).png",
    },
    {
      title: "Creative Design Portfolio",
      image: "/images/4 (5).png",
    },
    {
      title: "Academic Information Book",
      image: "/images/4 (6).png",
    },
    {
      title: "Product Launch Handbook",
      image: "/images/4 (7).png",
    },
  ];

  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="fw-bold mb-4">Digital Content Gallery</h2>

        {/* Tabs */}
        <ul className="nav nav-pills justify-content-center mb-4">
          <li className="nav-item">
            <button className="nav-link active">Business Guides</button>
          </li>
          <li className="nav-item">
            <button className="nav-link">Online Magazines</button>
          </li>
          <li className="nav-item">
            <button className="nav-link">Product Showcases</button>
          </li>
          <li className="nav-item">
            <button className="nav-link">Study Resources</button>
          </li>
        </ul>

        {/* Cards */}
        <div className="row g-4">
          {examplesData.map((item, i) => (
            <div className="col-md-3" key={i}>
              <div className="card shadow-sm h-100">
                <img
                  src={item.image}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body">
                  <h6 className="fw-bold">{item.title}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-dark mt-4 px-5 rounded-pill">
          Explore More
        </button>
      </div>
    </section>
  );
};

export default Examples;
