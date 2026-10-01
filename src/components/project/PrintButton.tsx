'use client';

/** Datasheets print as a one-page spec; the print stylesheet hides site chrome. */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="underline decoration-rule-strong underline-offset-4 hover:text-ink"
    >
      Print as PDF
    </button>
  );
}
