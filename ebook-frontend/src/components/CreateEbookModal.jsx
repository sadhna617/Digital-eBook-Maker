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

  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  if (!show) return null;

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Create ebook
      const response = await axios.post(
        "http://localhost:8081/api/ebooks",
        {
          title: book.title,
          author: book.author,
          description: book.description,
          category: book.category,
        }
      );

      const ebookId = response.data.id;

      // Step 2: Upload cover image if selected
      if (coverImage) {
        const formData = new FormData();
        formData.append("file", coverImage);

        try {
          await axios.post(
            `http://localhost:8081/api/ebooks/${ebookId}/cover`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
        } catch (imgError) {
          console.error("Cover upload failed:", imgError);
          // Continue anyway - ebook is created
        }
      }

      alert("📘 Ebook created successfully!");
      onClose();

      navigate(`/ebook-custom-template/${ebookId}`);
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

                {/* COVER IMAGE UPLOAD */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">📷 Cover Image (Optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-3 text-center">
                      <img
                        src={imagePreview}
                        alt="Cover preview"
                        className="img-thumbnail"
                        style={{ maxHeight: "200px", maxWidth: "100%" }}
                      />
                    </div>
                  )}
                </div>

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
