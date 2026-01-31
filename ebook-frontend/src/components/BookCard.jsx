const BookCard = ({ book, onClick }) => {
  return (
    <div
      className="book-card"
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className="book-cover">BOOK</div>

      <h4>{book.title}</h4>

      <button
        onClick={(e) => {
          e.stopPropagation(); // important
          onClick();
        }}
      >
        Continue
      </button>
    </div>
  );
};

export default BookCard;
