import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/products";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function SelectedProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await getProduct(Number(id));
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <p className="text-lg mb-2">Price: ${product.price}</p>
      <p className="mb-2">Brand: {product.brand.name}</p>
      <p className="mb-2">Category: {product.category.name}</p>
      <p className="mb-4">
        Discount: {product.has_discount === "1" ? `$${product.discount}` : "-"}
      </p>

      {/* Swiper carousel */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={20}
        slidesPerView={1}
        className="rounded-lg overflow-hidden"
      >
        {product.images.map((img: any) => (
          <SwiperSlide key={img.id}>
            <img
              src={img.file_name}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
