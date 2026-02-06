import { useNavigate } from "react-router-dom";
import { FaCompass, FaPlus, FaBookOpen, FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BookCard from "../components/BookCard";
import api from "../api/axios";



// API
import { getMyEbooks, uploadBookCover } from "../api/ebookApi";

import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" | "my-books"
  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  // Derived state
  const draftBooks = myBooks.filter(b => !b.published);
  const publishedBooks = myBooks.filter(b => b.published);

  // ================= LOAD USER & BOOKS =================
  const fetchMyEbooks = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyEbooks();
      setMyBooks(res.data || []);
    } catch (err) {
      console.error("Failed to load ebooks", err);
      setError("Unable to load your ebooks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 1. Get User
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // 2. Fetch My Ebooks
    fetchMyEbooks();
  }, []);

  // ================= ACTIONS =================
  const handleCreateEbook = async () => {
    try {
      const res = await api.post("/api/ebooks", {
        title: "Untitled Ebook",
        published: false,
      });
      const ebookId = res.data.id || res.data._id;
      navigate(`/ebook-custom-template/${ebookId}`);
    } catch (err) {
      console.error("Create ebook failed", err);
      alert("Unable to create ebook. Please try again.");
    }
  };

  const handleUploadCover = async (ebookId, file) => {
    try {
      await uploadBookCover(ebookId, file);
      // Refresh list to show new image
      fetchMyEbooks();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload cover image");
    }
  };

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* MAIN CONTENT Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginLeft: "0" }}>
        <div className="p-4">
          <Topbar />
        </div>

        <div className="px-5 pb-5">

          {/* ================= VIEW: DASHBOARD (OVERVIEW) ================= */}
          {activeTab === "dashboard" && (
            <div className="animate-fade-in">
              {/* HERO WELCOME */}
              <div className="bg-white rounded-4 p-5 mb-5 shadow-sm d-flex justify-content-between align-items-center position-relative overflow-hidden">
                <div style={{ zIndex: 1 }}>
                  <h1 className="fw-bold mb-3 display-5">
                    Welcome back, <span className="text-primary">{user?.username || "Writer"}!</span> 👋
                  </h1>
                  <p className="text-muted fs-5 mb-4" style={{ maxWidth: "600px" }}>
                    Your creative journey continues here. You have <strong className="text-dark">{myBooks.length}</strong> ebooks in your library.
                  </p>

                  <div className="d-flex gap-3">
                    <button className="btn btn-primary btn-lg px-4 rounded-pill shadow-sm" onClick={handleCreateEbook}>
                      <FaPlus className="me-2" /> Create New Ebook
                    </button>
                    <button className="btn btn-outline-dark btn-lg px-4 rounded-pill" onClick={() => navigate("/explore")}>
                      <FaCompass className="me-2" /> Explore
                    </button>
                  </div>
                </div>
                <div className="d-none d-lg-block position-absolute" style={{ right: "-20px", bottom: "-50px", width: "250px", height: "250px", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%" }}></div>
              </div>


              {/* PENDING WORKS (DRAFTS) */}
              {draftBooks.length > 0 && (
                <div className="mb-5">
                  <h4 className="fw-bold mb-3 text-warning">📝 Continue Writing</h4>
                  <div className="row g-4">
                    {draftBooks.slice(0, 4).map((book) => (
                      <div className="col-md-6 col-lg-3" key={`draft-${book.id}`}>
                        <BookCard
                          book={book}
                          onClick={() => navigate(`/ebook-custom-template/${book.id}`)}
                          onUploadCover={handleUploadCover}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}



              {/* QUICK STATS ROW REMOVED */}

            </div>
          )}


          {/* ================= VIEW: MY BOOKS ================= */}
          {activeTab === "my-books" && (
            <div className="animate-fade-in">
              <div className="mb-4">
                <h2 className="fw-bold">My Library</h2>
                <p className="text-muted">Manage all your ebooks (Drafts & Published).</p>
              </div>

              {loading ? (
                <div className="py-5 text-center text-muted">Loading library...</div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : myBooks.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                  <h3>📚 It's quiet here...</h3>
                  <p className="text-muted mb-4">You haven't created any ebooks yet.</p>
                  <button className="btn btn-primary rounded-pill px-4" onClick={handleCreateEbook}>Start Writing</button>
                </div>
              ) : (
                <div className="row g-4">
                  {/* Create New Card */}
                  <div className="col-md-6 col-lg-3">
                    <div
                      className="h-100 border-2 border-dashed border-secondary-subtle rounded-4 d-flex flex-column align-items-center justify-content-center p-4 cursor-pointer hover-bg-light"
                      style={{ minHeight: "300px", cursor: "pointer" }}
                      onClick={handleCreateEbook}
                    >
                      <div className="bg-light p-3 rounded-circle mb-3"><FaPlus className="text-muted" /></div>
                      <h6 className="fw-bold text-muted">Create New</h6>
                    </div>
                  </div>

                  {myBooks.map((book) => (
                    <div className="col-md-6 col-lg-3" key={`user-${book.id}`}>
                      <BookCard
                        book={book}
                        onClick={() => {
                          if (book.published) {
                            navigate(`/ebooks/${book.id}`); // Reader
                          } else {
                            navigate(`/ebook-custom-template/${book.id}`); // Editor
                          }
                        }}
                        onUploadCover={handleUploadCover}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
