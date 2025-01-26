import axios from "axios";

const API_BASE = "https://backendnotepad.onrender.com/api";

export const fetchNotes = async () => {
  const res = await axios.get(`${API_BASE}/notes`);
  return res.data;
};

export const fetchArchivedNotes = async () => {
  const res = await axios.get(`${API_BASE}/notes/archive`);
  return res.data;
};

export const createNote = async (note) => {
    try {
        const res = await axios.post(`${API_BASE}/notes`, note);
        return res.data;
      } catch (error) {
        console.error("Erro ao criar nota:", error);
        throw error;
      }
};

export const editNote = async (id, updatedNote) => {
  try {
    const res = await axios.put(`${API_BASE}/notes/${id}`, updatedNote);
    return res.data;
  } catch (error) {
    console.error("Erro ao editar nota:", error);
    throw error;
  }
};

export const archiveNote = async (id) => {
  const res = await axios.patch(`${API_BASE}/notes/${id}/archive`);
  return res.data;
};

export const deleteNote = async (id) => {
  await axios.delete(`${API_BASE}/notes/${id}`);
};

//tags
export const fetchTags = async () => {
    const res = await axios.get(`${API_BASE}/notes/tags`);
    return res.data;
  };

  
export const filterNotesByTag = async (tag) => {
  try {
    const res = await axios.get(`${API_BASE}/notes/tags`, {
      params: { tag }
    });
    console.log("foi")
    return res.data;
  } catch (error) {
    console.error("Erro ao filtrar notas por tag:", error);
    throw error;
  }
};

  export const createTags = async (id, tags) => {
    const res = await axios.post(`${API_BASE}/notes/${id}/tags`, { tags });
    return res.data;
  };
  
  export const removeTags = async (id, tags) => {
    const res = await axios.patch(`${API_BASE}/notes/${id}/removeTag`, { tags });
    return res.data;
  };

