import { useState } from 'react';
import { GripVertical } from 'lucide-react';
import './DraggableSublinks.scss';

export function DraggableSublinks({ sublinks, categoryId, onReorder, onEdit, onDelete, editingSubLink, onEditChange, onEditSave, onEditCancel }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleSelect = (index) => {
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const newSublinks = [...sublinks];
      [newSublinks[selectedIndex], newSublinks[index]] = [newSublinks[index], newSublinks[selectedIndex]];

      onReorder(categoryId, newSublinks);
      setSelectedIndex(null);
    }
  };

  return (
    <div className="draggable-sublinks">
      {sublinks.map((link, index) => (
        <div key={`${categoryId}-${index}`} className={`sublink-item ${selectedIndex === index ? 'selected' : ''}`}>
          <div  onClick={() => handleSelect(index)} className="drag-handle">
            <GripVertical size={20} />
          </div>

          {editingSubLink.categoryId === categoryId && editingSubLink.index === index ? (
            <div className="edit-mode">
              <input type="text" value={editingSubLink.data?.title || ''} onChange={(e) => onEditChange({ ...editingSubLink.data, title: e.target.value })} placeholder="Title"/>
              <input type="text" value={editingSubLink.data?.href || ''} onChange={(e) => onEditChange({ ...editingSubLink.data, href: e.target.value })} placeholder="Href" />
              <input type="text" value={editingSubLink.data?.src || ''} onChange={(e) => onEditChange({ ...editingSubLink.data, src: e.target.value })} placeholder="Image Source" />
              <div className="button-group">
                <button onClick={() => onEditSave(categoryId, index)} className="save-btn">Save</button>
                <button onClick={onEditCancel} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="sublink-title">{link.title}</div>
              <div className="sublink-href">{link.href}</div>
              <div className="sublink-src">{link.src}</div>
              <div className="button-group">
                <button onClick={() => onEdit(categoryId, index, link)} className="edit-btn">Edit</button>
                <button onClick={() => onDelete(categoryId, index)} className="delete-btn">Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
