import api from "./axios";

// Get all ebooks of logged-in user
export const getMyEbooks = () => {
  return api.get("/api/ebooks/my");
};

// Create ebook after login
export const createEbook = (ebook) => {
  return api.post("/api/ebooks/create", ebook);
};

// Publish ebook
export const publishEbook = (id) => {
  return api.put(`/api/ebooks/publish/${id}`);
};

// Explore page → get all public/dummy ebooks
export const getExploreEbooks = () => {
  return api.get("/api/ebooks");
};

// Read ebook → get full book structure
export const getEbookById = (id) => {
  return api.get(`/api/ebooks/${id}`);
};

// Save ebook content
export const saveEbookContent = (ebookId, data) => {
  return api.put(`/api/ebooks/${ebookId}/content`, data);
};
