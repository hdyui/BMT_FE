export interface ContactSubmission {
  id: string;
  name: string;
  phone: string;
  reviewed: boolean;
  submittedAt: string;
}

export const CONTACT_SUBMISSIONS_STORAGE_KEY = "bmt-contact-submissions";
export const CONTACT_SUBMISSIONS_CHANGED_EVENT =
  "bmt-contact-submissions-changed";

export function readContactSubmissions(): ContactSubmission[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CONTACT_SUBMISSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(isContactSubmission)
      .map((item) => ({
        ...item,
        reviewed: item.reviewed === true,
      }));
  } catch {
    return [];
  }
}

export function saveContactSubmission(
  submission: Omit<ContactSubmission, "id" | "submittedAt" | "reviewed">,
) {
  if (typeof window === "undefined") return;

  const record: ContactSubmission = {
    ...submission,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    reviewed: false,
    submittedAt: new Date().toISOString(),
  };

  const next = [record, ...readContactSubmissions()];
  window.localStorage.setItem(
    CONTACT_SUBMISSIONS_STORAGE_KEY,
    JSON.stringify(next),
  );
  window.dispatchEvent(new Event(CONTACT_SUBMISSIONS_CHANGED_EVENT));
}

export function deleteContactSubmission(id: string) {
  if (typeof window === "undefined") return;

  const next = readContactSubmissions().filter((item) => item.id !== id);
  window.localStorage.setItem(
    CONTACT_SUBMISSIONS_STORAGE_KEY,
    JSON.stringify(next),
  );
  window.dispatchEvent(new Event(CONTACT_SUBMISSIONS_CHANGED_EVENT));
}

export function updateContactSubmissionReviewed(
  id: string,
  reviewed: boolean,
) {
  if (typeof window === "undefined") return;

  const next = readContactSubmissions().map((item) =>
    item.id === id ? { ...item, reviewed } : item,
  );
  window.localStorage.setItem(
    CONTACT_SUBMISSIONS_STORAGE_KEY,
    JSON.stringify(next),
  );
  window.dispatchEvent(new Event(CONTACT_SUBMISSIONS_CHANGED_EVENT));
}

function isContactSubmission(
  value: unknown,
): value is Omit<ContactSubmission, "reviewed"> & { reviewed?: unknown } {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<ContactSubmission>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.phone === "string" &&
    typeof item.submittedAt === "string"
  );
}