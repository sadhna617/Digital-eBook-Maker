import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const CreateEbookModal = ({ show, onClose }) => {
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
  });

  if (!show) return null;

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8081/api/ebooks",
        {
          title: book.title,
          author: book.author,
          description: book.description,
          category: book.category,
        }
      );

      alert("📘 Ebook created successfully!");
      onClose();

      navigate(`/ebook-design/${response.data.id}`);
    } catch (error) {
      console.error("Create ebook error:", error);
      alert("❌ Failed to create ebook");
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>

      <div className="modal fade show d-block">
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">

            <div className="modal-header">
              <h5>Create New Ebook</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-3"
                  placeholder="Book Title"
                  name="title"
                  required
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-3"
                  placeholder="Author Name"
                  name="author"
                  required
                  onChange={handleChange}
                />

                <select
                  className="form-select mb-3"
                  name="category"
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option>Education</option>
                  <option>Engineering</option>
                  <option>Lifestyle</option>
                  <option>Fiction</option>
                </select>

                <textarea
                  className="form-control mb-3"
                  placeholder="Description"
                  name="description"
                  onChange={handleChange}
                />

                <button className="btn btn-success w-100">
                  Create Ebook
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CreateEbookModal;
