import { useNavigate } from "react-router-dom";
import { FaCompass, FaPlus } from "react-icons/fa";
import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import BookCard from "../components/BookCard";
import api from "../api/axios";


// OLD STATIC BOOKS (DO NOT REMOVE)
import { books } from "../data/books";

// API
import { getMyEbooks, createEbook } from "../api/ebookApi";

import "../styles/dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH MY EBOOKS =================
  useEffect(() => {
    const fetchMyEbooks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getMyEbooks();
        setMyBooks(res.data || []);
      } catch (err) {
        console.error("Failed to load ebooks", err);
        setError("Unable to load your ebooks. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyEbooks();
  }, []);

  // ================= CREATE EBOOK + REDIRECT =================
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
    alert("Unable to create ebook");
  }
};


  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main">
        <Topbar />

        {/* ================= HERO ================= */}
        <div className="welcome-section">
          <div>
            <h1>Welcome back 👋</h1>
            <p>
              Let’s turn ideas into beautiful ebooks.
              <br />
              Continue reading or explore something new.
            </p>

            <div className="dashboard-actions">
              <div
                className="action-card primary"
                onClick={() => navigate("/explore")}
              >
                <FaCompass />
                <span>Explore Books</span>
              </div>

              <div
                className="action-card secondary"
                onClick={handleCreateEbook}
              >
                <FaPlus />
                <span>Create Ebook</span>
              </div>
            </div>
          </div>

          <div className="progress-card">
            <div className="circle">50%</div>
            <h3>Weekly Progress</h3>
            <p>You’re doing great 🚀</p>
          </div>
        </div>

        {/* ================= BOOKS ================= */}

       <h2 className="section-title">Continue Reading</h2>

<div className="books-row">
  {books.map((book) => (
    <BookCard
      key={`static-${book.id}`}
      book={book}
      onClick={() =>
        navigate(`/ebook-custom-template/${book.id}`)
      }
    />
  ))}
</div>


       <h2 className="section-title">My Books</h2>

<div className="books-row">
  {loading ? (
    <p>Loading your ebooks...</p>
  ) : error ? (
    <p style={{ color: "red" }}>{error}</p>
  ) : myBooks.length === 0 ? (
    <p>No ebooks yet. Create your first one ✨</p>
  ) : (
    myBooks.map((book) => (
      <BookCard
        key={`user-${book.id}`}
        book={book}
        onClick={() =>
          navigate(`/ebook/${book.id}`)
        }
      />
    ))
  )}
</div>

      </div>
    </div>
  );
};

export default Dashboard;
