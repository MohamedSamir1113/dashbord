import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBrand } from "../../api/brands";

interface Brand {
  brand_id: number;
  brand_name: string;
  brand_slug: string;
  brand_status: string;
  logo: string;
}

export default function SelectedBrand() {
  const { id } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBrand = async () => {
      setLoading(true);
      try {
        const data = await getBrand(Number(id));
        setBrand(data.data); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading brand...</p>;
  if (!brand) return <p className="text-center mt-10">Brand not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-xl shadow">
     
      <div className="flex justify-center items-center">
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={brand.brand_name}
            className="w-48 h-48 object-cover rounded-full border border-gray-200 dark:border-gray-700"
          />
        ) : (
          <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            No Logo
          </div>
        )}
      </div>

      
      <div className="flex flex-col justify-start space-y-4">
        <h1 className="text-3xl font-bold">{brand.brand_name}</h1>
        <p className="text-gray-600 dark:text-gray-400">Slug: {brand.brand_slug}</p>
        <p
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            brand.brand_status.toLowerCase() === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {brand.brand_status}
        </p>
      </div>
    </div>
  );
}
