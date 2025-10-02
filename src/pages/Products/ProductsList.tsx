import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getProducts, deleteProduct, updateProduct } from "../../api/products";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ProductImage {
  id: number;
  file_name: string;
}
interface Brand {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
}
interface Product {
  id: number;
  name: string;
  small_desc: string;
  desc: string;
  sku: string;
  quantity: number;
  price: number;
  has_discount: string;
  discount: string;
  created_at: string;
  images: ProductImage[];
  brand: Brand;
  category: Category;
}

interface ProductFormValues {
  name: string;
  small_desc: string;
  desc: string;
  quantity: number;
  price: number;
  discount: string;
  images?: FileList;
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<ProductFormValues>();

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const fetchProducts = async (pageNumber: number) => {
    setLoading(true);
    try {
      const res = await getProducts(pageNumber, perPage);
      setProducts(res.data.products || []);
      setHasNextPage((res.data.products?.length || 0) === perPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => page > 1 && setPage((p) => p - 1);
  const handleNext = () => hasNextPage && setPage((p) => p + 1);

  /** DELETE */
  const confirmDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  const handleDelete = async () => {
    if (!selectedProduct) return;
    setDeleting(true);
    const productId = selectedProduct.id;
    const isLastItemOnPage = products.length === 1 && page > 1;
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setSelectedProduct(null);
      setIsDeleteModalOpen(false);
      if (isLastItemOnPage) setPage((p) => p - 1);
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  /** UPDATE */
  const confirmUpdate = (product: Product) => {
    setSelectedProduct(product);
    reset({
      name: product.name,
      small_desc: product.small_desc,
      desc: product.desc,
      quantity: product.quantity,
      price: product.price,
      discount: product.discount,
      images: undefined,
    });
    setIsUpdateModalOpen(true);
  };

  const onUpdate = async (data: ProductFormValues) => {
    if (!selectedProduct) return;
    setUpdating(true);

    try {
      const formData = new FormData();

      // Editable fields
      formData.append("name", data.name);
      formData.append("small_desc", data.small_desc);
      formData.append("desc", data.desc);
      formData.append("quantity", String(data.quantity));
      formData.append("price", String(data.price));
      formData.append("discount", data.discount);

      // Compute has_discount
      const hasDiscount = Number(data.discount) > 0 ? "1" : "0";
      formData.append("has_discount", hasDiscount);


      // Required fields (uneditable)
      formData.append("sku", selectedProduct.sku);
      formData.append("category_id", String(selectedProduct.category.id));
      formData.append("brand_id", String(selectedProduct.brand.id));

      formData.append("_method", "PUT");

      const res = await updateProduct(formData, selectedProduct.id);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...res.data } : p
        )
      );

      setSelectedProduct(null);
      setIsUpdateModalOpen(false);
      toast.success("Product updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data ? JSON.stringify(err.response.data) : "Update failed"
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 mt-20 relative">
      <ToastContainer />

      {/* Products Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                ID
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                Name
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                Brand
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                Category
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                Price
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">
                Discount
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">
                Image
              </th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((p, idx) => (
                <tr
                  key={p.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                  } hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer`}
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <td className="px-6 py-4">{p.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">
                    {p.name.split(" ").slice(0, 3).join(" ")}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {p.brand.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {p.category.name}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    ${p.price}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {p.has_discount === "1" ? `$${p.discount}` : "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {p.images[0] ? (
                      <img
                        src={p.images[0].file_name}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-full mx-auto border border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmUpdate(p);
                      }}
                      className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(p);
                      }}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-3 mt-4">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-100 rounded-full">Page {page}</span>
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedProduct && (
        <Modal
          title="Delete Product"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          confirmText={deleting ? "Deleting..." : "Delete"}
          confirmDisabled={deleting}
        >
          Are you sure you want to delete{" "}
          <strong>
            {selectedProduct.name.split(" ").slice(0, 3).join(" ")}
          </strong>
          ?
        </Modal>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && selectedProduct && (
        <Modal
          title="Update Product"
          onCancel={() => setIsUpdateModalOpen(false)}
        >
          <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Name
              </label>
              <input
                id="name"
                {...register("name")}
                className="w-full border rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="small_desc"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Small Description
              </label>
              <textarea
                id="small_desc"
                {...register("small_desc")}
                className="w-full border rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Description
              </label>
              <textarea
                id="desc"
                {...register("desc")}
                className="w-full border rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                {...register("quantity")}
                className="w-full border rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Price
              </label>
              <input
                id="price"
                type="number"
                {...register("price")}
                className="w-full border rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Discount
              </label>
              <input
                id="discount"
                {...register("discount")}
                className="w-full border rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
              />
            </div>

           

            <button
              type="submit"
              disabled={updating}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, children, onCancel, onConfirm, confirmText, confirmDisabled }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
        <div className="space-y-4">{children}</div>
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {onConfirm ? "Cancel" : "Close"}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              disabled={confirmDisabled}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

