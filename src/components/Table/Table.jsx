import './Table.scss';
import { Pencil, Trash2 } from 'lucide-react';


const Table = ({ columns, data, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((column) => (
                <td key={`${item.id}-${column.key}`}>{item[column.key]}</td>
              ))}
              <td className="actions">
                <button onClick={() => onEdit(item)} className="edit-btn">
                  <Pencil size={15} />
                </button>
                <button onClick={() => onDelete(item.id)} className="delete-btn">
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;