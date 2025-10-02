import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import ComponentCard from "../../components/common/ComponentCard";
import { addProduct } from "../../api/products";
import { useNavigate } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type FormValues = {
  name: string;
  small_desc: string;
  desc: string;
  sku: string;
  price: number;
  has_discount: "0" | "1";
  discount?: string;
  start_discount?: Date;
  end_discount?: Date;
  quantity: number;
  brand_id: string;
  category_id: string;
  images?: FileList;
};

export default function ProductsForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      has_discount: "0",
      quantity: 1,
      price: 0,
    },
  });

  const hasDiscount = watch("has_discount");

  const handleImageChange = (files?: FileList) => {
    if (!files) return;
    const previews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews(previews);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("small_desc", data.small_desc);
      formData.append("desc", data.desc);
      formData.append("sku", data.sku);
      formData.append("price", String(data.price));
      formData.append("has_discount", data.has_discount);
      if (data.has_discount === "1") {
        formData.append("discount", data.discount || "0");
        formData.append(
          "start_discount",
          data.start_discount ? data.start_discount.toISOString() : ""
        );
        formData.append(
          "end_discount",
          data.end_discount ? data.end_discount.toISOString() : ""
        );
      }
      formData.append("quantity", String(data.quantity));
      formData.append("brand_id", data.brand_id);
      formData.append("category_id", data.category_id);

      if (data.images && data.images.length > 0) {
        Array.from(data.images).forEach((file) =>
          formData.append("images[]", file)
        );
      }

      await addProduct(formData);
      reset();
      setImagePreviews([]);
      navigate("/products");
    } catch (err: any) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Add Product">
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Input Field Component */}
        {/** A reusable styled input */}
        {/** Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            {...register("name", { required: "Product name is required" })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Product name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Small Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Small Description
          </label>
          <textarea
            {...register("small_desc")}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Short description of product"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            {...register("desc")}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Detailed description of product"
          />
        </div>

        {/* SKU & Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">SKU</label>
            <input
              {...register("sku", { required: "SKU is required" })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="SKU code"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Price</label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Product price"
            />
          </div>
        </div>

        {/* Has Discount */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Has Discount?
          </label>
          <select
            {...register("has_discount")}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>

        {/* Discount Fields */}
        {hasDiscount === "1" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Discount Amount
              </label>
              <input
                type="number"
                step="0.01"
                {...register("discount", { required: "Discount required" })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter discount amount"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Discount Start
              </label>
              <Controller
                control={control}
                name="start_discount"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="Start date"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Discount End
              </label>
              <Controller
                control={control}
                name="end_discount"
                render={({ field }) => (
                  <DatePicker
                    placeholderText="End date"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Quantity, Brand ID, Category ID */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Quantity</label>
            <input
              type="number"
              {...register("quantity")}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Brand ID</label>
            <input
              {...register("brand_id", { required: "Brand ID required" })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Category ID</label>
            <input
              {...register("category_id", { required: "Category ID required" })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-1">Images</label>
          <input
            type="file"
            multiple
            {...register("images")}
            onChange={(e) => handleImageChange(e.target.files!)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`preview-${idx}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </ComponentCard>
  );
}
