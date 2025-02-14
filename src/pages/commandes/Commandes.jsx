import React, { useEffect, useState } from 'react';
import { FetchAllCommandeItems } from '../../Api/Commande/commande';
import { FetchAllProductItems } from '../../Api/Products/Products';
import './Commandes.scss';

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch commandes and products concurrently
        const [commandeData, productData] = await Promise.all([
          FetchAllCommandeItems(),
          FetchAllProductItems(),
        ]);

        setCommandes(commandeData);
        setProducts(productData);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const getProductNameById = (id) => {
    const product = products.find((product) => product.idProd === id);
    return product ? product.nom : 'Produit inconnu';
  };

  return (
    <div className="dashboard">
      <h2>Commandes</h2>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nom et Prénom</th>
                <th>Pays</th>
                <th>Gouvernorat</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Articles</th>
              </tr>
            </thead>
            <tbody>
              {commandes.length > 0 ? (
                commandes.map((commande, index) => (
                  <tr key={commande._id}>
                    <td>{index + 1}</td>
                    <td>{commande.nomPrenom}</td>
                    <td>{commande.pays}</td>
                    <td>{commande.gouvernorat}</td>
                    <td>{commande.email}</td>
                    <td>{commande.telephone}</td>
                    <td>
                      {commande.cartItems.map((item, idx) => (
                        <div key={idx} className="item-details">
                          <p>Produit: {getProductNameById(item.idProd)}</p>
                          <p>Quantité: {item.quantity}</p>
                          <p>Prix Total: {item.totalPrice} TND</p>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    Aucun commande disponible
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Commandes;
