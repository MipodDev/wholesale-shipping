import { useEffect, useState } from "react";
import axios from "axios";
import ProductSummary from "../components/ProductSummary";
import ProductFilters from "../components/ProductFilters";
import ProductTable from "../components/ProductTable";
import ProductModal from "../components/ProductModal";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { toast } from "react-toastify";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, inactive: 0, unclassified: 0 });
  const [filters, setFilters] = useState({ query: "", status: [], category: [], tags: [] });
  const [pagination, setPagination] = useState({ skip: 0, limit: 25 });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Fetch filtered & paginated products
  const fetchProducts = async (isLoadMore = false) => {
    setLoadingProducts(true);
    try {
      const res = await axios.post("/web/products/search", {
        filters,
        skip: pagination.skip,
        limit: pagination.limit,
      });

      if (isLoadMore) {
        setProducts(prev => [...prev, ...res.data]);
      } else {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
      toast.error("Failed to load products.");

    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch summary counts
  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await axios.post("/web/products/summary", { filters });
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to load summary:", err);
        toast.error("Failed to load summary.");

    } finally {
      setLoadingSummary(false);
    }
  };

  // Handle Load More
  const handleLoadMore = () => {
    const newSkip = pagination.skip + pagination.limit;
    setPagination(prev => ({ ...prev, skip: newSkip }));
    fetchProducts(true);
  };

  // Initial fetch or on filter change
  useEffect(() => {
    setPagination({ skip: 0, limit: 25 }); // Reset pagination on filters
    fetchProducts(false);
    fetchSummary();
  }, [filters]);

  // CSV export
  const exportToCSV = () => {
    const csv = Papa.unparse(
      products.map((p) => ({
        Title: p.title,
        Status: p.status,
        Category: p.category || "Uncategorized",
        SKUs: p.unique_skus?.join(", ") || "",
        Tags: p.tags?.join(", ") || "",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "products-export.csv");
  };

  return (
    <div className="p-4 space-y-6">
      <ProductSummary summary={summary} isLoading={loadingSummary} />

      <div className="relative z-10">
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          pagination={pagination}
          setPagination={setPagination}
        />
      </div>

      <div className="relative z-0">
        <ProductTable
          products={products}
          loading={loadingProducts}
          onView={setSelectedProductId}
          exportToCSV={exportToCSV}
        />
      </div>

      {!loadingProducts && products.length >= pagination.limit && (
        <div className="flex justify-center pt-4 ">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded hover:bg-purple-600"
          >
            Load More
          </button>
        </div>
      )}

      <ProductModal
        isOpen={!!selectedProductId}
        product_id={selectedProductId}
        onClose={() => setSelectedProductId(null)}
      />
    </div>
  );
};

export default ProductsPage;
