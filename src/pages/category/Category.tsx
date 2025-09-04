import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderOpen, 
  Plus, 
  Search, 

  Edit3, 
  Trash2, 
  X, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,

} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import '../../styles/Category.css';
import type { Category, CategoryFormData } from '../../types/category';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../services/category';
import Swal from 'sweetalert2';





const categorySchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .required('El nombre es requerido'),
}).required();

const CategoryComponent: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterName, setFilterName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [categories, setCategories] = useState<Category[]>([]);
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
  });


  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };
    fetchData();
  }, []);

  // Si nos navegan con state.openCreate, abrir el modal automáticamente
  useEffect(() => {
    if ((location.state as { openCreate?: boolean } | null)?.openCreate) {
      setEditingCategory(null);
      reset();
      setShowModal(true);
      // limpiar el estado para evitar re-aperturas al navegar atrás
      window.history.replaceState({}, document.title);
    }
  }, [location.state, reset]);


  // Filtrar categorías
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(filterName.toLowerCase())
  );

  // Paginación
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      

      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        setCategories(await getCategories());
        setSuccess('Categoría actualizada exitosamente');
      } else {
        await createCategory(data);
        setCategories(await getCategories());
        setSuccess('Categoría creada exitosamente');
      }

      reset();
      setShowModal(false);
      setEditingCategory(null);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al procesar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setShowModal(true);
  };

  const handleDelete = async (categoryId: number) => {
    const result = await Swal.fire({
      title: "¿Estás seguro de que quieres eliminar esta categoría?",
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
        await deleteCategory(categoryId);
        setCategories(await getCategories());
        setSuccess('Categoría eliminada exitosamente');
        
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Error al eliminar la categoría');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    reset();
    setError('');
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    reset();
    setShowModal(true);
  };

  return (
    <motion.div 
      className="category-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="category-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="header-content">
          <h1 className="category-title">Categorías</h1>
        </div>
      </motion.div>

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
        className="category-content"
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
                placeholder="Buscar categorías..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="search-input"
              />
            </div>
            <motion.button
              className="create-btn"
              onClick={handleCreateNew}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Plus className="btn-icon" />
              <span>Nueva Categoría</span>
            </motion.button>
          </div>
        </div>

        {/* Lista de categorías */}
        <div className="categories-list">
          {currentCategories.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FolderOpen className="empty-icon" />
              <h3 className="empty-title">No hay categorías</h3>
              <p className="empty-description">
                {filterName ? 'No se encontraron categorías con ese nombre' : 'Crea tu primera categoría para organizar tus notas'}
              </p>
              {!filterName && (
                <motion.button
                  className="create-btn-secondary"
                  onClick={handleCreateNew}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="btn-icon" />
                  <span>Crear Categoría</span>
                </motion.button>
              )}
            </motion.div>
          ) : (
            <>
              {currentCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  className="category-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                >
                  <div className="category-info">
                    <div className="category-icon">
                      <FolderOpen />
                    </div>
                    <div className="category-details">
                      <h3 className="category-name">{category.name}</h3>
                      
                    </div>
                  </div>
                  <div className="category-actions">
                    <motion.button
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(category)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      title="Editar categoría"
                    >
                      <Edit3 />
                    </motion.button>
                    <motion.button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(category.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      title="Eliminar categoría"
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
                {filteredCategories.length} categoría{filteredCategories.length !== 1 ? 's' : ''}
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

      {/* Modal para crear/editar categoría */}
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
                  <FolderOpen className="modal-title-icon" />
                  <h2 className="modal-title">
                    {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
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
                  <label htmlFor="categoryName" className="input-label">
                    <FolderOpen className="input-icon" />
                    Nombre de la Categoría
                  </label>
                  <input
                    id="categoryName"
                    type="text"
                    {...register('name')}
                    className={`modal-input ${errors.name ? 'error' : ''}`}
                    placeholder="Ingresa el nombre de la categoría"
                    maxLength={50}
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
                    {isLoading ? 'Procesando...' : (editingCategory ? 'Actualizar' : 'Crear')}
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
    </motion.div>
  );
};

export default CategoryComponent;
