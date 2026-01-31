import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EbookPreview = () => {
  const { ebookId } = useParams();
  const [ebook, setEbook] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8081/api/ebooks/${ebookId}`)
      .then(res => setEbook(res.data));
  }, []);

  if (!ebook) return null;

  const style = ebook.design ? {
    fontFamily: ebook.design.fontFamily,
    fontSize: ebook.design.fontSize,
    color: ebook.design.textColor,
    background: ebook.design.backgroundColor
  } : {};

  return (
    <div className="container py-5" style={style}>
      <h1>{ebook.title}</h1>
      <p>{ebook.description}</p>

      {ebook.templateId && (
        <img src={`/templates/${ebook.templateId.toLowerCase()}.png`} />
      )}
    </div>
  );
};

export default EbookPreview;