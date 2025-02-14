import { useEffect, useState } from 'react'
import { FetchAllCategoryItems, AddCategoryItem, UpdateCategoryItem, DeleteCategoryItem } from "../../Api/Category/category"
import { X, Plus } from 'lucide-react'
import { DraggableSublinks } from '../../components/DragSublinks/DraggableSublinks'
import './Category.scss'

function Categories() {
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({title: '', href: '', src: '', display: 'oui', subLinks: []})
  const [tempSubLink, setTempSubLink] = useState({title: '', href: '', src: ''})
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSubLink, setEditingSubLink] = useState({ categoryId: null, index: null, data: null })
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [addingSubLinkTo, setAddingSubLinkTo] = useState(null)

  useEffect(() => {fetchCategories()}, [])

  const fetchCategories = async () => {
    try {
      const data = await FetchAllCategoryItems()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      await AddCategoryItem(newCategory)
      setNewCategory({ title: '', href: '', src: '', display: 'oui', subLinks: [] })
      fetchCategories()
      setIsFormVisible(false)
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const handleAddSubLink = () => {
    if (tempSubLink.title && tempSubLink.href) {
      setNewCategory({...newCategory,subLinks: [...newCategory.subLinks, { ...tempSubLink }]})
      setTempSubLink({ title: '', href: '', src: '' })
    }
  }

  const handleAddSubLinkToCategory = async (categoryId) => {
    if (!tempSubLink.title || !tempSubLink.href) return

    const category = categories.find(cat => cat._id === categoryId)
    if (!category) return

    const updatedCategory = {
      ...category,
      subLinks: [...category.subLinks, { ...tempSubLink }]
    }

    try {
      await UpdateCategoryItem(categoryId, updatedCategory)
      setTempSubLink({ title: '', href: '', src: '' })
      setAddingSubLinkTo(null)
      fetchCategories()
    } catch (error) {
      console.error('Error adding sublink to category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await DeleteCategoryItem(categoryId)
        fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  const handleStartEditCategory = (category) => {
    setEditingCategory({
      _id: category._id,
      title: category.title,
      href: category.href,
      src: category.src,
      display: category.display,
      subLinks: category.subLinks
    })
  }

  const handleUpdateCategory = async (categoryId) => {
    if (!editingCategory) return
    try {
      await UpdateCategoryItem(categoryId, editingCategory)
      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleStartEditSubLink = (categoryId, index, subLink) => {
    setEditingSubLink({
      categoryId,
      index,
      data: { ...subLink }
    })
  }

  const handleUpdateSubLink = async (categoryId, subLinkIndex) => {
    if (!editingSubLink.data) return
    const category = categories.find(cat => cat._id === categoryId)
    if (!category) return
    const updatedSubLinks = [...category.subLinks]
    updatedSubLinks[subLinkIndex] = editingSubLink.data
    const updatedCategory = { ...category, subLinks: updatedSubLinks }
    try {
      await UpdateCategoryItem(categoryId, updatedCategory)
      setEditingSubLink({ categoryId: null, index: null, data: null })
      fetchCategories()
    } catch (error) {
      console.error('Error updating sublink:', error)
    }
  }

  const handleDeleteSubLink = async (categoryId, subLinkIndex) => {
    if (window.confirm('Are you sure you want to delete this sublink?')) {
      const category = categories.find(cat => cat._id === categoryId)
      if (!category) return
      const updatedSubLinks = category.subLinks.filter((_, index) => index !== subLinkIndex)
      const updatedCategory = { ...category, subLinks: updatedSubLinks }
      try {
        await UpdateCategoryItem(categoryId, updatedCategory)
        fetchCategories()
      } catch (error) {
        console.error('Error deleting sublink:', error)
      }
    }
  }

  const handleReorderSublinks = async (categoryId, reorderedSublinks) => {
    const category = categories.find(cat => cat._id === categoryId)
    if (!category) return

    const updatedCategory = {
      ...category,
      subLinks: reorderedSublinks
    }

    try {
      await UpdateCategoryItem(categoryId, updatedCategory)
      fetchCategories()
    } catch (error) {
      console.error('Error reordering sublinks:', error)
    }
  }

  return (
    <div className="container">
      <div className="header-section">
        <h1>Category Management</h1>
        <button className="add-category-btn" onClick={() => setIsFormVisible(true)}>Add New Category</button>
      </div>

      {isFormVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Category</h2>
              <button className="close-btn" onClick={() => setIsFormVisible(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="form-section">
              <form onSubmit={handleAddCategory}>
                <div className="form-group">
                  <input type="text" placeholder="Category Title" value={newCategory.title} onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })} required />
                  <input type="text" placeholder="Category Href" value={newCategory.href} onChange={(e) => setNewCategory({ ...newCategory, href: e.target.value })} required />
                  <input type="text" placeholder="Category Image Source" value={newCategory.src} onChange={(e) => setNewCategory({ ...newCategory, src: e.target.value })} required />
                  <select value={newCategory.display} onChange={(e) => setNewCategory({ ...newCategory, display: e.target.value })} required className="display-select">
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </div>

                <div className="sublinks-form">
                  <h3>Add SubLinks</h3>
                  <div className="form-group">
                    <input type="text" placeholder="SubLink Title" value={tempSubLink.title} onChange={(e) => setTempSubLink({ ...tempSubLink, title: e.target.value })} />
                    <input type="text" placeholder="SubLink Href" value={tempSubLink.href} onChange={(e) => setTempSubLink({ ...tempSubLink, href: e.target.value })} />
                    <input type="text" placeholder="SubLink Image Source" value={tempSubLink.src} onChange={(e) => setTempSubLink({ ...tempSubLink, src: e.target.value })} />
                    <button type="button" className='submit-btn' onClick={handleAddSubLink}>Add SubLink</button>
                  </div>

                  {newCategory.subLinks.length > 0 && (
                    <div className="sublinks-table">
                      <h4>Current SubLinks</h4>
                      <table>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Href</th>
                            <th>Image Source</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {newCategory.subLinks.map((link, index) => (
                            <tr key={index}>
                              <td>{link.title}</td>
                              <td>{link.href}</td>
                              <td>{link.src}</td>
                              <td>
                                <button className='delete-button' type="button" onClick={() => setNewCategory({ ...newCategory, subLinks: newCategory.subLinks.filter((_, i) => i !== index) })}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <button type="submit" className="submit-btn">Create Category</button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="categories-list">
        {categories.map(category => (
          <div key={category._id} className="category-card">
            <div className="category-header">
              {editingCategory?._id === category._id ? (
                <>
                  <div className='editing-content-sublinks'>
                    <div className='title-input'>
                      <h3>Title</h3>
                      <input type="text" value={editingCategory.title} onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })} />
                    </div>
                    <div className='title-input'>
                      <h3>Href</h3>
                      <input type="text" value={editingCategory.href} onChange={(e) => setEditingCategory({ ...editingCategory, href: e.target.value })} />
                    </div>
                    <div className='title-input'>
                      <h3>Image</h3>
                      <input type="text" value={editingCategory.src} onChange={(e) => setEditingCategory({ ...editingCategory, src: e.target.value })} />
                    </div>
                    <div className='title-input'>
                      <h3>Display</h3>
                      <select className="display-select" value={editingCategory.display} onChange={(e) => setEditingCategory({ ...editingCategory, display: e.target.value })}>
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                      </select>
                    </div>
                    <div className="button-group-update">
                      <button onClick={() => handleUpdateCategory(category._id)} className="update-btn">Save</button>
                      <button onClick={() => setEditingCategory(null)} className="cancel-btn">Cancel</button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="category-info">
                    <div className='title-input'>
                      <h3>Title</h3>
                      <span>{category.title}</span>
                    </div>
                    <div className='title-input'>
                      <h3>Href</h3>
                      <span>{category.href}</span>
                    </div>
                    <div className='title-input'>
                      <h3>Image</h3>
                      <span>{category.src}</span>
                    </div>
                    <div className='title-input'>
                      <h3>Display</h3>
                      <span className="display-select">
                        {category.display || 'non'}
                      </span>
                    </div>
                  </div>
                  <div className="button-group-up">
                    <button onClick={() => handleStartEditCategory(category)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeleteCategory(category._id)} className="delete-btn">Delete</button>
                  </div>
                </>
              )}
            </div>
            
            <div className="sublinks-section">
              <div className="sublinks-header">
                <h3>SubLinks</h3>
                <button className="add-sublink-btn" onClick={() => setAddingSubLinkTo(category._id)}>
                  <Plus size={16} /> Add SubLink
                </button>
              </div>

              {addingSubLinkTo === category._id && (
                <div className="add-sublink-form">
                  <div className="form-group">
                    <input type="text" placeholder="SubLink Title" value={tempSubLink.title} onChange={(e) => setTempSubLink({ ...tempSubLink, title: e.target.value })} />
                    <input type="text" placeholder="SubLink Href" value={tempSubLink.href} onChange={(e) => setTempSubLink({ ...tempSubLink, href: e.target.value })} />
                    <input type="text" placeholder="SubLink Image Source" value={tempSubLink.src} onChange={(e) => setTempSubLink({ ...tempSubLink, src: e.target.value })} />
                  </div>
                  <div className="button-group">
                    <button onClick={() => handleAddSubLinkToCategory(category._id)} className="submit-btn">Add SubLink</button>
                    <button onClick={() => setAddingSubLinkTo(null)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              )}

              <DraggableSublinks
                sublinks={category.subLinks}
                categoryId={category._id}
                onReorder={handleReorderSublinks}
                onEdit={handleStartEditSubLink}
                onDelete={handleDeleteSubLink}
                editingSubLink={editingSubLink}
                onEditChange={(data) => setEditingSubLink({ ...editingSubLink, data })}
                onEditSave={handleUpdateSubLink}
                onEditCancel={() => setEditingSubLink({ categoryId: null, index: null, data: null })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categories