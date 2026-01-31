import api from "../api/axios";

const saveEbook = async () => {
  try {
    await api.put(`/api/ebooks/editor/${ebookId}/content`, {
      templateId,
      chapters,
    });

    alert("Ebook saved successfully ✅");
  } catch (err) {
    console.error("Save ebook failed", err);
    alert("Failed to save ebook ❌");
  }
};
