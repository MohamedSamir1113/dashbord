import { useState } from "react";
import { useForm } from "react-hook-form";
import ComponentCard from "../../common/ComponentCard";
import { createBrand } from "../../../api/brands";
import { useNavigate } from "react-router";

type FormValues = {
  name: string;
  status: "0" | "1";
  logo: FileList;
};

export default function BrandInputs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      status: "1",
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("status", data.status);
      if (data.logo && data.logo.length > 0) formData.append("logo", data.logo[0]);

      await createBrand(formData);

    

      reset();
      navigate("/brands");
    } catch (err: any) {
      console.error(err.response?.data || err);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard title="Add Brand">
     
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Brand Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Brand Name
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Brand name is required" })}
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter brand name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Brand Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Brand Status
          </label>
          <select
            id="status"
            {...register("status", { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>

        {/* Brand Logo */}
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Brand Logo
          </label>
          <input
            id="logo"
            type="file"
            {...register("logo")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className=" py-3 px-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-transform active:scale-95 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Brand"}
        </button>
      </form>
    </ComponentCard>
  );
}
