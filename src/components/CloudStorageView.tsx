import React, { useState, useEffect } from "react";
import { StorageFile } from "../types";
import {
  Cloud,
  UploadCloud,
  FileText,
  Trash2,
  Download,
  Search,
  Folder,
  FileCheck,
  Image,
  FileArchive,
  RefreshCw,
  Plus,
} from "lucide-react";

interface Props {
  isDarkMode: boolean;
}

export const CloudStorageView: React.FC<Props> = ({ isDarkMode }) => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalFiles: 5,
    usedBytes: 25280000,
    quotaBytes: 16106127360,
    usedPercentage: 0.16,
  });

  // Upload simulation state
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState<any>("customer-receipts");
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/storage/files?${params.toString()}`);
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching cloud files:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [categoryFilter, searchQuery]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) return;
    setIsUploading(true);

    try {
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: uploadName.trim(),
          category: uploadCategory,
          size: Math.floor(800000 + Math.random() * 4000000),
          type: uploadName.endsWith(".pdf")
            ? "application/pdf"
            : uploadName.endsWith(".png") || uploadName.endsWith(".jpg")
            ? "image/jpeg"
            : "application/octet-stream",
          tags: ["User Upload", "Cape Town", uploadCategory],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUploadName("");
        setShowUploadModal(false);
        fetchFiles();
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cloud file?")) return;
    try {
      await fetch(`/api/storage/files/${id}`, { method: "DELETE" });
      fetchFiles();
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (file: StorageFile) => {
    if (file.type.includes("pdf")) return <FileCheck className="text-red-500" size={24} />;
    if (file.type.includes("image")) return <Image className="text-emerald-500" size={24} />;
    if (file.type.includes("zip")) return <FileArchive className="text-amber-500" size={24} />;
    return <FileText className="text-blue-500" size={24} />;
  };

  return (
    <section id="cloud-storage" className="py-12 px-4 md:px-6 max-w-[1280px] mx-auto">
      {/* Top Title & Quota */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A3D62]/10 dark:bg-[#F9CA24]/20 text-[#0A3D62] dark:text-[#F9CA24] text-xs font-bold uppercase tracking-wider mb-2">
            <Cloud size={14} /> Cloud Storage Integration
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Cape Town Digital Asset &amp; Document Vault
          </h2>
          <p className="text-sm opacity-75 max-w-xl mt-1">
            Secure cloud storage for product specs, high-res marketing media, customer receipts, compliance certificates, and daily audit reports.
          </p>
        </div>

        {/* Quota Meter Box */}
        <div
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center gap-4 ${
            isDarkMode ? "bg-[#1C2541] border-slate-700" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="w-full sm:w-48">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Cloud Storage Quota</span>
              <span className="text-[#F9CA24]">{stats.usedPercentage}% Used</span>
            </div>
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F9CA24] rounded-full transition-all duration-500"
                style={{ width: `${Math.max(4, stats.usedPercentage * 20)}%` }}
              />
            </div>
            <div className="text-[10px] opacity-70 mt-1">
              {formatSize(stats.usedBytes)} of 15 GB Allocated
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0A3D62] text-white dark:bg-[#F9CA24] dark:text-black font-extrabold text-xs rounded-full shadow hover:opacity-90 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <UploadCloud size={16} /> Upload Asset
          </button>
        </div>
      </div>

      {/* Controls Bar: Category Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "all", label: "All Assets" },
            { id: "product-assets", label: "Product Media" },
            { id: "compliance", label: "SABS Compliance" },
            { id: "customer-receipts", label: "Receipts & Invoices" },
            { id: "user-reviews", label: "User UGC Reviews" },
            { id: "daily-reports", label: "Audit Reports" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition ${
                categoryFilter === cat.id
                  ? "bg-[#0A3D62] text-white border-[#0A3D62] dark:bg-[#F9CA24] dark:text-black dark:border-[#F9CA24]"
                  : "bg-white dark:bg-[#1C2541] border-slate-200 dark:border-slate-700 hover:border-slate-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search size={14} className="absolute left-3 top-3 opacity-50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cloud files..."
            className={`w-full pl-8 pr-3 py-2 rounded-full border text-xs focus:outline-none focus:ring-2 focus:ring-[#F9CA24] ${
              isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-white border-zinc-300"
            }`}
          />
        </div>
      </div>

      {/* Files Grid */}
      {loading ? (
        <div className="p-12 text-center opacity-60 text-sm">Loading cloud storage index...</div>
      ) : files.length === 0 ? (
        <div className="p-12 text-center border border-dashed rounded-2xl opacity-60 text-sm">
          No files found matching criteria. Click "Upload Asset" to add a new file to the cloud.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between transition hover:shadow-md ${
                isDarkMode ? "bg-[#1C2541]/70 border-slate-700" : "bg-white border-zinc-200"
              }`}
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#0B132B] flex items-center justify-center shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 opacity-80 mb-1">
                      {file.category}
                    </span>
                    <h3 className="font-extrabold text-sm leading-tight truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="text-[11px] opacity-60 mt-0.5">
                      {formatSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {file.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-slate-100 dark:bg-[#0B132B] opacity-75 border border-slate-200 dark:border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <FileCheck size={13} /> Cloud Synced
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => alert(`Downloading ${file.name} from Cape Sun Cloud Storage...`)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300"
                    title="Download"
                  >
                    <Download size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(file.id)}
                    className="p-1.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/50 transition text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div
            className={`relative w-full max-w-md p-6 rounded-2xl shadow-2xl z-10 ${
              isDarkMode ? "bg-[#0B132B] text-white border border-slate-700" : "bg-white text-[#2C3E50]"
            }`}
          >
            <h3 className="font-extrabold text-base mb-2">Upload File to Cape Sun Cloud</h3>
            <p className="text-xs opacity-70 mb-4">
              Select or type the document or media asset to store in our Cape Town cloud storage bucket.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Proof_Of_Payment_Capitec_1042.pdf"
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-slate-50 border-zinc-300"
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Storage Folder / Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm ${
                    isDarkMode ? "bg-[#1C2541] border-slate-700 text-white" : "bg-slate-50 border-zinc-300"
                  }`}
                >
                  <option value="customer-receipts">Customer Receipts &amp; Proof of Payment</option>
                  <option value="product-assets">Product Catalog Media &amp; Photos</option>
                  <option value="compliance">Compliance &amp; SABS Certifications</option>
                  <option value="user-reviews">User UGC &amp; Review Proofs</option>
                  <option value="daily-reports">Daily Performance Reports</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-lg bg-[#F9CA24] text-black font-extrabold text-xs shadow hover:brightness-105 transition"
                >
                  {isUploading ? "Uploading..." : "Save to Cloud"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
