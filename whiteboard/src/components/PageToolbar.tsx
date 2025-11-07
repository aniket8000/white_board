import React, { useState } from "react";
import type { Shape } from "../types/shapes";

interface Page {
  id: string;
  name: string;
  shapes: Shape[];
}

interface Props {
  pages: Page[];
  currentPageId: string | null;
  setCurrentPageId: (id: string | null) => void;
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
}

export default function PageToolbar({
  pages,
  currentPageId,
  setCurrentPageId,
  setPages,
}: Props) {
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);

  // rename page and reset editing state
  const handleRename = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: newName.trim() || p.name } : p))
    );
    setEditingPageId(null);
    setNewName("");
  };

  // remove page and adjust current selection if needed
  const handleDelete = (id: string) => {
    setPages((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (currentPageId === id) {
        setCurrentPageId(updated.length ? updated[0].id : null);
      }
      return updated;
    });
    setDeleteModal(null);
  };

  // create a new page
  const handleAddPage = () => {
    if (!newPageName.trim()) return;
    const newPage = {
      id: "page_" + Date.now(),
      name: newPageName.trim(),
      shapes: [],
    };
    setPages((prev) => [...prev, newPage]);
    setCurrentPageId(newPage.id);
    setNewPageName("");
    setShowAddModal(false);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "12px 20px",
          background: "#f3f4f6",
          borderBottom: "1px solid #ddd",
        }}
      >
        {/* button for adding new page */}
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "bold",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
          aria-label="Add page"
        >
          +
        </button>

        {/* page tabs */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          {pages.map((page) => {
            const isActive = page.id === currentPageId;
            return (
              <div
                key={page.id}
                onClick={() => setCurrentPageId(page.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  background: isActive ? "#2563eb" : "#ffffff",
                  color: isActive ? "#fff" : "#333",
                  cursor: "pointer",
                  boxShadow: isActive
                    ? "0 0 8px rgba(37,99,235,0.35)"
                    : "0 1px 3px rgba(0,0,0,0.06)",
                  transition: "all 0.14s ease",
                }}
                role="tab"
                aria-selected={isActive}
              >
                {editingPageId === page.id ? (
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(page.id);
                      if (e.key === "Escape") {
                        setEditingPageId(null);
                        setNewName("");
                      }
                    }}
                    onBlur={() => handleRename(page.id)}
                    autoFocus
                    style={{
                      padding: "4px 6px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      outline: "none",
                      fontSize: "14px",
                    }}
                  />
                ) : (
                  <>
                    <span style={{ fontWeight: 500 }}>{page.name}</span>

                    {/* edit/delete icons */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <button
                        title="Rename page"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPageId(page.id);
                          setNewName(page.name);
                        }}
                        style={{
                          width: 26,
                          height: 26,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(ev) =>
                          (ev.currentTarget.style.background = "rgba(0,0,0,0.06)")
                        }
                        onMouseLeave={(ev) =>
                          (ev.currentTarget.style.background = "transparent")
                        }
                        aria-label={`Rename ${page.name}`}
                      >
                        <i className="ri-edit-line" style={{ fontSize: 15, opacity: 0.9 }} />
                      </button>

                      <button
                        title="Delete page"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteModal({ id: page.id, name: page.name });
                        }}
                        style={{
                          width: 26,
                          height: 26,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 6,
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(ev) =>
                          (ev.currentTarget.style.background = "rgba(248,113,113,0.12)")
                        }
                        onMouseLeave={(ev) =>
                          (ev.currentTarget.style.background = "transparent")
                        }
                        aria-label={`Delete ${page.name}`}
                      >
                        <i className="ri-delete-bin-line" style={{ fontSize: 15, opacity: 0.9 }} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* modal for adding a new page */}
      {showAddModal && (
        <Modal
          title="Create New Page"
          placeholder="Enter page name..."
          value={newPageName}
          onChange={setNewPageName}
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAddPage}
          confirmText="Create"
        />
      )}

      {/* delete confirmation modal */}
      {deleteModal && (
        <Modal
          title="Delete Page"
          message={`Are you sure you want to delete "${deleteModal.name}"? This cannot be undone.`}
          onClose={() => setDeleteModal(null)}
          onConfirm={() => handleDelete(deleteModal.id)}
          confirmText="Delete"
          danger
        />
      )}
    </>
  );
}

// basic modal for creating or deleting a page
function Modal({
  title,
  message,
  placeholder,
  value,
  onChange,
  onClose,
  onConfirm,
  confirmText,
  danger = false,
}: any) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          padding: "24px 28px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          width: "360px",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "14px", color: "#111" }}>{title}</h3>
        {message && (
          <p style={{ fontSize: "14px", color: "#555", marginBottom: "14px" }}>
            {message}
          </p>
        )}
        {placeholder && (
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginBottom: "14px",
              outline: "none",
            }}
            autoFocus
          />
        )}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px 12px",
              background: "#e5e7eb",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "6px 12px",
              background: danger ? "#dc2626" : "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
