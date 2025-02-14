import React, { useEffect, useState } from 'react';
import { FetchAllOptionItems, DeleteOptionById, UpdateOptionById, addOption } from '../../Api/options/Options';
import { Pencil, Trash2, X } from 'lucide-react';
import './Options.scss';
import { OptionsDisplay } from '../../components/OptionsDisplay/optionsdisplay'
const Options = () => {
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({ nomOption: '', typeOption: '', customOptions: [], sizesOptions: [], mousseOptions: []});
  const [editId, setEditId] = useState(null);
  const [customOption, setCustomOption] = useState({ option_name: '', prix_option: '' });
  const [customEditIndex, setCustomEditIndex] = useState(null);
  const [sizeOption, setSizeOption] = useState({ longueur: '', largeur: '', prix_option: '', prix_coffre: '' });
  const [sizeEditIndex, setSizeEditIndex] = useState(null);
  const [mousseOption, setMousseOption] = useState({ mousse_name: '', mousse_prix: '' });
  const [mousseEditIndex, setMousseEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await FetchAllOptionItems();
        setOptions(data);
      } catch (error) {console.error('Error fetching options:', error);}
    };
    fetchOptions();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCustomOptionChange = (e) => {
    const { name, value } = e.target;
    setCustomOption((prev) => ({ ...prev, [name]: value }));
  };
  const handleSizeOptionChange = (e) => {
    const { name, value } = e.target;
    setSizeOption((prev) => ({ ...prev, [name]: value }));
  };
  const handleMousseOptionChange = (e) => {
    const { name, value } = e.target;
    setMousseOption((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddCustomOption = () => {
    if (customEditIndex !== null) {
      setFormData((prev) => {
        const updatedCustomOptions = [...prev.customOptions];
        updatedCustomOptions[customEditIndex] = customOption;
        return { ...prev, customOptions: updatedCustomOptions };
      });
      setCustomEditIndex(null);
    } else {setFormData((prev) => ({ ...prev, customOptions: [...prev.customOptions, customOption], }));}
    setCustomOption({ option_name: '', prix_option: '' });
  };
  const handleAddSizeOption = () => {
    if (sizeEditIndex !== null) {
      setFormData((prev) => {
        const updatedSizesOptions = [...prev.sizesOptions];
        updatedSizesOptions[sizeEditIndex] = sizeOption;
        return { ...prev, sizesOptions: updatedSizesOptions };
      });
      setSizeEditIndex(null);
    } else {setFormData((prev) => ({...prev,sizesOptions: [...prev.sizesOptions, sizeOption],}));}
    setSizeOption({ longueur: '', largeur: '', prix_option: '', prix_coffre: '' });
  };
  const handleAddMousseOption = () => {
    if (mousseEditIndex !== null) {
      setFormData((prev) => {
        const updatedMousseOptions = [...prev.mousseOptions];
        updatedMousseOptions[mousseEditIndex] = mousseOption;
        return { ...prev, mousseOptions: updatedMousseOptions };
      });
      setMousseEditIndex(null);
    } else {setFormData((prev) => ({...prev,mousseOptions: [...prev.mousseOptions, mousseOption],}));}
    setMousseOption({ mousse_name: '', mousse_prix: '' });
  };
  const handleEditCustomOption = (index) => {
    setCustomEditIndex(index);
    setCustomOption({ ...formData.customOptions[index] });
  };
  const handleEditSizeOption = (index) => {
    setSizeEditIndex(index);
    setSizeOption({ ...formData.sizesOptions[index] });
  };
  const handleEditMousseOption = (index) => {
    setMousseEditIndex(index);
    setMousseOption({ ...formData.mousseOptions[index] });
  };
  const handleRemoveCustomOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      customOptions: prev.customOptions.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await UpdateOptionById(editId, formData);
        alert('Option updated successfully');
      } else {await addOption(formData);alert('Option added successfully');}
      setFormData({ nomOption: '', typeOption: '', customOptions: [], sizesOptions: [], mousseOptions: [], });
      setEditId(null);
      setMousseOption({ mousse_name: '', mousse_prix: '' });
      setCustomOption({ option_name: '', prix_option: '' });
      setSizeOption({ longueur: '', largeur: '', prix_option: '', prix_coffre: '' });
      const updatedOptions = await FetchAllOptionItems();
      setOptions(updatedOptions);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this option?')) {
      try {
        await DeleteOptionById(id);
        setOptions((prevOptions) => prevOptions.filter((option) => option._id !== id));
        alert('Option deleted successfully');
      } catch (error) {console.error('Error deleting option:', error); }
    }
  };
  const handleEdit = (option) => {
    setEditId(option._id);    
    setFormData(option);
    setShowForm(true);
  };
  return (
    <div className="options">
      <button onClick={() => setShowForm(!showForm)}>{showForm ? 'Hide Form' : 'Display Form'}</button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <button onClick={() => setShowForm(!showForm)} className='close-button'>
            <X size={25} />
          </button>
          <div>
            <label>Option Name:</label>
            <input type="text" name="nomOption" value={formData.nomOption} onChange={handleInputChange} required autoComplete='off' />
          </div>
          <div>
            <label>Option Type:</label>
            {/* <input type="text" name="typeOption" value={formData.typeOption} onChange={handleInputChange} required autoComplete='off' /> */}
            <select className="select-style" name="typeOption" value={formData.typeOption} onChange={handleInputChange} required>
              <option value=""></option>
              <option value="options">Tarification Tissus</option>
              <option value="sizes">Dimensions</option>
              <option value="mousse">Mousse</option>
            </select>
          </div>
          <div>
            <div className="custom-options-row">
              {formData.typeOption === 'options' && (
                <div>
                  {/* Add tarif tissus */}
                  <input type="text" name="option_name" autoComplete='off' value={customOption.option_name} placeholder="Option Name" onChange={handleCustomOptionChange}/>
                  <input type="text" name="prix_option" autoComplete='off' value={customOption.prix_option} placeholder="Option Price" onChange={handleCustomOptionChange} />
                  <button type="button" onClick={handleAddCustomOption} className='option-plus-btn'>{customEditIndex !== null ? 'Update' : '+ Tarif Tissus'}</button>
                </div>
              )}
              {formData.typeOption === 'sizes' && (
                <div>
                  <h4>Size Options</h4>
                  {/* Add size options */}
                  <input type="text" name="longueur" autoComplete='off' value={sizeOption.longueur} placeholder="longueur" onChange={handleSizeOptionChange}/>
                  <input type="text" name="largeur" autoComplete='off' value={sizeOption.largeur} placeholder="largeur" onChange={handleSizeOptionChange} />
                  <input type="text" name="prix_option" autoComplete='off' value={sizeOption.prix_option} placeholder="Prix Dimension" onChange={handleSizeOptionChange} />
                  <input type="text" name="prix_coffre" autoComplete='off' value={sizeOption.prix_coffre} placeholder="Prix Coffre" onChange={handleSizeOptionChange} />
                  <button type="button" onClick={handleAddSizeOption} className='option-plus-btn'>{sizeEditIndex !== null ? 'Update' : '+ Dimension'}</button>
                </div>
              )}
              {formData.typeOption === 'mousse' && (
                <div>
                  <h4>Mousse Options</h4>
                  {/* Add mousse options */}
                  <input type="text" name="mousse_name" autoComplete='off' value={mousseOption.mousse_name} placeholder="mousse name" onChange={handleMousseOptionChange}/>
                  <input type="text" name="mousse_prix" autoComplete='off' value={mousseOption.mousse_prix} placeholder="mousse Price" onChange={handleMousseOptionChange} />
                  <button type="button" onClick={handleAddMousseOption} className='option-plus-btn'>{mousseEditIndex !== null ? 'Update' : '+ Mousse'}</button>
                </div>
              )}
            </div>
            <table className="options-custom">
              <thead>
                <tr>
                  {formData.typeOption === 'options' && (
                    <>
                      <td>Option Name</td><td>Option Price</td><td>Edit</td><td>Delete</td>
                    </>
                  )}
                  {formData.typeOption === 'sizes' && (
                    <>
                      <td>Longueur</td><td>Largeur</td><td>Prix Dimension</td><td>Prix Coffre</td><td>Edit</td><td>Delete</td>
                    </>
                  )}
                  {formData.typeOption === 'mousse' && (
                    <>
                      <td>Mousse Name</td><td>Mousse Price</td><td>Edit</td><td>Delete</td>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {formData.typeOption === 'options' &&
                  formData.customOptions.map((custom, index) => (
                    <tr key={index}>
                      <td>{custom.option_name}</td>
                      <td>{custom.prix_option}</td>
                      <td><button type="button" onClick={() => handleEditCustomOption(index)} className="icon-pencil"><Pencil size={18} /></button></td>
                      <td><button type="button" onClick={() => handleRemoveCustomOption(index)} className="icon-delete"><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                {formData.typeOption === 'sizes' &&
                  formData.sizesOptions.map((size, index) => (
                    <tr key={index}>
                      <td>{size.longueur}</td>
                      <td>{size.largeur}</td>
                      <td>{size.prix_option}</td>
                      <td>{size.prix_coffre}</td>
                      <td><button type="button" onClick={() => handleEditSizeOption(index)} className="icon-pencil" ><Pencil size={18} /></button></td>
                      <td><button type="button" onClick={() =>setFormData((prev) => ({...prev,sizesOptions: prev.sizesOptions.filter((_, i) => i !== index), }))} className="icon-delete" ><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                {formData.typeOption === 'mousse' &&
                  formData.mousseOptions.map((mousse, index) => (
                    <tr key={index}>
                      <td>{mousse.mousse_name}</td>
                      <td>{mousse.mousse_prix}</td>
                      <td><button type="button" onClick={() => handleEditMousseOption(index)} className="icon-pencil" ><Pencil size={18} /></button></td>
                      <td><button type="button" onClick={() =>setFormData((prev) => ({ ...prev, mousseOptions: prev.mousseOptions.filter((_, i) => i !== index),}))} className="icon-delete"><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <button type="submit">{editId ? 'Update Option' : 'Add Option'}</button>
        </form>
      )}
      {options && (<OptionsDisplay options={options} handleEdit={handleEdit} handleDelete={handleDelete} />)}
    </div>
  );
};
export default Options;