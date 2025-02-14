import React, { useState, useMemo } from 'react';
import { Pencil, Trash2, Package, Ruler, Layers, Search, X } from 'lucide-react';
import './optionsdisplay.scss';

export const OptionsDisplay = ({ options, handleEdit, handleDelete }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    priceRange: { min: '', max: '' },
    sortBy: 'name', // name, priceAsc, priceDesc
    showCustomOptions: true,
    showSizeOptions: true,
    showMousseOptions: true
  });

  const getIconByType = (type) => {
    switch (type) {
      case 'options':
        return <Package className="type-icon" />;
      case 'sizes':
        return <Ruler className="type-icon" />;
      case 'mousse':
        return <Layers className="type-icon" />;
      default:
        return null;
    }
  };

  const getMaxPrice = (option) => {
    let prices = [];
    if (option.customOptions) {
      prices = [...prices, ...option.customOptions.map(o => parseFloat(o.prix_option))];
    }
    if (option.sizesOptions) {
      prices = [...prices, ...option.sizesOptions.map(o => parseFloat(o.prix_option))];
      prices = [...prices, ...option.sizesOptions.map(o => parseFloat(o.prix_coffre))];
    }
    if (option.mousseOptions) {
      prices = [...prices, ...option.mousseOptions.map(o => parseFloat(o.mousse_prix))];
    }
    return Math.max(...prices, 0);
  };

  const filteredOptions = useMemo(() => {
    if (!options) return [];
    
    return options.filter(option => {
      // Search filter
      const searchMatch = option.nomOption.toLowerCase().includes(filters.search.toLowerCase());
      
      // Type filter
      const typeMatch = filters.type === 'all' || option.typeOption === filters.type;
      
      // Price range filter
      const maxPrice = getMaxPrice(option);
      const priceMatch = (!filters.priceRange.min || maxPrice >= parseFloat(filters.priceRange.min)) &&
                        (!filters.priceRange.max || maxPrice <= parseFloat(filters.priceRange.max));
      
      // Options visibility filters
      const customMatch = !option.customOptions?.length || filters.showCustomOptions;
      const sizeMatch = !option.sizesOptions?.length || filters.showSizeOptions;
      const mousseMatch = !option.mousseOptions?.length || filters.showMousseOptions;
      
      return searchMatch && typeMatch && priceMatch && customMatch && sizeMatch && mousseMatch;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'priceAsc':
          return getMaxPrice(a) - getMaxPrice(b);
        case 'priceDesc':
          return getMaxPrice(b) - getMaxPrice(a);
        default:
          return a.nomOption.localeCompare(b.nomOption);
      }
    });
  }, [options, filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      priceRange: { min: '', max: '' },
      sortBy: 'name',
      showCustomOptions: true,
      showSizeOptions: true,
      showMousseOptions: true
    });
  };

  if (!options || options.length === 0) {
    return (
      <div className="no-options">
        <Package size={48} />
        <p>No options available</p>
      </div>
    );
  }

  return (
    <div className="options-container">
      <div className="filters-section">
        <div className="search-bar">
          <Search size={20} />
          <input type="text" placeholder="Search options..." value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} />
          {filters.search && (
            <button className="clear-search" onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
              <X size={23} />
            </button>
          )}
        </div>

        <div className="filters-controls">
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="all">All Types</option>
            <option value="options">Tarification Tissus</option>
            <option value="sizes">Dimensions</option>
            <option value="mousse">Mousse</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
          >
            <option value="name">Sort by Name</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>

          <div className="price-range">
            <input type="number" placeholder="Min Price" value={filters.priceRange.min} onChange={(e) => setFilters(prev => ({...prev,priceRange: { ...prev.priceRange, min: e.target.value }}))} />
            <span>-</span>
            <input type="number" placeholder="Max Price" value={filters.priceRange.max} onChange={(e) => setFilters(prev => ({...prev,priceRange: { ...prev.priceRange, max: e.target.value }}))} />
          </div>

          <div className="visibility-toggles">
            <label>
              <input type="checkbox" checked={filters.showCustomOptions} onChange={(e) => setFilters(prev => ({ ...prev, showCustomOptions: e.target.checked }))} />
              Show Tissus
            </label>
            <label>
              <input type="checkbox" checked={filters.showSizeOptions} onChange={(e) => setFilters(prev => ({ ...prev, showSizeOptions: e.target.checked }))}/>
              Show Dimensions
            </label>
            <label>
              <input type="checkbox" checked={filters.showMousseOptions} onChange={(e) => setFilters(prev => ({ ...prev, showMousseOptions: e.target.checked }))} />
              Show Mousse
            </label>
          </div>

          <button className="reset-filters" onClick={resetFilters}>Reset Filters</button>
        </div>
      </div>

      <div className="options-grid">
        {filteredOptions.map((option) => (
          <div key={option._id} className="option-card">
            <div className="option-header">
              <div className="option-title">
                {getIconByType(option.typeOption)}
                <h3>{option.nomOption}</h3>
              </div>
              <div className="option-actions">
                <button  onClick={() => handleEdit(option)}  className="action-button edit" aria-label="Edit option" >
                  <Pencil size={18} />
                </button>
                <button  onClick={() => handleDelete(option._id)}  className="action-button delete" aria-label="Delete option">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="option-type">
              {option.typeOption === "options" ? "Tarification Tissus" :
               option.typeOption === "sizes" ? "Dimensions" :
               option.typeOption === "mousse" ? "Mousse" : option.typeOption}
            </div>

            <div className="option-content">
              {option.customOptions && option.customOptions.length > 0 && filters.showCustomOptions && (
                <div className="option-section">
                  <h4>Tarification Tissus</h4>
                  <div className="custom-options">
                    {option.customOptions.map((custom, index) => (
                      <div key={index} className="custom-option-item">
                        <span>{custom.option_name}</span>
                        <span className="price">{custom.prix_option} TND</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {option.sizesOptions && option.sizesOptions.length > 0 && filters.showSizeOptions && (
                <div className="option-section">
                  <div className="sizes-options">
                    {option.sizesOptions.map((size, index) => (
                      <div key={index} className="size-option-item">
                        <div className="size-details">
                            <span className="dimension-label">Dimension:</span>
                            <span> {size.longueur}cm × {size.largeur}cm</span>
                        </div>
                        <div className="price-details">
                          <div>
                            <span className="price-label">Prix:</span>
                            <span className="price">{size.prix_option}.TND</span>
                          </div>
                          <div>
                            <span className="price-label">Prix Coffre:</span>
                            <span className="price">{size.prix_coffre}.TND</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {option.mousseOptions && option.mousseOptions.length > 0 && filters.showMousseOptions && (
                <div className="option-section">
                  <h4>Mousse</h4>
                  <div className="mousse-options">
                    {option.mousseOptions.map((mousse, index) => (
                      <div key={index} className="mousse-option-item">
                        <span>{mousse.mousse_name}</span>
                        <span className="price">{mousse.mousse_prix}.TND</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};