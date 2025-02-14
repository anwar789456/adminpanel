import React, { useState, useEffect } from 'react';
import { FetchAllProductItems, UpdateProductById } from '../../Api/Products/Products';
import { Pencil, Trash2, Sliders } from 'lucide-react';
import './ProductList.scss';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editData, setEditData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    price: { min: '', max: '' },
    dimensions: {
      longueur: { min: '', max: '' },
      largeur: { min: '', max: '' },
      hauteur: { min: '', max: '' }
    },
    subcategorie: 'all',
    sortBy: 'name'
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await FetchAllProductItems();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setErrorMessage('Failed to fetch products.');
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, filters);
  };

  const handleFilterChange = (category, value) => {
    const newFilters = { ...filters, [category]: value };
    setFilters(newFilters);
    applyFilters(searchTerm, newFilters);
  };

  const applyFilters = (search, currentFilters) => {
    let filtered = [...products];

    // Search filter
    if (search) {
      filtered = filtered.filter((product) =>
        ['idProd', 'nom', 'quantite', 'minPrice', 'maxPrice', 'disponibilite', 'subcategorie', 'direction', 'display', 'typeProd']
          .some((key) => product[key]?.toLowerCase().includes(search))
      );
    }

    // Price filter
    if (currentFilters.price.min) {
      filtered = filtered.filter(product => Number(product.minPrice) >= Number(currentFilters.price.min));
    }
    if (currentFilters.price.max) {
      filtered = filtered.filter(product => Number(product.maxPrice) <= Number(currentFilters.price.max));
    }

    // Dimensions filter
    Object.entries(currentFilters.dimensions).forEach(([dimension, range]) => {
      if (range.min) {
        filtered = filtered.filter(product => Number(product[dimension]) >= Number(range.min));
      }
      if (range.max) {
        filtered = filtered.filter(product => Number(product[dimension]) <= Number(range.max));
      }
    });

    // Category filter
    if (currentFilters.subcategorie !== 'all') {
      filtered = filtered.filter(product => product.subcategorie === currentFilters.subcategorie);
    }

    // Sorting
    switch (currentFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => Number(a.minPrice) - Number(b.minPrice));
        break;
      case 'price-high':
        filtered.sort((a, b) => Number(b.minPrice) - Number(a.minPrice));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.nom.localeCompare(b.nom));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.nom.localeCompare(a.nom));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setFilters({
      price: { min: '', max: '' },
      dimensions: {
        longueur: { min: '', max: '' },
        largeur: { min: '', max: '' },
        hauteur: { min: '', max: '' }
      },
      subcategorie: 'all',
      sortBy: 'name'
    });
    setSearchTerm('');
    setFilteredProducts(products);
  };

  const handleEdit = (product) => {
    setEditData({ ...product, images: product.images || [] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await UpdateProductById(editData._id, editData);
      setProducts((prev) =>
        prev.map((item) => (item._id === editData._id ? editData : item))
      );
      setFilteredProducts((prev) =>
        prev.map((item) => (item._id === editData._id ? editData : item))
      );
      setEditData(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditData(null);
    setErrorMessage('');
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddImage = () => {
    setEditData((prev) => ({
      ...prev,
      images: [...(prev.images || []), { img: '' }],
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = editData.images.filter((_, i) => i !== index);
    setEditData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...editData.images];
    updatedImages[index] = { ...updatedImages[index], img: value };
    setEditData((prev) => ({ ...prev, images: updatedImages }));
  };

  const categories = [...new Set(products.map(product => product.subcategorie))];

  return (
    <div className="productlist">
      <h2>Product List</h2>
      {errorMessage && <div className="productlist__error">{errorMessage}</div>}
      <div className="productlist__filters">
        <div className="productlist__search">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm} 
            onChange={handleSearch} 
            className="productlist__search-input"
          />
          <button 
            className="productlist__filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Sliders size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="productlist__advanced-filters">
            <div className="filters-grid">
              <div className="filter-group">
                <h3>Price Range</h3>
                <div className="range-inputs">
                  <input type="number" placeholder="Min Price" value={filters.price.min} onChange={(e) => handleFilterChange('price', { ...filters.price, min: e.target.value })} />
                  <input type="number" placeholder="Max Price" value={filters.price.max} onChange={(e) => handleFilterChange('price', { ...filters.price, max: e.target.value })} />
                  
                </div>
              </div>

              <div className="filter-group">
                <h3>Category</h3>
                <select
                  value={filters.subcategorie}
                  onChange={(e) => handleFilterChange('subcategorie', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <h3>Dimensions</h3>
                {Object.entries(filters.dimensions).map(([dimension, range]) => (
                  <div key={dimension} className="dimension-filter">
                    <label>{dimension}</label>
                    <div className="range-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={range.min}
                        onChange={(e) => handleFilterChange('dimensions', {
                          ...filters.dimensions,
                          [dimension]: { ...range, min: e.target.value }
                        })}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={range.max}
                        onChange={(e) => handleFilterChange('dimensions', {
                          ...filters.dimensions,
                          [dimension]: { ...range, max: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="filter-group">
                <h3>Sort By</h3>
                <select value={filters.sortBy} onChange={(e) => handleFilterChange('sortBy', e.target.value)}>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>

            <button className="productlist__reset-filters" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="productlist__grid">
          {filteredProducts.map((product) => (
            <div className="productlist__card" key={product._id}>
              <img
                src={product.images[0]?.img}
                alt={product.nom} 
                className="productlist__image"
              />
              <div className="productlist__details">
                <h3>{product.nom}</h3>
                <h4>ID: {product.idProd}</h4>
                <p>Min: {product.minPrice} TND</p>
                <p>Longueur: {product.longueur}cm</p>
                <p>Largeur: {product.largeur}cm</p>
                <p>Hauteur: {product.hauteur}cm</p>
                <button className="productlist__edit" onClick={() => handleEdit(product)}>
                  <Pencil size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="productlist__loading">No products found.</div>
      )}

      {editData && (
        <div className="productlist__overlay">
          <form className="productlist__form" onSubmit={handleUpdate}>
            <h2>Edit Product</h2>
            <label>
              Name:
              <input type="text" value={editData.nom || ''} onChange={(e) => handleInputChange('nom', e.target.value)}/>
            </label>
            <label>
              Description:
              <textarea className="textarea-description" value={editData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)}/>
            </label>
            <label>
              Images:
              {editData.images.map((image, index) => (
                <div key={index} className="productlist__image-edit">
                  <div className='flex'>
                    <input
                      type="text"
                      value={image.img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder={`Image ${index + 1} URL`}
                    />
                    <button onClick={() => handleRemoveImage(index)} className="remove-image-button">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                  <img src={image.img} alt={`Preview ${index + 1}`} className="img-tag" />
                </div>
              ))}
              <button type="button" onClick={handleAddImage} className="add-image-button">
                Add Image
              </button>
            </label>
            <label>
              Min Price:
              <input type="text" value={editData.minPrice || ''} onChange={(e) => handleInputChange('minPrice', e.target.value)}/>
            </label>
            <label>
              Max Price:
              <input type="text" value={editData.maxPrice || ''} onChange={(e) => handleInputChange('maxPrice', e.target.value)}/>
            </label>
            <label>
              Quantity:
              <input type="text" value={editData.quantite || ''} onChange={(e) => handleInputChange('quantite', e.target.value)}/>
            </label>
            <label>
              longueur:
              <input type="text" value={editData.longueur || ''} onChange={(e) => handleInputChange('longueur', e.target.value)}/>
            </label>
            <label>
              largeur:
              <input type="text" value={editData.largeur || ''} onChange={(e) => handleInputChange('largeur', e.target.value)}/>
            </label>
            <label>
              hauteur:
              <input type="text" value={editData.hauteur || ''} onChange={(e) => handleInputChange('hauteur', e.target.value)}/>
            </label>
            <label>
              Display:
              <select className='dropdown-style' value={editData.display || ''} onChange={(e) => handleInputChange('display', e.target.value)}>
                <option value="" disabled>Select</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            </label>
            {editData.direction &&
              <label>
                direction:
                <input type="text" value={editData.direction || ''} onChange={(e) => handleInputChange('direction', e.target.value)}/>
              </label>
            }
            <div className="productlist__form-actions">
              <button type="button" onClick={handleCancel}>Cancel</button>
              <button type="submit">Update</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductList;