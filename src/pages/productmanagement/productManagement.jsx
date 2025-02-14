import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { addProduct } from '../../Api/Products/Products';
import { FetchAllOptionItems } from '../../Api/options/Options';
import { FetchAllCategoryItems } from '../../Api/Category/category';
import './productManagement.scss';
export default function ProductManagement(){
  const [formData, setFormData] = useState({ nom: '', typeProd : '',description: '', minPrice: '',maxPrice: '', quantite: '', display : '',subcategorie : '', categorie: '',longueur : '',largeur : '',hauteur : '',profondeur_assise : '',direction : '',images: [], customOptions: [], sizes: [], mousse: [],});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [options, setOptions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const allOptions = await FetchAllOptionItems();
        setOptions(allOptions);
      } catch (error) {console.error("Error fetching options:", error);}
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const allCategories = await FetchAllCategoryItems();
        setCategories(allCategories);
      } catch (error) {console.error("Error fetching categories:", error);}
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => { 
    const { name, value } = e.target;
    
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "subcategorie") {
      const selectedCat = categories.find(cat => cat.href === `/Shop/${value}`);
      setSubCategories(selectedCat ? selectedCat.subLinks : []);
    }
};

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    setFormData((prevData) => {const images = [...prevData.images];images[index].img = value;return { ...prevData, images };});
  };
  const handleAddImage = () => {
    setFormData((prevData) => ({...prevData,images: [...prevData.images, { img: "", hyperPoints: [] }],}));
  };
  const handleDeleteImage = (index) => {
    setFormData((prevData) => {const images = [...prevData.images];images.splice(index, 1);return { ...prevData, images };});
  };
  const handleOptionSelect = (e) => {
    const { name, value } = e.target;
    const selectedOption = options.find((opt) => opt.nomOption === value);
    setFormData((prevData) => {
      if (!selectedOption) {return {...prevData,[name]: [],};}
      switch (name) {
        case "customOptions":return { ...prevData, customOptions: selectedOption.customOptions || [],};
        case "sizes":return { ...prevData, sizes: selectedOption.sizesOptions || [], };
        case "mousse":return { ...prevData, mousse: selectedOption.mousseOptions || [], };
        default:return prevData;
      }
    });
  };
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const addedProduct = await addProduct(formData);
          setSuccessMessage('Product added successfully!',addedProduct);
          handleReset();
          setErrorMessage('');
      } catch (error) {
          setErrorMessage('Failed to add product. Please try again.');
          setSuccessMessage('');
      }  
  };
  const handleReset = () => {
    setFormData({nom: '',description: '',minPrice: '',maxPrice: '',quantite: '',idProd: '',typeProd: '',longueur: '',largeur: '',hauteur: '',profondeur_assise: '',declinaison: '',display: 'oui', subcategorie: '', categorie: '',direction: '', images: [], customOptions: [],});
    setErrorMessage('');
    setSuccessMessage('');
  };
  return (
    <div className="add-product-form">
      <h2>Add New Product</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
            <div className="form-item">
                <label>Product Id</label>
                <input type="text" name="idProd" autoComplete="off" value={formData.idProd} onChange={handleChange} required />
            </div>
            <div className="form-item">
                <label>Product type</label>
                <select className="select-style" name="typeProd" value={formData.typeProd} onChange={handleChange} required>
                  <option className="option-style" value=""></option>
                  <option className="option-style" value="canape_angle">Canapé D'angle</option>
                  <option className="option-style" value="canape">Canapé</option>
                  <option className="option-style" value="salon">Salon</option>
                  <option className="option-style" value="fauteuil">Pouf & Fauteuil</option>
                  <option className="option-style" value="tablebasse">Table basse</option>
                  <option className="option-style" value="meuble_tv">Meuble TV</option>
                  <option className="option-style" value="table_appoint">Table D'appoint</option>

                  <option className="option-style" value=""></option>

                  <option className="option-style" value="tableamanger">Table à manger</option>
                  <option className="option-style" value="chaise">Chaise</option>
                  <option className="option-style" value="buffet">Buffet</option>
                  <option className="option-style" value="vaisselier">Vaisselier</option>
                  <option className="option-style" value="baracocktail">Bar à Cocktail</option>

                  <option className="option-style" value=""></option>

                  <option className="option-style" value="LIT">Lit</option>
                  <option className="option-style" value="table_de_nuit">Table de Nuit</option>
                  <option className="option-style" value="commode">Commode</option>
                  <option className="option-style" value="coiffeuse">Coiffeuse</option>
                  <option className="option-style" value="dressing">Armoire & Dressing</option>
                  <option className="option-style" value="table">Bureau</option>

                  <option className="option-style" value=""></option>

                  <option className="option-style" value="lingedelit">Linge de lit</option>
                  <option className="option-style" value="plaidetcouverture">Plaid & Couverture</option>
                  <option className="option-style" value="coussin">Coussin</option>
                  <option className="option-style" value="rideau">Rideau</option>
                  <option className="option-style" value="tapis">Tapis</option>

                  <option className="option-style" value=""></option>

                  <option className="option-style" value="assietteetbol">Assiette & bol</option>
                  <option className="option-style" value="verreetcarafe">Verre & carafe</option>
                  <option className="option-style" value="ustensiletcouvert">Ustensil & Couvert</option>
                  <option className="option-style" value="platdeservice">Plat de service</option>

                  <option className="option-style" value=""></option>
                  
                  <option className="option-style" value="statueetsculpture">Statue & Sculpture</option>
                  <option className="option-style" value="objetdecoratif">Objet décoratif</option>
                  <option className="option-style" value="tableau">Tableau</option>
                  <option className="option-style" value="miroir">Miroir</option>
                  <option className="option-style" value="vegetauxetfleur">Végétaux et fleur</option>

                  <option className="option-style" value=""></option>
                  
                  <option className="option-style" value="boisdolivier">Bois d’olivier</option>
                  <option className="option-style" value="fibrenaturelle">Fibre Naturelle</option>
                  <option className="option-style" value="potterie">Potterie</option>
                  <option className="option-style" value="toiledejute">Toile de jute</option>
                  <option className="option-style" value="fouta">Fouta</option>

                  <option className="option-style" value=""></option>
                  
                  <option className="option-style" value="lampadaire">Lampadaire</option>
                  <option className="option-style" value="abatjour">Abat Jour</option>
                  <option className="option-style" value="lustre">Lustre</option>

                  <option className="option-style" value=""></option>

                  <option className="option-style" value="etagereetbibliotheque">Étagère & bibliothèque</option>
                  <option className="option-style" value="boitederangement">Boîte de rangement</option>
                  <option className="option-style" value="portemanteaux">Porte-manteaux</option>
                  <option className="option-style" value="portechaussures">Porte-chaussures</option>
                  <option className="option-style" value="panieretcoffre">Panier & coffre</option>
                </select>
                {/* <input type="text" name="typeProd" autoComplete="off" value={formData.typeProd} onChange={handleChange} required /> */}
            </div>
        </div>
        <div className="form-row">
            <div className="form-item">
                <label>Min Price</label>
                <input type="text" autoComplete="off" name="minPrice" value={formData.minPrice} onChange={handleChange} required />
            </div>
            <div className="form-item">
                <label>Max Price</label>
                <input type="text" autoComplete="off" name="maxPrice" value={formData.maxPrice} onChange={handleChange} required />
            </div>
        </div>
        <div>
            <label>Product Name</label>
            <input type="text" name="nom" autoComplete="off" value={formData.nom} onChange={handleChange} required />
        </div>
        <div>
            <label>Description</label>
            <textarea className="description-style" autoComplete="off" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Images</label>
          {formData.images.map((image, index) => (
            <div key={index} className="image-row">
              <input type="text" placeholder="Image link" value={image.img} onChange={(e) => handleImageChange(e, index)} required/>
              {image.img && (
                <img src={image.img} alt={`Preview ${index}`} className="image-preview" />
              )}
              <button type="button" onClick={() => handleDeleteImage(index)} className="remove-image-button">
                <Trash2 size={18}/>
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddImage} className="add-image-button">Add Image</button>
        </div>
        <div>
            <label>Quantity</label>
            <input type="text" name="quantite" value={formData.quantite} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <div className="form-item">
              <label>longueur</label>
              <input type="text" autoComplete="off" name="longueur" value={formData.longueur} onChange={handleChange} required />
          </div>
          <div className="form-item">
              <label>largeur</label>
              <input type="text" autoComplete="off" name="largeur" value={formData.largeur} onChange={handleChange} required />
          </div>
          <div className="form-item">
              <label>hauteur</label>
              <input type="text" autoComplete="off" name="hauteur" value={formData.hauteur} onChange={handleChange} required />
          </div>
        </div>
        <div>
            <label>profondeur assise</label>
            <input type="text" autoComplete="off" name="profondeur_assise" value={formData.profondeur_assise} onChange={handleChange} required />
        </div>
        <div className='form-row'>
          <div className='form-item'>
              <label>Display</label>
              <select className="select-style" name="display" value={formData.display} onChange={handleChange} required>
                  <option className="option-style" value="oui">Oui</option>
                  <option className="option-style" value="non">Non</option>
              </select>
          </div>
          <div className='form-item'>
            <label>Categorie</label>
            <select className="select-style" name="subcategorie" value={formData.subcategorie} onChange={handleChange} required>
              <option className="option-style" value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category._id} className="option-style" value={category.href.replace("/Shop/", "")}>
                  {category.title.replace("/Shop/", "")}
                </option>
              ))}
            </select>
          </div>
          <div className='form-item'>
            <label>Sous-Categorie</label>
            <select className="select-style" name="categorie" value={formData.categorie} onChange={handleChange} required>
              <option className="option-style" value="">Sélectionner une sous-catégorie</option>
              {subCategories.map((sub) => (
                <option key={sub.title} className="option-style" value={sub.href.replace("/Shop/", "")}>
                  {sub.title}
                </option>
              ))}
            </select>
          </div>
          <div className='form-item'>
              <label>Disposition</label>
              <select className="select-style" name="direction" value={formData.direction} onChange={handleChange}>
                  <option className="option-style" value="">null</option>
                  <option className="option-style" value="droite">Droite</option>
                  <option className="option-style" value="gauche">Gauche</option>
              </select>
          </div>
        </div>
        <div className='form-row'>
          {/* Option Tarification Tissus */}
          <div className='form-item'>
            <label>Option Tarification Tissus</label>
            <select className="select-style" name="customOptions" value={formData.customOptions} onChange={handleOptionSelect}>
              <option value="">null</option>
              {options.filter((option) => option.typeOption === "options").map((option) => (
                  <option key={option._id} value={option.nomOption}>
                    {option.nomOption}
                  </option>
                ))}
            </select>
          </div>
          {/* Option Dimensions */}
          <div className='form-item'>
            <label>Option Dimensions</label>
            <select className="select-style" name="sizes" value={formData.sizes} onChange={handleOptionSelect}>
              <option value="">null</option>
              {options.filter((option) => option.typeOption === "sizes").map((option) => (
                  <option key={option._id} value={option.nomOption}>
                    {option.nomOption}
                  </option>
                ))}
            </select>
          </div>
          {/* Option Mousse */}
          <div className='form-item'>
            <label>Option Mousse</label>
            <select className="select-style" name="mousse" value={formData.mousse} onChange={handleOptionSelect}>
              <option value="">null</option>
              {options.filter((option) => option.typeOption === "mousse").map((option) => (
                  <option key={option._id} value={option.nomOption}>
                    {option.nomOption}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <button className="cssbuttons-io" type="submit">
            <span>Add Product</span>
        </button>
        <button className="empty-button" type="button" onClick={handleReset}>Reset Form</button>
      </form>
    </div>
  );
};