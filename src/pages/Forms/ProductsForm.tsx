import { useState } from "react";
import { useForm } from "react-hook-form";
import ComponentCard from "../../components/common/ComponentCard";
import { addProduct } from "../../api/products";
import { useNavigate } from "react-router";

type FormValues = {
  name: string;
  small_desc: string;
  desc: string;
  sku: string;
  price: number;
  quantity: number;
  has_discount: "0" | "1";
  discount: string;
  start_discount: string;
  end_discount: string;
  brand_id: number;
  category_id: number;
  images?: FileList;
};

export default function ProductsForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      has_discount: "0",
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      for (const key in data) {
        if (key === "images" && data.images?.length) {
          Array.from(data.images).forEach(file => formData.append("images[]", file));
        } else {
          formData.append(key, data[key as keyof FormValues] as any);
        }
      }

      await addProduct(formData);
      reset();
      navigate("/products");
    } catch (err: any) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Add Product">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Product Name</label>
          <input
            {...register("name", { required: "Product name is required" })}
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.name ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Small Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Small Description</label>
          <textarea
            {...register("small_desc", { required: "Small description is required" })}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
          <textarea
            {...register("desc", { required: "Description is required" })}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">SKU</label>
          <input
            {...register("sku", { required: "SKU is required" })}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter SKU"
          />
        </div>

        {/* Price & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Price</label>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required" })}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Quantity</label>
            <input
              type="number"
              {...register("quantity", { required: "Quantity is required" })}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Has Discount</label>
            <select
              {...register("has_discount", { required: true })}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Discount</label>
            <input
              type="number"
              step="0.01"
              {...register("discount")}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="0 if none"
            />
          </div>
        </div>

        {/* Discount Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Start Discount</label>
            <input
              type="date"
              {...register("start_discount")}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">End Discount</label>
            <input
              type="date"
              {...register("end_discount")}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Brand & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Brand ID</label>
            <input
              type="number"
              {...register("brand_id", { required: true })}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter brand ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Category ID</label>
            <input
              type="number"
              {...register("category_id", { required: true })}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter category ID"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Images</label>
          <input
            type="file"
            {...register("images")}
            multiple
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </ComponentCard>
  );
}
