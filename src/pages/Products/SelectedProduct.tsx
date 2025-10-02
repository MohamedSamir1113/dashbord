import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../../api/products";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";


export default function SelectedProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

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

  if (loading) return <p className="text-center mt-10">Loading product...</p>;
  if (!product) return <p className="text-center mt-10">No product found</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Images */}
      <div>
        <Swiper
          modules={[Navigation, Thumbs]}
          navigation
          thumbs={{ swiper: thumbsSwiper }}
          className="rounded-lg mb-4"
        >
          {product.images.map((img: any) => (
            <SwiperSlide key={img.id}>
              <img
                src={img.file_name}
                alt={product.name}
                className="w-full h-[400px] object-contain rounded-lg"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnails */}
        <Swiper
          onSwiper={setThumbsSwiper}
          slidesPerView={4}
          spaceBetween={10}
          className="mt-2"
        >
          {product.images.map((img: any) => (
            <SwiperSlide key={img.id}>
              <img
                src={img.file_name}
                alt={product.name}
                className="w-full h-20 object-cover rounded-lg cursor-pointer border border-gray-200"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col justify-start">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        {/* Price */}
        <div className="flex items-center gap-4 mb-3">
          <span className="text-2xl font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          {product.has_discount === "1" && (
            <span className="text-red-600 font-medium line-through">
              ${(
                Number(product.price) +
                Number(product.discount || 0)
              ).toFixed(2)}
            </span>
          )}
        </div>

        {/* Brand & Category */}
        <p className="mb-2 text-gray-700">
          <span className="font-semibold">Brand:</span> {product.brand.name}
        </p>
        <p className="mb-4 text-gray-700">
          <span className="font-semibold">Category:</span> {product.category.name}
        </p>

        {/* Discount Info */}
        {product.has_discount === "1" && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-semibold">
              Discount: ${product.discount}
            </p>
            <p className="text-sm text-gray-600">
              From: {product.start_discount} To: {product.end_discount}
            </p>
          </div>
        )}

        {/* Small Description */}
        <p className="mb-4 text-gray-800 whitespace-pre-line">{product.small_desc}</p>

        {/* Full Description */}
        <div className="mb-4 text-gray-700 whitespace-pre-line">{product.desc}</div>

        {/* Quantity & Add to Cart (optional) */}
        
      </div>
    </div>
  );
}
