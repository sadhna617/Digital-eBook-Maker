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
        <p>{ebook.description || "This is a dummy ebook description."}</p>

        <div className="mt-4 p-3 border rounded bg-light" style={{ minHeight: "300px" }}>
          📖 <b>Dummy eBook Reading Area</b>
          <br />
          <br />
          <p>A full-stack project that demonstrates how to build a modern web application using Spring Boot for the backend and React for the frontend. The backend handles RESTful APIs, business logic, and data access (often with Spring Data JPA and a relational database), while the frontend provides a dynamic user interface built with React. The project typically showcases integration between the two layers using JSON-based API calls, and it's often used as a template for building scalable, full-stack applications.<br></br><br></br>

          Frontend:-  refers to the part of a website or application that users interact with directly. It includes everything you see on the screen—like buttons, text, images, and layout. Technologies used include HTML, CSS, and JavaScript.<br></br><br></br>
          Backend:- is the behind-the-scenes part that handles data, business logic, and server operations. It communicates with the frontend and stores/retrieves information from databases. Technologies used include languages like Python, Java, Node.js, and databases like MySQL or MongoDB.

</p>
        </div>
      </div>
    </div>
  );
};

export default EbookReader;
