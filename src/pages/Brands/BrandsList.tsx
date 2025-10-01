import { useEffect, useState } from "react";
import { getBrands, deleteBrand, updateBrand } from "../../api/brands";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Brand {
  brand_id: number;
  brand_name: string;
  brand_slug: string;
  brand_status: string;
  logo: string;
}

export default function BrandsList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Update form state
  const [updateName, setUpdateName] = useState("");
  const [updateStatus, setUpdateStatus] = useState("1");
  const [updateLogo, setUpdateLogo] = useState<File | null>(null);

  const fetchBrands = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await getBrands(pageNumber, perPage);
      setBrands(data.data || []);
      setHasNextPage((data.data?.length || 0) === perPage);
    } catch (err) {
      console.error(err);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(page);
  }, [page]);

  const handlePrev = () => page > 1 && setPage((p) => p - 1);
  const handleNext = () => hasNextPage && setPage((p) => p + 1);

  /** DELETE HANDLER */
  const confirmDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;
    setDeleting(true);
    const brandName = selectedBrand.brand_name;
    const brandId = selectedBrand.brand_id;
    const isLastItemOnPage = brands.length === 1 && page > 1;

    try {
      await deleteBrand(brandId);
      setBrands((prev) => prev.filter((b) => b.brand_id !== brandId));
     
      setIsDeleteModalOpen(false);
      setSelectedBrand(null);
      if (isLastItemOnPage) setPage((p) => p - 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete brand.");
    } finally {
      setDeleting(false);
    }
  };

  /** UPDATE HANDLER */
  const confirmUpdate = (brand: Brand) => {
    setSelectedBrand(brand);
    setUpdateName(brand.brand_name);
    setUpdateStatus(brand.brand_status.toLowerCase() === "active" ? "1" : "0");
    setUpdateLogo(null);
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedBrand) return;
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("name", updateName);
      formData.append("status", updateStatus);
      if (updateLogo) formData.append("logo", updateLogo);
      formData.append("_method", "PUT");

      await updateBrand(selectedBrand.brand_id, formData);

      setBrands((prev) =>
        prev.map((b) =>
          b.brand_id === selectedBrand.brand_id
            ? {
                ...b,
                brand_name: updateName,
                brand_status: updateStatus === "1" ? "Active" : "Inactive",
                logo: updateLogo ? URL.createObjectURL(updateLogo) : b.logo,
              }
            : b
        )
      );

      
      setIsUpdateModalOpen(false);
      setSelectedBrand(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update brand.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 relative">

      <div className="overflow-x-auto border rounded-xl shadow-sm bg-white dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">ID</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Slug</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">Status</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">Logo</th>
              <th className="px-6 py-3 text-center font-semibold text-gray-700 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No brands found.
                </td>
              </tr>
            ) : (
              brands.map((brand, idx) => (
                <tr key={brand.brand_id} className={idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""}>
                  <td className="px-6 py-4">{brand.brand_id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{brand.brand_name}</td>
                  <td className="px-6 py-4 lowercase text-gray-600 dark:text-gray-400">{brand.brand_slug}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${brand.brand_status.toLowerCase() === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {brand.brand_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.brand_name} className="w-12 h-12 object-cover rounded-full mx-auto border border-gray-200 dark:border-gray-600" />
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={() => confirmUpdate(brand)}
                      className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => confirmDelete(brand)}
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
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full font-medium">
          Page {page}
        </span>
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedBrand && (
        <Modal
          title="Delete Brand"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          confirmText={deleting ? "Deleting..." : "Delete"}
          confirmDisabled={deleting}
        >
          Are you sure you want to delete <strong>{selectedBrand.brand_name}</strong>?
        </Modal>
      )}

      {/* Update Modal */}
      {isUpdateModalOpen && selectedBrand && (
        <Modal
          title="Update Brand"
          onCancel={() => setIsUpdateModalOpen(false)}
          onConfirm={handleUpdate}
          confirmText={updating ? "Updating..." : "Update"}
          confirmDisabled={updating}
        >
          <input
            type="text"
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            placeholder="Brand name"
          />
          <select
            value={updateStatus}
            onChange={(e) => setUpdateStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <input
            type="file"
            onChange={(e) => e.target.files && setUpdateLogo(e.target.files[0])}
            className="w-full"
          />
        </Modal>
      )}
    </div>
  );
}

/** Reusable Modal */
function Modal({ title, children, onCancel, onConfirm, confirmText, confirmDisabled }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="space-y-4">{children}</div>
        <div className="flex justify-end space-x-3 mt-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
