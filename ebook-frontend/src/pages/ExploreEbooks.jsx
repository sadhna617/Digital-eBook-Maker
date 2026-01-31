import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExploreEbooks } from "../api/ebookApi";
import "../styles/exploreEbook.css";


const ExploreEbooks = () => {
  const [ebooks, setEbooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEbooks();
  }, []);

  const fetchEbooks = async () => {
    try {
      const res = await getExploreEbooks();
      setEbooks(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load ebooks");
    }
  };

  return (
    <div className="container mt-4">

      {/*  BACK TO DASHBOARD */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          borderRadius: "6px",
          border: "none",
          background: "#6c63ff",
          color: "white",
          cursor: "pointer"
        }}
      >
        ← Back to Dashboard
      </button>

      <h3 className="fw-bold mb-4">📚 Explore eBooks</h3>

      <div className="row">
        {ebooks.map((book) => (
          <div className="col-md-3 mb-4" key={book.id}>
            <div className="card h-100 shadow-sm ebook-card">

              <img
                src={
                  book.coverImageUrl ||
                  "https://via.placeholder.com/200x260?text=eBook"
                }
                className="card-img-top"
                alt="ebook"
              />

              <div className="card-body">
                <h6 className="fw-bold">
                  {book.title || "Untitled eBook"}
                </h6>

                <p className="text-muted small">
                  {book.author || "Unknown Author"}
                </p>

                {/* READ + DOWNLOAD */}
                <div className="d-flex justify-content-between mt-3">

                  {/*  READ → ONLY THIS OPENS READER */}
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate(`/ebooks/${book.id}`)}
                  >
                    📖 Read
                  </button>

                  {/* DOWNLOAD */}
                  <a
                    href={book.pdfUrl || book.epubUrl}
                    className="btn btn-outline-success btn-sm"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ⬇ Download
                  </a>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreEbooks;
