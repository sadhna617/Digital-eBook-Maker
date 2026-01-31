import { useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ebookTemplates.css";

export default function EbookEditor() {
  const { id: ebookId } = useParams();
  const [searchParams] = useSearchParams();
  const [ebook, setEbook] = useState(null);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/ebooks/${ebookId}`)
      .then(res => {
        setEbook(res.data);
        setChapters(
          res.data.chapters && res.data.chapters.length > 0
            ? res.data.chapters
            : [{ title: "Chapter 1", content: "" }]
        );
      });
  }, [ebookId]);

  //  STEP 1: LOADING GUARD (MUST COME FIRST)
  if (!ebook) {
    return <p className="text-center mt-5">Loading editor...</p>;
  }

  //  STEP 2: HANDLE CUSTOM TEMPLATE SAFELY


if (ebook.templateType === "CUSTOM") {
  const d = ebook.customDesign;

  return (
    <div
      className="editor"
      style={{
        background: d.backgroundStyle === "gradient"
          ? `linear-gradient(#ffffff, ${d.backgroundColor})`
          : d.backgroundColor,
        minHeight: "100vh",
        padding: "40px"
      }}
    >
      <div
        className="page"
        style={{
          fontFamily: d.fontFamily,
          fontSize: `${d.fontSize}px`,
          lineHeight: d.lineHeight,
          color: d.textColor,
          padding: `${d.padding}px`,
          borderRadius: d.borderStyle === "card" ? "16px" : "0",
          border: d.borderStyle === "outline" ? "1px solid #ccc" : "none"
        }}
      >
        <h1>{ebook.title}</h1>

        {chapters.map((ch, index) => (
          <div key={index} className="mb-5">
            <input
              className="form-control mb-3"
              value={ch.title}
              onChange={e => {
                const copy = [...chapters];
                copy[index].title = e.target.value;
                setChapters(copy);
              }}
            />

            <textarea
              rows={10}
              className="form-control"
              value={ch.content}
              onChange={e => {
                const copy = [...chapters];
                copy[index].content = e.target.value;
                setChapters(copy);
              }}
            />
          </div>
        ))}

        <button className="btn btn-success" onClick={saveBook}>
          💾 Save Ebook
        </button>
      </div>
    </div>
  );
}


  // STEP 3: NORMAL TEMPLATE FLOW
  const saveBook = async () => {
    await axios.put(
      `http://localhost:8081/api/ebooks/${ebookId}/content`,
      {
        templateId: ebook.templateId,
        chapters
      }
    );
    alert("📘 Ebook saved successfully!");
  };

  return (
    <div className={`editor ${ebook.templateId}`}>
      <div className="page">
        <h1>{ebook.title}</h1>

        {chapters.map((ch, index) => (
          <div key={index} className="mb-5">
            <input
              className="form-control mb-3"
              placeholder="Chapter title"
              value={ch.title}
              onChange={(e) => {
                const copy = [...chapters];
                copy[index].title = e.target.value;
                setChapters(copy);
              }}
            />

            <textarea
              rows={10}
              className="form-control"
              placeholder="Start writing here..."
              value={ch.content}
              onChange={(e) => {
                const copy = [...chapters];
                copy[index].content = e.target.value;
                setChapters(copy);
              }}
            />
          </div>
        ))}

        <div className="d-flex gap-3">
          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              setChapters([...chapters, { title: "New Chapter", content: "" }])
            }
          >
            + Add Chapter
          </button>

          <button className="btn btn-success" onClick={saveBook}>
            💾 Save Ebook
          </button>
        </div>
      </div>
    </div>
  );
}