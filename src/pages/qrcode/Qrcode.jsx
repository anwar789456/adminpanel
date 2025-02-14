import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { FetchAllProductItems } from '../../Api/Products/Products';
import { toPng, toJpeg } from 'html-to-image';
import './Qrcode.scss';

function Qrcode() {
  const [id, setId] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [textInput, setTextInput] = useState(''); // New state for the text input
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const qrCodeRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await FetchAllProductItems();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await FetchAllProductItems();
        const uniqueProducts = Array.from(new Map(data.map(item => [item.idProd, item])).values());
        setProducts(uniqueProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  
  const handleGenerateQRCodeFromSelect = () => {
    if (id.trim() !== '') {
      setQrValue(id);
    }
  };

  const handleGenerateQRCodeFromText = () => {
    if (textInput.trim() !== '') {
      setQrValue(textInput);
    }
  };

  const handleCancelQRCode = () => {
    setQrValue('');
    setId('');
    setTextInput(''); // Reset text input
    setSearch('');
  };

  const handleDownloadQRCode = (format = 'png') => {
    if (!qrCodeRef.current) return;
    const options = { quality: 1 };
    const downloadFunction = format === 'png' ? toPng : toJpeg;

    downloadFunction(qrCodeRef.current, options)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Qrcode.${format}`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error generating QR code image:', error);
      });
  };

  const handleSelectProduct = (product) => {
    setId(product.idProd);
    setSearch(product.nom);
    setIsDropdownOpen(false);
  };

  return (
    <div className="container">
      <h1>QR Code Generator</h1>
      <div className="dropdown" ref={dropdownRef}>
        <input type="text" placeholder="Search Products" value={search} onChange={(e) => {setSearch(e.target.value);setIsDropdownOpen(true); }} onFocus={() => setIsDropdownOpen(true)} />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {products
              .filter((product) => product.nom.toLowerCase().includes(search.toLowerCase()))
              .map((product) => (
                <div key={product.idProd} className="dropdown-item" onClick={() => handleSelectProduct(product)} >
                  {product.idProd} - {product.nom}
                </div>
              ))}
          </div>
        )}
        <button onClick={handleGenerateQRCodeFromSelect} className='button-qr'>
          <p>Generate QR Code Product</p>
        </button>
      </div>
      {/* New Input Field for Custom Text QR Code */}
      <div className='one-line'>
        <input type="text" placeholder="Enter any text" value={textInput} onChange={(e) => setTextInput(e.target.value)} className="text-input-qr" />
        <button onClick={handleGenerateQRCodeFromText} className='button-qr'>
          <p>Generate QR Code Text</p>
        </button>
      </div>

      <div>
        {qrValue && (
          <button onClick={handleCancelQRCode} className="button-qr-cancel">
            Cancel
          </button>
        )}
      </div>

      {qrValue && (
        <div className="qr-code-section">
          <div ref={qrCodeRef} className="qr-code">
            <QRCode value={qrValue} size={256} />
          </div>
          <div className="download-buttons">
            <button onClick={() => handleDownloadQRCode('png')} className='button-qr'>
              <p>Download as PNG</p>
            </button>
            <button onClick={() => handleDownloadQRCode('jpeg')} className='button-qr'>
              <p>Download as JPG</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Qrcode;
