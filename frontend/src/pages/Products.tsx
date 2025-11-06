import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/items/`)
      .then((res: any) => setItems(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              to={`/products/${item.id}`}
              className="text-xl hover:underline"
            >
              {item.name} — ${item.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
