import { useEffect, useState } from "react";
import axios from "axios";

const ProductModal = ({ isOpen, product_id, onClose }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (isOpen && product_id) {
      axios.get(`/web/products/${product_id}`).then((res) => setProduct(res.data));
    }
  }, [isOpen, product_id]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
        <p>Status: {product.status}</p>
        <p>Category: {product.category}</p>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="btn btn-sm btn-gray">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
