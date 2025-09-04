


import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 

  Edit3, 
  Trash2, 
  Eye,
  X, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FolderOpen,

} from 'lucide-react';
import '../../styles/Note.css';
import { createNote, deleteNote, getNotes, updateNote } from '../../services/note';
import type { CategoryNote } from '../../types/category';
import type { CreateNote, Note, NoteFormData } from '../../types/note';
import { getCategories } from '../../services/category';
import Swal from 'sweetalert2';





const noteSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede tener más de 100 caracteres')
    .required('El nombre es requerido'),
  description: yup
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede tener más de 500 caracteres')
    .required('La descripción es requerida'),
  category_id: yup
    .number()
    .required('Debes seleccionar una categoría'),
}).required();

const NoteComponent: React.FC = () => {

  const [showModal, setShowModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<CategoryNote[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<NoteFormData>({
    resolver: yupResolver(noteSchema),
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const notesData = await getNotes();
        const categoriesData = await getCategories();

        setNotes(notesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Resetear paginación cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filterName, filterCategory]);

  // Filtrar notas
  const filteredNotes = notes.filter(note => {
    const matchesName = note.name.toLowerCase().includes(filterName.toLowerCase());
    const matchesCategory = filterCategory === '' || note.category.id === filterCategory;
    return matchesName && matchesCategory;
  });

  // Paginación
  const totalPages = Math.ceil(filteredNotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotes = filteredNotes.slice(startIndex, endIndex);



  const onSubmit = async (data: NoteFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (editingNote) {
        // Actualizar nota existente
        await updateNote(editingNote.id, data);
        setSuccess('Nota actualizada exitosamente');
      } else {
        // Crear nueva nota
        const createNoteData: CreateNote = {
          name: data.name,
          description: data.description,
          category: data.category_id
        };
        
        await createNote(createNoteData);
        setSuccess('Nota creada exitosamente');
      }

      // Recargar todas las notas desde el servidor
      const updatedNotes = await getNotes();
      setNotes(updatedNotes);

      reset();
      setShowModal(false);
      setEditingNote(null);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error al procesar la nota:', err);
      setError('Error al procesar la nota');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setValue('name', note.name);
    setValue('description', note.description);
    setValue('category_id', note.category.id);
    setShowModal(true);
  };

  const handleDelete = async (noteId: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro de que quieres eliminar esta nota?",
      text: "No podrás revertir este cambio!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      setIsLoading(true);
      setError('');
      setSuccess('');

      try {
        await deleteNote(noteId);
        setSuccess('Nota eliminada exitosamente');
        
        // Recargar todas las notas desde el servidor
        const updatedNotes = await getNotes();
        setNotes(updatedNotes);
        
        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Error al eliminar la nota');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewInfo = (note: Note) => {
    setSelectedNote(note);
    setShowInfoModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNote(null);
    reset();
    setError('');
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    setSelectedNote(null);
  };

  const handleCreateNew = () => {
    setEditingNote(null);
    reset();
    setShowModal(true);
  };

  return (
    <motion.div 
      className="note-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="note-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="header-content">
          <h1 className="note-title">Notas</h1>
        </div>
      </motion.div>

      {/* Spinner de loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="loading-spinner-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            <span className="loading-text">Procesando...</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-container"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="error-icon" />
            <p className="error-text">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="success-container"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="success-icon" />
            <p className="success-text">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="note-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Filtros y controles */}
        <div className="controls-section">
          <div className="search-filter-container">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar notas..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value === '' ? '' : Number(e.target.value))}
                className="filter-select"
              >
                <option value="">Todas las categorías</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <motion.button
              className="create-btn"
              onClick={handleCreateNew}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="btn-icon" />
              <span>Nueva Nota</span>
            </motion.button>
          </div>
        </div>

        {/* Lista de notas */}
        <div className="notes-list">
          {currentNotes.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FileText className="empty-icon" />
              <h3 className="empty-title">No hay notas</h3>
              <p className="empty-description">
                {filterName || filterCategory ? 'No se encontraron notas con esos filtros' : 'Crea tu primera nota para organizar tus ideas'}
              </p>
              {!filterName && !filterCategory && (
                <motion.button
                  className="create-btn-secondary"
                  onClick={handleCreateNew}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="btn-icon" />
                  <span>Crear Nota</span>
                </motion.button>
              )}
            </motion.div>
          ) : (
            <>
              {currentNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  className="note-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                >
                  <div className="note-info">
                    <div className="note-icon">
                      <FileText />
                    </div>
                    <div className="note-details">
                      <h3 className="note-name">{note.name}</h3>
                      <p className="note-description">
                        {note.description.length > 100 
                          ? `${note.description.substring(0, 100)}...` 
                          : note.description
                        }
                      </p>
                      <div className="note-meta">
                        <span className="note-category">
                          <FolderOpen className="meta-icon" />
                          {note.category.name}
                        </span>
                        
                      </div>
                    </div>
                  </div>
                  <div className="note-actions">
                    <motion.button
                      className="action-btn info-btn"
                      onClick={() => handleViewInfo(note)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      title="Ver detalles"
                    >
                      <Eye />
                    </motion.button>
                    <motion.button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(note)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      title="Editar nota"
                    >
                      <Edit3 />
                    </motion.button>
                    <motion.button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(note.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      title="Eliminar nota"
                    >
                      <Trash2 />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <motion.div 
            className="pagination-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft />
            </motion.button>
            
            <div className="page-info">
              <span className="page-text">
                Página {currentPage} de {totalPages}
              </span>
              <span className="total-text">
                {filteredNotes.length} nota{filteredNotes.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <motion.button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Modal para crear/editar nota */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay" 
            onClick={handleCloseModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <div className="modal-title-section">
                  <FileText className="modal-title-icon" />
                  <h2 className="modal-title">
                    {editingNote ? 'Editar Nota' : 'Nueva Nota'}
                  </h2>
                </div>
                <motion.button 
                  className="close-btn" 
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
                <div className="input-group">
                  <label htmlFor="noteName" className="input-label">
                    <FileText className="input-icon" />
                    Título de la Nota
                  </label>
                  <input
                    id="noteName"
                    type="text"
                    {...register('name')}
                    className={`modal-input ${errors.name ? 'error' : ''}`}
                    placeholder="Ingresa el título de la nota"
                    maxLength={100}
                  />
                  {errors.name && (
                    <motion.span 
                      className="error-message"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.name.message}
                    </motion.span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="noteDescription" className="input-label">
                    <FileText className="input-icon" />
                    Descripción
                  </label>
                  <textarea
                    id="noteDescription"
                    {...register('description')}
                    className={`modal-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Ingresa la descripción de la nota"
                    maxLength={500}
                    rows={4}
                  />
                  {errors.description && (
                    <motion.span 
                      className="error-message"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.description.message}
                    </motion.span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="noteCategory" className="input-label">
                    <FolderOpen className="input-icon" />
                    Categoría
                  </label>
                  <select
                    id="noteCategory"
                    {...register('category_id')}
                    className={`modal-select ${errors.category_id ? 'error' : ''}`}
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <motion.span 
                      className="error-message"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {errors.category_id.message}
                    </motion.span>
                  )}
                </div>

                <div className="modal-actions">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoading ? (
                      <motion.div 
                        className="loading-spinner-small"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <CheckCircle className="btn-icon" />
                    )}
                    {isLoading ? 'Procesando...' : (editingNote ? 'Actualizar' : 'Crear')}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCloseModal}
                    className="cancel-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para información de la nota */}
      <AnimatePresence>
        {showInfoModal && selectedNote && (
          <motion.div 
            className="modal-overlay" 
            onClick={handleCloseInfoModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="modal-content info-modal" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <div className="modal-title-section">
                  <FileText className="modal-title-icon" />
                  <h2 className="modal-title">Detalles de la Nota</h2>
                </div>
                <motion.button 
                  className="close-btn" 
                  onClick={handleCloseInfoModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.button>
              </div>

              <div className="info-content">
                <div className="info-section">
                  <h3 className="info-label">Título</h3>
                  <p className="info-value">{selectedNote.name}</p>
                </div>
                
                <div className="info-section">
                  <h3 className="info-label">Descripción</h3>
                  <p className="info-value description">{selectedNote.description}</p>
                </div>
                
                <div className="info-section">
                  <h3 className="info-label">Categoría</h3>
                  <p className="info-value">
                    <FolderOpen className="info-icon" />
                    {selectedNote.category.name}
                  </p>
                </div>
                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NoteComponent;