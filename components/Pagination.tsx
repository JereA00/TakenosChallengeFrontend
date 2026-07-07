"use client";

import { MESSAGES } from "@/lib/messages";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const btnBase: React.CSSProperties = {
  height: 36, padding: "0 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
  border: "1px solid rgba(255,255,255,0.15)", color: "white", cursor: "pointer",
  background: "rgba(255,255,255,0.08)", transition: "opacity 0.15s",
};

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <button
        style={{ ...btnBase, opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        {MESSAGES.pagination.previous}
      </button>

      <span className="text-sm font-semibold" style={{ color: "rgba(147,197,253,0.7)" }}>
        {page} / {totalPages}
      </span>

      <button
        style={{ ...btnBase, opacity: page === totalPages ? 0.3 : 1, cursor: page === totalPages ? "not-allowed" : "pointer" }}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        {MESSAGES.pagination.next}
      </button>
    </div>
  );
}
