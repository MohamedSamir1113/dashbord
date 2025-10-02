import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBrands, deleteBrand, updateBrand } from "../../api/brands";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Brand {
  brand_id: number;
  brand_name: string;
  brand_slug: string;
  brand_status: string;
  logo: string;
}

export default function BrandsList() {
  const navigate = useNavigate();

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Update form state
  const [updateName, setUpdateName] = useState("");
  const [updateStatus, setUpdateStatus] = useState("1");
  const [updateLogo, setUpdateLogo] = useState<File | null>(null);

  /** Fetch Brands */
  const fetchBrands = async (pageNumber: number) => {
    setLoading(true);
    try {
      const data = await getBrands(pageNumber, perPage);
      setBrands(data.data || []);
      setHasNextPage((data.data?.length || 0) === perPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch brands.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands(page);
  }, [page]);

  const handlePrev = () => page > 1 && setPage((p) => p - 1);
  const handleNext = () => hasNextPage && setPage((p) => p + 1);

  /** DELETE */
  const confirmDelete = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteModalOpen(true);
  };
  const handleDelete = async () => {
    if (!selectedBrand) return;
    setDeleting(true);
    const isLastItemOnPage = brands.length === 1 && page > 1;
    try {
      await deleteBrand(selectedBrand.brand_id);
      setBrands((prev) => prev.filter((b) => b.brand_id !== selectedBrand.brand_id));
      setSelectedBrand(null);
      setIsDeleteModalOpen(false);
      if (isLastItemOnPage) setPage((p) => p - 1);
      toast.success("Brand deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete brand.");
    } finally {
      setDeleting(false);
    }
  };

  /** UPDATE */
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

      setSelectedBrand(null);
      setIsUpdateModalOpen(false);
      toast.success("Brand updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update brand.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 mt-20 relative">
      <ToastContainer />

      {/* Brands Table */}
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
                <td colSpan={6} className="text-center py-8 text-gray-500">Loading...</td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No brands found.</td>
              </tr>
            ) : (
              brands.map((b, idx) => (
                <tr
                  key={b.brand_id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : ""
                  } hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer`}
                  onClick={() => navigate(`/brands/${b.brand_id}`, { state: { brands } })}
                >
                  <td className="px-6 py-4">{b.brand_id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 dark:text-gray-200">{b.brand_name}</td>
                  <td className="px-6 py-4 lowercase text-gray-600 dark:text-gray-400">{b.brand_slug}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      b.brand_status.toLowerCase() === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>{b.brand_status}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {b.logo ? (
                      <img src={b.logo} alt={b.brand_name} className="w-12 h-12 object-cover rounded-full mx-auto border border-gray-200 dark:border-gray-600" />
                    ) : "—"}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); confirmUpdate(b); }}
                      className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); confirmDelete(b); }}
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
        <button onClick={handlePrev} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Previous</button>
        <span className="px-4 py-2 bg-gray-100 rounded-full">Page {page}</span>
        <button onClick={handleNext} disabled={!hasNextPage} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
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
        >
          <div className="space-y-4">
            <input
              type="text"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
              placeholder="Brand name"
            />

            <select
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
            >
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>

            <input
              type="file"
              onChange={(e) => e.target.files && setUpdateLogo(e.target.files[0])}
              className="w-full"
            />

            <button
              onClick={handleUpdate}
              disabled={updating}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {updating ? "Updating..." : "Update"}
            </button>
          </div>
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
