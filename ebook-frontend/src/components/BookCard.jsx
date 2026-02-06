import { FaCamera } from "react-icons/fa";

const BookCard = ({ book, onClick, onUploadCover }) => {

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0] && onUploadCover) {
      onUploadCover(book.id, e.target.files[0]);
    }
  };

  return (
    <div className="book-card h-100 d-flex flex-column position-relative overflow-hidden">

      {/* Cover Image Area */}
      <div
        className="book-img-container position-relative bg-light rounded-top-4"
        style={{ height: "180px", overflow: "hidden" }}
        onClick={onClick}
      >
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={book.title} className="w-100 h-100 object-fit-cover" />
        ) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted fw-bold">
            📖 {book.title}
          </div>
        )}

        {/* Upload Button Overlay (visible if onUploadCover is passed) */}
        {onUploadCover && (
          <label
            className="position-absolute bottom-0 end-0 m-2 btn btn-sm btn-light rounded-circle shadow-sm p-2"
            style={{ cursor: "pointer", zIndex: 10 }}
            onClick={(e) => e.stopPropagation()}
          >
            <FaCamera className="text-primary" />
            <input type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
          </label>
        )}
      </div>

      {/* Content */}
      <div className="p-3 d-flex flex-column flex-grow-1" onClick={onClick}>
        <h6 className="fw-bold mb-1 text-truncate" title={book.title}>{book.title}</h6>
        <p className="small text-muted mb-3 flex-grow-1" style={{ fontSize: "12px" }}>
          {book.author || "By You"}
        </p>

        <button
          className="btn btn-outline-primary btn-sm w-100 rounded-pill mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          {book.published ? "Read Book" : "Continue Editing"}
        </button>
      </div>

    </div>
  );
};

export default BookCard;
