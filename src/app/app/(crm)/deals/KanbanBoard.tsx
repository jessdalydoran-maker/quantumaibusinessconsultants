"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { moveDealAction, markDealStatusAction } from "./actions";

type Stage = { id: string; name: string; sort_order: number };
type Deal = {
  id: string;
  title: string;
  value: number;
  currency: string;
  status: "open" | "won" | "lost";
  stage_id: string;
  contact_id: string | null;
};

export function KanbanBoard({
  stages,
  deals,
  contactNameById,
}: {
  stages: Stage[];
  deals: Deal[];
  contactNameById: Record<string, string>;
}) {
  const [items, setItems] = useState(deals);
  const [dragId, setDragId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleDrop(stageId: string) {
    if (!dragId) return;
    const deal = items.find((d) => d.id === dragId);
    if (!deal || deal.stage_id === stageId) {
      setDragId(null);
      return;
    }

    setItems((prev) => prev.map((d) => (d.id === dragId ? { ...d, stage_id: stageId } : d)));
    startTransition(() => {
      moveDealAction(dragId, stageId);
    });
    setDragId(null);
  }

  function handleMarkStatus(dealId: string, status: "won" | "lost") {
    setItems((prev) => prev.map((d) => (d.id === dealId ? { ...d, status } : d)));
    const formData = new FormData();
    formData.set("dealId", dealId);
    formData.set("status", status);
    startTransition(() => {
      markDealStatusAction(formData);
    });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageDeals = items.filter((d) => d.stage_id === stage.id);
        return (
          <div
            key={stage.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage.id)}
            className="w-72 flex-shrink-0 rounded-sm border border-border bg-bg-alt p-3"
          >
            <h3 className="flex items-center justify-between text-sm font-medium text-text">
              {stage.name}
              <span className="text-xs text-text-muted">{stageDeals.length}</span>
            </h3>
            <div className="mt-3 space-y-3">
              {stageDeals.map((deal) => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={() => setDragId(deal.id)}
                  className={`cursor-grab rounded-sm border border-border bg-bg p-3 text-sm active:cursor-grabbing ${
                    deal.status === "won"
                      ? "border-green-600/50"
                      : deal.status === "lost"
                        ? "border-red-600/50 opacity-70"
                        : ""
                  }`}
                >
                  <p className="text-text">{deal.title}</p>
                  {deal.contact_id && contactNameById[deal.contact_id] && (
                    <p className="mt-1 text-xs text-text-muted">{contactNameById[deal.contact_id]}</p>
                  )}
                  <p className="mt-1 text-xs text-gold">
                    {deal.currency} {Number(deal.value).toLocaleString()}
                  </p>
                  {deal.status === "open" ? (
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleMarkStatus(deal.id, "won")}
                        className="rounded-sm border border-border px-2 py-1 text-xs text-text-muted hover:border-green-500 hover:text-green-400"
                      >
                        Won
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMarkStatus(deal.id, "lost")}
                        className="rounded-sm border border-border px-2 py-1 text-xs text-text-muted hover:border-red-500 hover:text-red-400"
                      >
                        Lost
                      </button>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs uppercase tracking-wide text-text-muted">{deal.status}</p>
                  )}
                  {deal.contact_id && (
                    <Link
                      href={`/app/contacts/${deal.contact_id}`}
                      className="mt-2 block text-xs text-text-muted hover:text-gold"
                    >
                      View contact →
                    </Link>
                  )}
                </div>
              ))}
              {stageDeals.length === 0 && (
                <p className="py-4 text-center text-xs text-text-muted">Drop deals here</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
