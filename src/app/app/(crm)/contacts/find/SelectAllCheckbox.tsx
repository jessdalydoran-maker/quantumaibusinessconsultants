"use client";

export function SelectAllCheckbox() {
  return (
    <input
      type="checkbox"
      aria-label="Select all results"
      onChange={(e) => {
        const form = e.currentTarget.closest("form");
        const boxes = form?.querySelectorAll<HTMLInputElement>('input[name="selectedPlaceIds"]');
        boxes?.forEach((box) => {
          box.checked = e.currentTarget.checked;
        });
      }}
    />
  );
}
