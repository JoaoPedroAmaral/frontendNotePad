import React, { useState, useEffect } from 'react';
import {
  fetchNotes,
  fetchArchivedNotes,
  createNote,
  archiveNote,
  deleteNote,
  editNote,
  fetchTags,
  createTags,
  filterNotesByTag,
  removeTags
} from './api';

import './index.css';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [archivedNotes, setArchivedNotes] = useState([]);
  const [newTags, setNewTags] = useState({}); 
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [tags, setTags] = useState([]); 
  const [editNoteId, setEditNoteId] = useState(null); 
  const [editForm, setEditForm] = useState({ title: '', content: '' }); 
  const [filterTag, setFilterTag] = useState('');
  const [tagsByNote, setTagsByNote] = useState({});



  useEffect(() => {
    loadNotes();
    loadArchivedNotes();
    loadTags();
  }, []);

  const loadNotes = async () => {
    const notesData = await fetchNotes();
    const tagsData = await fetchTags();
  
    
    const tagsByNoteId = tagsData.reduce((acc, note) => {
      acc[note.id] = note.Tags || []; 
      return acc;
    }, {});
    const notesWithTags = notesData.map((note) => ({
      ...note,
      Tags: tagsByNoteId[note.id] || [], 
    }));
  
    console.log(notesWithTags); 
    setNotes(notesWithTags); 
  };
  

  const loadArchivedNotes = async () => {
    const data = await fetchArchivedNotes();
    setArchivedNotes(data);
  };

  const loadTags = async () => {
    const data = await fetchTags();
    setTags(data);
  };

  const handleCreateNote = async () => {
    if (newNote.title && newNote.content) {
      try {
        console.log('Criando nota com dados:', newNote); 
        await createNote(newNote);
        setNewNote({ title: '', content: '' });
        loadNotes();
      } catch (error) {
        console.error("Erro ao criar nota:", error);
      }
    }
  };

  const handleArchiveNote = async (id) => {
    await archiveNote(id);
    loadNotes();
    loadArchivedNotes();
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(id);
    loadNotes();
    loadArchivedNotes();
  };

  const handleEditClick = (note) => {
    setEditNoteId(note.id);
    setEditForm({ title: note.title, content: note.content }); 
  };
  
  const handleEditSubmit = async () => {
    try {
      if (editForm.title && editForm.content) {
        await editNote(editNoteId, editForm);
        setEditNoteId(null);
        loadNotes(); 
      }
    } catch (error) {
      console.error("Erro ao editar nota:", error);
    }
  };
  
  const handleCancelEdit = () => {
    setEditNoteId(null); 
  };
  

  
  const handleAddTag = async (noteId) => {
    const tag = newTags[noteId]?.trim();
    if (tag) {
      try {
        await createTags(noteId, [tag]); 
        setNewTags({ ...newTags, [noteId]: '' });
        loadNotes(); 
      } catch (error) {
        console.error("Erro ao adicionar tag:", error);
      }
    }
  };

  
  const handleRemoveTag = async (noteId, tag) => {
    try {
      await removeTags(noteId, [tag]);
      loadNotes();
    } catch (error) {
      console.error("Erro ao remover tag:", error);
    }
  };

    const handleFilterNotes = async () => {
      if (filterTag) {
        const filteredNotes = await filterNotesByTag(filterTag);
        setNotes(filteredNotes);
      } else {
        loadNotes();
        console.log("hao vai") 
      }
    };
  

  return (
    <div>
      
      <h1>Notas</h1>
      
      
      <div>
        <input
          type="text"
          placeholder="Título"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <textarea
          placeholder="Conteúdo"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
        />
        <button onClick={handleCreateNote}>Criar Nota</button>
      </div>

      <h2>Notas Ativas</h2>

      <ul>
  {notes.map((note) => (
    <li key={note.id}>
      {editNoteId === note.id ? (
        <div>
          <input
            type="text"
            placeholder="Título"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          />
          <textarea
            placeholder="Conteúdo"
            value={editForm.content}
            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
          />
          <button onClick={handleEditSubmit}>Salvar</button>
          <button onClick={handleCancelEdit}>Cancelar</button>
        </div>
      ) : (
        <div>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button onClick={() => handleEditClick(note)}>Editar</button>
          <button onClick={() => handleArchiveNote(note.id)}>Arquivar</button>
          <button onClick={() => handleDeleteNote(note.id)}>Excluir</button>
        </div>
      )}

      <div>
        <h4>Tags:</h4>
        {note.Tags && note.Tags.length > 0 ? (
          <ul>
            {note.Tags.map((tag, index) => (
              <li key={index}>
                {tag.name}
                <button onClick={() => handleRemoveTag(note.id, tag.name)}>Remover</button> {/* Remover a tag */}
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem tags para esta nota.</p> 
        )}

        <input
          type="text"
          placeholder="Adicionar tag"
          value={newTags[note.id] || ''} 
          onChange={(e) => setNewTags({ ...newTags, [note.id]: e.target.value })}
        />
        <button onClick={() => handleAddTag(note.id)}>Adicionar Tag</button>
      </div>
    </li>
  ))}
</ul>




      <h2>Notas Arquivadas</h2>
      <ul>
        {archivedNotes.map((note) => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <button onClick={() => handleArchiveNote(note.id)}>Desarquivar</button>
          </li>
        ))}
      </ul>

      <h1>filtrar notas</h1>
      <div>
        <input
          type="text"
          placeholder="Filtrar por tag"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)} 
        />
        <button onClick={handleFilterNotes}>Filtrar</button>
      </div>

      <h2>Notas Filtradas</h2>
      <ul>
        {filterTag ? (
          notes.filter((note) => note.Tags.some((tag) => tag.name === filterTag)).map((note) => (
            <li key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <div>
                <h4>Tags:</h4>
                {note.Tags && note.Tags.length > 0 ? (
                  <ul>
                    {note.Tags.map((tag, index) => (
                      <li key={index}>{tag.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Sem tags para esta nota.</p>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>Nenhuma nota encontrada para essa tag.</p> 
          
        )}
      </ul>


    </div>
    
  );
};

export default App;


