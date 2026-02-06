import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EbookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);

  useEffect(() => {
    fetchEbook();
  }, []);

  const fetchEbook = async () => {
    try {
      const res = await api.get(`/api/ebooks/${id}`);
      setEbook(res.data);
    } catch (err) {
      alert("Failed to load ebook");
    }
  };

  if (!ebook) return <p className="text-center mt-5">Loading eBook...</p>;

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card shadow-lg p-4">
        <h2 className="fw-bold">{ebook.title}</h2>
        <p className="text-muted">by {ebook.author}</p>

        <hr />

        <h5>Description</h5>
        <p>{ebook.description || "No description available."}</p>

        <hr />

        {/* CHAPTERS CONTENT */}
        <div className="mt-4">
          <h5 className="mb-3">📚 Chapters</h5>

          {ebook.chapters && ebook.chapters.length > 0 ? (
            ebook.chapters.map((chapter, index) => (
              <div key={index} className="mb-4 p-4 border rounded bg-light">
                <h6 className="fw-bold text-primary">
                  {chapter.title || `Chapter ${index + 1}`}
                </h6>
                <div
                  className="mt-3"
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.8",
                    fontSize: "16px"
                  }}
                  dangerouslySetInnerHTML={{ __html: chapter.content || "No content available." }}
                />

                {/* CHAPTER IMAGES */}
                {chapter.images && chapter.images.length > 0 && (
                  <div className="mt-3">
                    {chapter.images.map((img, imgIndex) => (
                      <div key={imgIndex} className="text-center my-3">
                        <img
                          src={img.url}
                          alt={img.caption || `Image ${imgIndex + 1}`}
                          className="img-fluid rounded shadow-sm"
                          style={{ maxWidth: "100%" }}
                        />
                        {img.caption && (
                          <p className="text-muted small mt-2">{img.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 border rounded bg-light text-center text-muted">
              <p>No chapters available for this book yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EbookReader;
