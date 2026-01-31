import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/ebookTemplates.css";


export default function CustomTemplateEditor() {
  const { id } = useParams();
   const [templateId, setTemplateId] = useState("CUSTOM");
  const { ebookId } = useParams();
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

  
  useEffect(() => {
  axios.get(`http://localhost:8081/api/ebooks/${id}`).then((res) => {
    setEbook(res.data);

   
    setChapters([]);
  });
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
    const input = document.getElementById("ebook-content");
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
    <div className="container-fluid">
      <h2 className="text-center fw-bold my-4">🎨 Custom Ebook Design</h2>
      <div className="row">
       
        <div className="col-md-3 border-end p-4">
          <h6 className="text-muted mb-3">
            Editing: {activeTarget === "bookTitle" ? "Book Title" : activeTarget === "chapterTitle" ? "Chapter Titles" : activeTarget === "content" ? "Content" : "Image"}
          </h6>

          {/* PAGE BACKGROUND */}
          <label className="form-label">Page Background Mode</label>
          <select className="form-select mb-3" value={design.page.mode} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, mode: e.target.value } }))}>
            <option value="color">Single Color</option>
            <option value="gradient">Gradient</option>
          </select>
          {design.page.mode === "color" ? (
            <input type="color" className="form-control form-control-color mb-3" value={design.page.background} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, background: e.target.value } }))} />
          ) : (
            <>
              <select className="form-select mb-2" value={design.page.gradientType} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, gradientType: e.target.value } }))}>
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
              <input type="color" className="form-control form-control-color mb-2" value={design.page.gradientStart} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, gradientStart: e.target.value } }))} />
              <input type="color" className="form-control form-control-color mb-3" value={design.page.gradientEnd} onChange={(e) => setDesign(d => ({ ...d, page: { ...d.page, gradientEnd: e.target.value } }))} />
            </>
          )}

          {/* FONT CONTROLS */}
          {activeTarget !== "image" && (
            <>
              <label className="form-label">Font Family</label>
              <select className="form-select mb-3" value={design[activeTarget].fontFamily} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], fontFamily: e.target.value } }))}>
                <option>Inter</option><option>Georgia</option><option>Merriweather</option><option>Roboto</option><option>Poppins</option><option>Playfair Display</option>
              </select>

              <label className="form-label">Font Size</label>
              <input type="range" min="12" max="48" className="form-range mb-3" value={design[activeTarget].fontSize} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], fontSize: Number(e.target.value) } }))} />

              <label className="form-label">Line Height</label>
              <input type="range" min="1.1" max="2.5" step="0.1" className="form-range mb-3" value={design[activeTarget].lineHeight} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], lineHeight: Number(e.target.value) } }))} />

              <label className="form-label">Text Align</label>
              <select className="form-select mb-3" value={design[activeTarget].textAlign} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], textAlign: e.target.value } }))}>
                <option value="left">Left</option><option value="center">Center</option><option value="justify">Justify</option>
              </select>

              <label className="form-label">Text Color</label>
              <input type="color" className="form-control form-control-color mb-3" value={design[activeTarget].color} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], color: e.target.value } }))} />

              <label className="form-label">Text Shadow</label>
              <input type="text" placeholder="e.g. 2px 2px 5px gray" className="form-control mb-3" value={design[activeTarget].textShadow} onChange={(e) => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], textShadow: e.target.value } }))} />

              <div className="mb-3">
                <label className="form-label d-block">Text Style</label>
                <button className={`btn btn-sm me-2 ${design[activeTarget].fontWeight === "bold" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], fontWeight: d[activeTarget].fontWeight === "bold" ? "normal" : "bold" } }))}>B</button>
                <button className={`btn btn-sm me-2 ${design[activeTarget].fontStyle === "italic" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], fontStyle: d[activeTarget].fontStyle === "italic" ? "normal" : "italic" } }))}>I</button>
                <button className={`btn btn-sm ${design[activeTarget].textDecoration === "underline" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setDesign(d => ({ ...d, [activeTarget]: { ...d[activeTarget], textDecoration: d[activeTarget].textDecoration === "underline" ? "none" : "underline" } }))}>U</button>
              </div>
            </>
          )}

          {/* IMAGE CONTROLS */}
          <label className="form-label mt-4">Add Image</label>
          <input type="file" accept="image/*" className="form-control mb-3" onChange={(e) => e.target.files[0] && addImageToChapter(chapters.length - 1, e.target.files[0])} />

          <label className="form-label">Width (px)</label>
          <input type="number" className="form-control mb-2" value={activeImage.chapterIndex !== null ? chapters[activeImage.chapterIndex].images[activeImage.imageIndex].width : 300} onChange={(e) => {
            const width = Number(e.target.value);
            setChapters(prev => prev.map((c,i)=>i===activeImage.chapterIndex?{...c, images:c.images.map((img,idx)=>idx===activeImage.imageIndex?{...img,width}:img)}:c));
          }} />

          <label className="form-label">Align</label>
          <select className="form-select mb-3" value={activeImage.chapterIndex!==null?chapters[activeImage.chapterIndex].images[activeImage.imageIndex].textAlign:"center"} onChange={(e)=>{
            const textAlign=e.target.value;
            setChapters(prev=>prev.map((c,i)=>i===activeImage.chapterIndex?{...c, images:c.images.map((img,idx)=>idx===activeImage.imageIndex?{...img,textAlign}:img)}:c));
          }}>
            <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
          </select>

          <button className="btn btn-success w-100 mt-4" onClick={saveEbook}>💾 Save Ebook</button>
        </div>

        {/* ================= RIGHT PANEL / EDITOR ================= */}
        <div className="col-md-9 p-4" id="ebook-content">
            {chapters.length === 0 && (
  <p className="text-muted text-center my-5">
    No chapters yet. Click <b>+ Add Chapter</b> to start writing.
  </p>
)}

          {chapters.map((ch, i) => (
            <div
  key={i}
  className="page mb-4 page-break"
  style={{
    width: "595px",
    minHeight: "842px",
    background: pageBackgroundStyle(),
    padding: `${design.page.padding}px`,
    borderRadius: `${design.page.radius}px`,
    boxShadow:
      design.page.shadow === "soft"
        ? "0 30px 60px rgba(0,0,0,0.12)"
        : "0 50px 100px rgba(0,0,0,0.25)"
  }}
>

              <h1 style={styleFrom(design.bookTitle)} onClick={()=>setActiveTarget("bookTitle")}>{ebook.title}</h1>
              <textarea className="form-control mb-2" style={{...styleFrom(design.chapterTitle), background:"transparent", border:"none"}} rows={1} value={ch.title} onFocus={()=>setActiveTarget("chapterTitle")} onChange={(e)=>setChapters(prev=>prev.map((c,idx)=>idx===i?{...c,title:e.target.value}:c))} onInput={(e)=>{e.target.style.height="auto"; e.target.style.height=e.target.scrollHeight+"px"}} />
              <textarea className="form-control mb-2" style={{...styleFrom(design.content), background:"transparent", border:"none"}} rows={6} value={ch.content} onFocus={()=>setActiveTarget("content")} onChange={(e)=>setChapters(prev=>prev.map((c,idx)=>idx===i?{...c,content:e.target.value}:c))} onInput={(e)=>{e.target.style.height="auto"; e.target.style.height=e.target.scrollHeight+"px"}} />
              {ch.images && ch.images.map((img, idx)=>(
                <div key={idx} style={{ textAlign: img.textAlign, margin:"10px 0" }} onClick={()=>{setActiveTarget("image"); setActiveImage({chapterIndex:i,imageIndex:idx})}}>
                  <img src={img.url} alt={`chapter-${i}-${idx}`} style={{width: img.width}} className="img-fluid" />
                </div>
              ))}
            </div>
          ))}
          <button
  className="btn btn-outline-secondary mt-3"
  onClick={() =>
    setChapters(prev => [
      ...prev,
      { title: "", content: "", images: [] }
    ])
  }
>
  + Add Chapter
</button>
&nbsp; 
<button
    className="btn btn-outline-danger mt-3"
    onClick={() => {
      if (!chapters.length) return;

      const ok = window.confirm(
        "Delete the last chapter? This action cannot be undone."
      );

      if (ok) {
        setChapters(prev => prev.slice(0, -1));
      }
    }}
  > 
    🗑 Delete Chapter
  </button>
        </div>
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-backdrop">
          <div className="popup-content">
            <h4>✅ Ebook Created!</h4>
            <p>Your ebook has been successfully saved.</p>
            <div className="d-flex justify-content-between mt-3">
              <button className="btn btn-primary" onClick={()=>navigate("/dashboard")}>Go to Dashboard</button>
              <button className="btn btn-success" onClick={downloadPdf}>Save PDF</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}