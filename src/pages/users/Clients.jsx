import { useState } from 'react';
import Table from '../../components/Table/Table';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Users.scss';

const initialClients = [];

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];

const Clients = () => {
  const [clients, setClients] = useState(initialClients);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (client) => {
    // Implement edit functionality
    console.log('Edit client:', client);
  };

  const handleDelete = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };


  const filteredClients = clients.filter(client =>
    Object.values(client).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="users-page">
      <h2>Clients</h2>
      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
      />
      <Table
        columns={columns}
        data={filteredClients}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Clients;