import PlagiarismChecker from "../components/PlagiarismChecker";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/ebookTemplates.css";


export default function CustomTemplateEditor() {
  const { id } = useParams();
  const [templateId, setTemplateId] = useState("CUSTOM");

  const navigate = useNavigate();


  const [ebook, setEbook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [activeTarget, setActiveTarget] = useState("content"); // "bookTitle" | "chapterTitle" | "content" | "image"
  const [activeImage, setActiveImage] = useState({ chapterIndex: null, imageIndex: null });
  const [design, setDesign] = useState({
    bookTitle: { fontFamily: "Playfair Display", fontSize: 36, lineHeight: 1.3, letterSpacing: 0, textAlign: "center", color: "#111827", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", textShadow: "none" },
    chapterTitle: { fontFamily: "Inter", fontSize: 24, lineHeight: 1.4, letterSpacing: 0, textAlign: "left", color: "#111827", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", textShadow: "none" },
    content: { fontFamily: "Inter", fontSize: 16, lineHeight: 1.7, letterSpacing: 0, textAlign: "left", color: "#1f2937", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", textShadow: "none" },
    image: { width: 300, textAlign: "center" },
    page: { mode: "color", background: "#ffffff", gradientType: "linear", gradientStart: "#ffffff", gradientEnd: "#000000", padding: 65, radius: 14, shadow: "soft" }
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showPlagiarism, setShowPlagiarism] = useState(false);


  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:8081/api/ebooks/${id}`)
      .then((res) => {
        setEbook(res.data);
        if (res.data.chapters && res.data.chapters.length > 0) {
          setChapters(res.data.chapters);
        } else {
          // Initialize with one empty chapter if no content exists yet
          setChapters([{ title: "Chapter 1", content: "", images: [] }]);
        }
      })
      .catch(err => console.error("Error loading ebook:", err));
  }, [id]);


  if (!ebook) return <p className="text-center mt-5">Loading editor...</p>;

  const styleFrom = (obj) => ({
    fontFamily: obj.fontFamily,
    fontSize: `${obj.fontSize}px`,
    lineHeight: obj.lineHeight,
    letterSpacing: `${obj.letterSpacing}px`,
    textAlign: obj.textAlign,
    color: obj.color,
    fontWeight: obj.fontWeight,
    fontStyle: obj.fontStyle,
    textDecoration: obj.textDecoration,
    textShadow: obj.textShadow
  });

  const pageBackgroundStyle = () => {
    if (design.page.mode === "color") return design.page.background;
    const { gradientType, gradientStart, gradientEnd } = design.page;
    return gradientStart && gradientEnd ? `${gradientType}-gradient(to right, ${gradientStart}, ${gradientEnd})` : design.page.background;
  };


  const saveEbook = async () => {
    try {
      // axios.put(`http://localhost:8081/api/ebooks/${id}/custom-design`, design);
      await axios.put(`http://localhost:8081/api/ebooks/${id}/content`, { templateId: "minimal-white", chapters });
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  const handlePublish = async () => {
    try {
      // First check plagiarism for all chapters
      const allContent = chapters.map(c => c.content).join("\n\n");

      if (!allContent.trim()) {
        alert("⚠️ Cannot publish empty book. Please add some content first.");
        return;
      }

      // Check plagiarism score
      const plagiarismRes = await axios.post("http://localhost:8081/api/plagiarism/check", { text: allContent });
      const score = plagiarismRes.data.score;

      if (score > 20) {
        alert(`❌ Cannot Publish!\n\nPlagiarism score is ${score}% (threshold: 20%)\n\nPlease review and modify your content to ensure originality before publishing.`);
        return;
      }

      // If plagiarism check passes, save and publish
      await axios.put(`http://localhost:8081/api/ebooks/${id}/content`, { templateId: "minimal-white", chapters });
      await axios.put(`http://localhost:8081/api/ebooks/publish/${id}`);

      alert(`✅ Published Successfully!\n\nPlagiarism Score: ${score}%\nYour book is now live!`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Publish failed. Please try again.");
    }
  };


  const addImageToChapter = (chapterIndex, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setChapters((prev) =>
        prev.map((c, i) =>
          i === chapterIndex ? { ...c, images: [...(c.images || []), { url: imageUrl, width: 300, textAlign: "center" }] } : c
        )
      );
    };
    reader.readAsDataURL(file);
  };


  const deleteChapter = (index) => {
    if (!window.confirm("Delete this chapter? This action cannot be undone.")) return;
    setChapters((prev) => prev.filter((_, i) => i !== index));
  };


  const downloadPdf = async () => {
    const input = document.getElementById("ebook-content-wrapper");
    const pdf = new jsPDF("p", "pt", "a4");
    const pages = input.querySelectorAll(".page");
    let offsetY = 0;

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`${ebook.title}.pdf`);
  };

  //ui
  return (
    <div className="d-flex flex-column vh-100 bg-light">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-bottom py-3 px-4 d-flex justify-content-between align-items-center z-3">
        <h4 className="m-0 fw-bold text-primary">
          <span role="img" aria-label="palette">🎨</span> Custom Design Studio
        </h4>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger btn-sm" onClick={() => navigate("/dashboard")}>Cancel</button>
          <button className="btn btn-success btn-sm px-4 fw-medium" onClick={saveEbook}>Save Draft</button>
          <button className="btn btn-primary btn-sm px-4 fw-medium" onClick={handlePublish}>📚 Publish</button>
        </div>
      </div>

      <div className="flex-grow-1 overflow-hidden d-flex">

        {/* SIDEBAR TOOLBAR */}
        <div className="bg-white border-end overflow-y-auto" style={{ width: "320px", flexShrink: 0 }}>
          <div className="p-4">
            <h6 className="text-uppercase text-muted fw-bold small mb-3">Editor Controls</h6>

            <div className="mb-4 p-3 bg-light rounded-3 border">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="fw-semibold small">Active Selection</label>
                <span className="badge bg-primary text-capitalize">{activeTarget}</span>
              </div>
              <p className="small text-muted m-0">Click any element on the page to edit its style.</p>
            </div>

            {/* PAGE BACKGROUND GROUP */}
            <div className="mb-4">
              <label className="form-label fw-bold small text-secondary">Page Background</label>
              <select className="form-select form-select-sm mb-2" value={design.page.mode} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, mode: e.target.value } }))}>
                <option value="color">Solid Color</option>
                <option value="gradient">Gradient Overlay</option>
              </select>

              {design.page.mode === "color" ? (
                <div className="d-flex align-items-center gap-2">
                  <input type="color" className="form-control form-control-color" value={design.page.background} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, background: e.target.value } }))} title="Choose color" />
                  <span className="small text-muted">{design.page.background}</span>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  <select className="form-select form-select-sm" value={design.page.gradientType} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, gradientType: e.target.value } }))}>
                    <option value="linear">Linear Gradient</option>
                    <option value="radial">Radial Gradient</option>
                  </select>
                  <div className="d-flex gap-2">
                    <input type="color" className="form-control form-control-color w-100" value={design.page.gradientStart} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, gradientStart: e.target.value } }))} />
                    <input type="color" className="form-control form-control-color w-100" value={design.page.gradientEnd} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, gradientEnd: e.target.value } }))} />
                  </div>
                </div>
              )}
            </div>

            <hr className="my-4 text-muted opacity-25" />

            {/* FONT CONTROLS */}
            {activeTarget !== "image" && (
              <div className="animate-fade-in">
                <h6 className="text-uppercase text-muted fw-bold small mb-3">Typography</h6>

                <div className="mb-3">
                  <label className="form-label small fw-medium">Font Family</label>
                  <select className="form-select form-select-sm" value={design[activeTarget].fontFamily} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], fontFamily: e.target.value } }))}>
                    <option>Inter</option><option>Georgia</option><option>Merriweather</option><option>Roboto</option><option>Poppins</option><option>Playfair Display</option>
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-medium">Size ({design[activeTarget].fontSize}px)</label>
                    <input type="range" min="12" max="64" className="form-range" value={design[activeTarget].fontSize} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], fontSize: Number(e.target.value) } }))} />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-medium">Line Height</label>
                    <input type="range" min="1.0" max="3.0" step="0.1" className="form-range" value={design[activeTarget].lineHeight} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], lineHeight: Number(e.target.value) } }))} />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-medium">Alignment</label>
                    <select className="form-select form-select-sm" value={design[activeTarget].textAlign} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], textAlign: e.target.value } }))}>
                      <option value="left">Left</option><option value="center">Center</option><option value="justify">Justify</option>
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-medium">Color</label>
                    <div className="d-flex align-items-center bg-light border rounded px-2" style={{ height: "31px" }}>
                      <input type="color" className="form-control form-control-color border-0 p-0 m-0 bg-transparent" value={design[activeTarget].color} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], color: e.target.value } }))} />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-medium">Style</label>
                  <div className="btn-group w-100" role="group">
                    <button className={`btn btn-sm ${design[activeTarget].fontWeight === "bold" ? "btn-dark" : "btn-outline-secondary"}`} onClick={() => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], fontWeight: d[activeTarget].fontWeight === "bold" ? "normal" : "bold" } }))}><strong>B</strong></button>
                    <button className={`btn btn-sm ${design[activeTarget].fontStyle === "italic" ? "btn-dark" : "btn-outline-secondary"}`} onClick={() => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], fontStyle: d[activeTarget].fontStyle === "italic" ? "normal" : "italic" } }))}><em>I</em></button>
                    <button className={`btn btn-sm ${design[activeTarget].textDecoration === "underline" ? "btn-dark" : "btn-outline-secondary"}`} onClick={() => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], textDecoration: d[activeTarget].textDecoration === "underline" ? "none" : "underline" } }))}><u>U</u></button>
                  </div>
                </div>

                <div>
                  <label className="form-label small fw-medium">Shadow</label>
                  <input type="text" placeholder="e.g. 2px 2px 4px #ccc" className="form-control form-control-sm" value={design[activeTarget].textShadow} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], textShadow: e.target.value } }))} />
                </div>
              </div>
            )}

            {/* IMAGE CONTROLS */}
            <hr className="my-4 text-muted opacity-25" />
            <h6 className="text-uppercase text-muted fw-bold small mb-3">Media</h6>

            <label className="btn btn-outline-primary btn-sm w-100 mb-3">
              <i className="bi bi-image me-2"></i> Upload Image
              <input type="file" accept="image/*" hidden onChange={(e) => e.target.files[0] && addImageToChapter(chapters.length - 1, e.target.files[0])} />
            </label>

            {/* PLAGIARISM CHECKER TRIGGER */}
            <button
              className="btn btn-dark btn-sm w-100 mb-3"
              onClick={() => setShowPlagiarism(true)}
            >
              🕵️ Check Plagiarism
            </button>

            {activeTarget === "image" && (
              <div className="p-3 bg-light rounded border animate-fade-in">
                <label className="form-label small fw-medium">Image Width</label>
                <input type="number" className="form-control form-control-sm mb-2" value={activeImage.chapterIndex !== null ? chapters[activeImage.chapterIndex].images[activeImage.imageIndex].width : 300} onChange={(e) => {
                  const width = Number(e.target.value);
                  setChapters(prev => prev.map((c, i) => i === activeImage.chapterIndex ? { ...c, images: c.images.map((img, idx) => idx === activeImage.imageIndex ? { ...img, width } : img) } : c));
                }} />

                <label className="form-label small fw-medium">Alignment</label>
                <div className="btn-group w-100">
                  {['left', 'center', 'right'].map(align => (
                    <button key={align} className={`btn btn-sm ${(activeImage.chapterIndex !== null ? chapters[activeImage.chapterIndex].images[activeImage.imageIndex].textAlign : "center") === align ? "btn-secondary" : "btn-outline-secondary"
                      }`} onClick={(e) => {
                        setChapters(prev => prev.map((c, i) => i === activeImage.chapterIndex ? { ...c, images: c.images.map((img, idx) => idx === activeImage.imageIndex ? { ...img, textAlign: align } : img) } : c));
                      }}>{align}</button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ================= RIGHT PANEL / EDITOR CANVAS ================= */}
        <div className="flex-grow-1 bg-secondary-subtle overflow-y-auto p-5 d-flex flex-column align-items-center" id="ebook-content-wrapper">

          {chapters.length === 0 && (
            <div className="text-center mt-5 text-muted">
              <div className="display-1 mb-3">📝</div>
              <h4>Start Writing Your Book</h4>
              <p>Click "Add Chapter" to begin.</p>
            </div>
          )}

          {chapters.map((ch, i) => (
            <div
              key={i}
              className="page mb-5 position-relative transition-all"
              style={{
                width: "650px",
                minHeight: "920px",
                background: pageBackgroundStyle(),
                padding: `${design.page.padding}px`,
                borderRadius: `${design.page.radius}px`,
                boxShadow: design.page.shadow === "soft" ? "0 10px 40px rgba(0,0,0,0.08)" : "0 25px 80px rgba(0,0,0,0.2)",
                transition: "transform 0.2s ease",
              }}
            >
              <div className="position-absolute top-0 start-0 m-3 text-muted small opacity-25">Page {i + 1}</div>

              <h1
                className="hover-outline p-2 rounded"
                style={{ ...styleFrom(design.bookTitle), cursor: "pointer", border: activeTarget === "bookTitle" ? "2px dashed #3b82f6" : "2px solid transparent" }}
                onClick={(e) => { e.stopPropagation(); setActiveTarget("bookTitle") }}
              >
                {ebook.title}
              </h1>

              <textarea
                className="form-control mb-3 hover-outline"
                placeholder="Chapter Title..."
                style={{ ...styleFrom(design.chapterTitle), background: "transparent", border: activeTarget === "chapterTitle" ? "2px dashed #3b82f6" : "none", resize: "none", overflow: "hidden" }}
                rows={1}
                value={ch.title}
                onClick={(e) => { e.stopPropagation(); setActiveTarget("chapterTitle") }}
                onFocus={() => setActiveTarget("chapterTitle")}
                onChange={(e) => setChapters(prev => prev.map((c, idx) => idx === i ? { ...c, title: e.target.value } : c))}
                onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px" }}
              />

              <textarea
                className="form-control mb-2 hover-outline"
                placeholder="Start typing your story..."
                style={{ ...styleFrom(design.content), background: "transparent", border: activeTarget === "content" ? "2px dashed #3b82f6" : "none", resize: "none", overflow: "hidden" }}
                rows={12}
                value={ch.content}
                onClick={(e) => { e.stopPropagation(); setActiveTarget("content") }}
                onFocus={() => setActiveTarget("content")}
                onChange={(e) => setChapters(prev => prev.map((c, idx) => idx === i ? { ...c, content: e.target.value } : c))}
                onInput={(e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px" }}
              />

              {ch.images && ch.images.map((img, idx) => (
                <div key={idx} style={{ textAlign: img.textAlign, margin: "15px 0" }} onClick={(e) => { e.stopPropagation(); setActiveTarget("image"); setActiveImage({ chapterIndex: i, imageIndex: idx }) }}>
                  <img
                    src={img.url}
                    alt={`chapter-${i}-${idx}`}
                    style={{ width: img.width, border: activeTarget === "image" && activeImage.imageIndex === idx && activeImage.chapterIndex === i ? "2px dashed #3b82f6" : "none" }}
                    className="img-fluid rounded shadow-sm"
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="d-flex gap-3 mb-5">
            <button
              className="btn btn-primary rounded-pill px-4 shadow-sm"
              onClick={() =>
                setChapters(prev => [
                  ...prev,
                  { title: "", content: "", images: [] }
                ])
              }
            >
              <span className="me-2">+</span> Add New Chapter
            </button>

            {chapters.length > 0 && (
              <button
                className="btn btn-outline-danger rounded-pill px-4"
                onClick={() => {
                  if (window.confirm("Are you sure you want to remove the last page?")) setChapters(prev => prev.slice(0, -1));
                }}
              >
                <span className="me-2">🗑</span> Delete Page
              </button>
            )}
          </div>

        </div>
      </div>



      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-backdrop">
          <div className="popup-content">
            <h4>✅ Ebook Created!</h4>
            <p>Your ebook has been successfully saved.</p>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
              <button className="btn btn-success" onClick={downloadPdf}>Save PDF</button>
            </div>
          </div>
        </div>
      )}
      {/* PLAGIARISM MODAL */}
      {showPlagiarism && (
        <div className="popup-backdrop" onClick={() => setShowPlagiarism(false)}>
          <div className="popup-content p-0 overflow-hidden" style={{ width: "500px", height: "600px" }} onClick={(e) => e.stopPropagation()}>
            <PlagiarismChecker
              textToCheck={chapters.map(c => c.content).join("\n\n")}
              onClose={() => setShowPlagiarism(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}