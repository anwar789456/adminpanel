import { useState } from 'react';
import Table from '../../components/Table/Table';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Users.scss';

const initialAdmins = [];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
];

const Admins = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (admin) => {
    // Implement edit functionality
    console.log('Edit admin:', admin);
  };

  const handleDelete = (id) => {
    setAdmins(admins.filter(admin => admin.id !== id));
  };


  const filteredAdmins = admins.filter(admin =>
    Object.values(admin).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="users-page">
      <h2>Administrators</h2>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />
      <Table
        columns={columns}
        data={filteredAdmins}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Admins;