import { useNavigate, useParams } from "react-router-dom";

const TemplateCard = ({ template }) => {
  const navigate = useNavigate();
  const { ebookId } = useParams();

  return (
    <button
      className="btn btn-primary"
      onClick={() =>
        navigate(`/ebook-editor/${ebookId}?template=${template.id}`)
      }
    >
      Use Template
    </button>
  );
};