import './Carousel.scss';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Pencil, Trash2 } from 'lucide-react';
import { AddCarouselItem, UpdateCarouselItem, DeleteCarouselItem, FetchAllCarouselItems } from '../../Api/Homepage/Carousel';
import { FetchAllProductItems } from '../../Api/Products/Products'; // Import the function that fetches products
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';

const Carousel = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [products, setProducts] = useState([]); // Store products
  const [search, setSearch] = useState(''); // Search input state
  const [formData, setFormData] = useState({ idC: '', title: '', image: '' });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeItemId, setRemoveItemId] = useState(null);

  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await FetchAllCarouselItems();
        setCarouselItems(response || []);
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await FetchAllProductItems();
        const uniqueProducts = Array.from(new Map(data.map(item => [item.idProd, item])).values());
        setProducts(uniqueProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCarouselData();
    fetchProducts();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddOrUpdateItem = async () => {
    try {
      if (editMode) {
        const updatedData = {
          image: formData.image,
          title: formData.title,
          idC: `/ProductPage/${formData.idC}`,
        };
        await UpdateCarouselItem(editItemId, updatedData);
      } else {
        const newItem = {
          image: formData.image,
          title: formData.title,
          idC: `/ProductPage/${formData.idC}`,
        };
        await AddCarouselItem(newItem);
      }
      setIsFormOpen(false);
      setEditMode(false);
      setFormData({ idC: '', title: '', image: '' });
      const response = await FetchAllCarouselItems();
      setCarouselItems(response || []);
    } catch (error) {
      console.error('Error adding/updating carousel item:', error);
    }
  };

  const handleOpenForm = (item = null) => {
    if (item) {
      setFormData({
        idC: item.idC.replace('/ProductPage/', ''),
        title: item.title,
        image: item.image,
      });
      setEditMode(true);
      setEditItemId(item._id);
    } else {
      setFormData({ idC: '', title: '', image: '' });
      setEditMode(false);
    }
    setIsFormOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    setRemoveItemId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRemoveItemId(null);
  };

  const handleConfirmRemove = async () => {
    try {
      await DeleteCarouselItem(removeItemId);
      setCarouselItems((prev) => prev.filter((item) => item._id !== removeItemId));
    } catch (error) {
      console.error('Error deleting carousel item:', error);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div className="carousel">
      <h1 className="h1Text">Carousel Management</h1>
      <button className="button" onClick={() => handleOpenForm()}>Add New Item</button>

      {isFormOpen && (
        <div className="formContainer">
          <h2>{editMode ? 'Update Item' : 'Add New Item'}</h2>
          <form onSubmit={(e) => e.preventDefault()}>
          <Select
  styles={{
    singleValue: (provided) => ({
      ...provided,
      color: 'black', // Change color of selected value text
    }),
    option: (provided) => ({
      ...provided,
      color: 'black', // Change color of option text
    }),
  }}
  options={products.map((product) => ({
    label: `${product.idProd} - ${product.nom}`,
    value: product.idProd,
  }))}
  value={
    products.find((product) => product.idProd === formData.idC)
      ? {
          label: `${products.find((product) => product.idProd === formData.idC).idProd} - ${products.find((product) => product.idProd === formData.idC).nom}`,
          value: formData.idC,
        }
      : null
  }
  onChange={(selectedOption) => {
    setFormData({ ...formData, idC: selectedOption.value });
  }}
  placeholder="Search and select a product"
/>



            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleFormChange} />
            <input type="text" name="image" placeholder="Image" value={formData.image} onChange={handleFormChange} />
            <img src={formData.image} alt={formData.image} className="thumbnail" />
            <button className="button" onClick={handleAddOrUpdateItem}>
              {editMode ? 'Update' : 'Add'}
            </button>
            <button className="button" onClick={() => setIsFormOpen(false)}>Cancel</button>
          </form>
        </div>
      )}

      <table className="carouselTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Image</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {carouselItems.map((item) => (
            <tr key={item._id}>
              <td>{item.idC.replace('/ProductPage/', '')}</td>
              <td>{item.title}</td>
              <td>
                <img src={item.image} alt={item.title} className="thumbnail" />
              </td>
              <td>
                <button className="button update" onClick={() => handleOpenForm(item)}><Pencil size={18} /></button>
              </td>
              <td>
                <button className="button deleteButton" onClick={() => handleOpenDeleteModal(item._id)}><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmationModal isOpen={isModalOpen} onClose={handleCloseModal} onConfirm={handleConfirmRemove} message={"Are you sure you want to delete this item?"} />
    </div>
  );
};

export default Carousel;
