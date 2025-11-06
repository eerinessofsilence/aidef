import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/items/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) return <p className="p-8">Loading...</p>;

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-4xl font-bold">{product.name}</h1>
      <p className="text-lg text-gray-300">${product.price}</p>
      <p>{product.description}</p>
    </div>
  );
}
