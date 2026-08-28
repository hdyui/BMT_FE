import type { AdminFieldConfig, AdminFieldType } from "@/features/admin/lib/types/crud";

/**
 * Bố cục ô nhập của trình biên tập theo lưới 12 cột (chỉ bật từ `lg` trở lên,
 * dưới đó vẫn xếp dọc một cột cho dễ thao tác).
 *
 * Mục tiêu: các ô nằm cạnh nhau giống cách chúng nằm trên website, thay vì mỗi
 * ô chiếm trọn một hàng và bỏ trống nửa màn hình bên phải. Thứ tự ô giữ nguyên
 * thứ tự khai báo trong registry — vốn đã đi theo thứ tự xuất hiện trên trang.
 */
export const EDITOR_GRID_COLUMNS = 12;

/**
 * Bề ngang "tự nhiên" của từng loại ô. Ô càng chứa nội dung dài thì càng rộng,
 * nên nó cũng phản chiếu độ nổi bật của thành phần đó trên website.
 */
const NATURAL_SPAN: Record<AdminFieldType, number> = {
  text: 4,
  url: 4,
  number: 2,
  boolean: 4,
  select: 4,
  textarea: 4,
  richtext: EDITOR_GRID_COLUMNS,
  image: 3,
  list: EDITOR_GRID_COLUMNS,
};

/**
 * Lớp Tailwind viết sẵn đủ 12 giá trị: Tailwind quét mã nguồn theo chuỗi tĩnh
 * nên không dùng được `lg:col-span-${n}`.
 */
const SPAN_CLASS: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};

export const EDITOR_GRID_CLASS =
  "grid grid-cols-1 items-start gap-4 lg:grid-cols-12 lg:gap-5";

export function editorSpanClass(span: number) {
  return SPAN_CLASS[clampSpan(span)];
}

/**
 * Ô ảnh chiếm gần trọn bề ngang (thường là ô ảnh duy nhất của một mục) thì ảnh
 * xem trước cũng phải to theo, không thì cả hàng chỉ có một con tem bé xíu nằm
 * nép bên trái và bỏ trống phần còn lại.
 */
export function editorImagePreviewSize(
  field: AdminFieldConfig,
  span: number,
): "wide" | undefined {
  return field.type === "image" && span >= 9 ? "wide" : undefined;
}

export interface EditorFieldLayout {
  field: AdminFieldConfig;
  span: number;
  /** Bề ngang do registry hoặc luật ảnh chỉ định — không kéo giãn thêm. */
  fixed?: boolean;
}

/**
 * Một dãy từ 3 ô ảnh trở lên là một thư viện ảnh: mọi ô phải bằng nhau, nếu
 * không hàng cuối bị kéo giãn to hơn hàng trên trông rất lệch (5 ảnh sẽ ra
 * 4-4-4 rồi 6-6). Chia đều số ảnh cho các hàng rồi lấy chung một bề ngang.
 */
const MIN_IMAGE_GALLERY = 3;
const MAX_IMAGES_PER_ROW = 4;

function uniformImageSpan(count: number) {
  const rows = Math.ceil(count / MAX_IMAGES_PER_ROW);
  const perRow = Math.ceil(count / rows);
  return Math.floor(EDITOR_GRID_COLUMNS / perRow);
}

/**
 * Xếp danh sách ô thành các hàng vừa đúng 12 cột.
 *
 * 1. Xếp lần lượt theo bề ngang tự nhiên (hoặc `span` do registry chỉ định khi
 *    muốn bám sát bố cục thật của website), hết chỗ thì sang hàng mới.
 * 2. Cân lại hàng cuối nếu nó quá lẻ loi so với hàng trước, tránh cảnh một ô
 *    đứng một mình cả hàng.
 * 3. Kéo giãn các ô trong mỗi hàng cho tổng đúng 12 — nhờ vậy không còn khoảng
 *    trống thừa ở mép phải.
 */
export function packEditorFields(fields: AdminFieldConfig[]): EditorFieldLayout[] {
  const gallerySpans = getGallerySpans(fields);
  const rows: EditorFieldLayout[][] = [];
  let current: EditorFieldLayout[] = [];
  let used = 0;

  for (const [index, field] of fields.entries()) {
    const gallerySpan = gallerySpans.get(index);
    const explicitSpan = field.span ?? gallerySpan;
    const span = clampSpan(explicitSpan ?? NATURAL_SPAN[field.type]);
    if (current.length > 0 && used + span > EDITOR_GRID_COLUMNS) {
      rows.push(current);
      current = [];
      used = 0;
    }
    current.push({ field, span, fixed: explicitSpan !== undefined });
    used += span;
  }
  if (current.length > 0) rows.push(current);

  rebalanceLastRow(rows);
  for (const row of rows) stretchRow(row);

  return rows.flat();
}

/** Dồn bớt ô từ hàng áp chót xuống hàng cuối khi hàng cuối bị hụt quá nhiều. */
function rebalanceLastRow(rows: EditorFieldLayout[][]) {
  if (rows.length < 2) return;
  const previous = rows[rows.length - 2];
  const last = rows[rows.length - 1];
  while (previous.length - last.length >= 2) {
    last.unshift(previous.pop()!);
  }
}

/** Bề ngang cố định cho từng ô ảnh nằm trong một dãy ảnh dài. */
function getGallerySpans(fields: AdminFieldConfig[]) {
  const spans = new Map<number, number>();
  let runStart = 0;

  const closeRun = (endExclusive: number) => {
    const count = endExclusive - runStart;
    if (count < MIN_IMAGE_GALLERY) return;
    const span = uniformImageSpan(count);
    for (let index = runStart; index < endExclusive; index += 1) {
      spans.set(index, span);
    }
  };

  for (const [index, field] of fields.entries()) {
    if (field.type === "image") continue;
    closeRun(index);
    runStart = index + 1;
  }
  closeRun(fields.length);

  return spans;
}

/**
 * Chia đều phần dư của hàng cho các ô trong hàng đó. Hàng mà mọi ô đều đã được
 * chỉ định bề ngang thì để nguyên — đó là chủ ý, không phải chỗ trống cần lấp.
 */
function stretchRow(row: EditorFieldLayout[]) {
  // Chỉ nới những ô chưa được chỉ định bề ngang.
  const growable = row.filter((item) => !item.fixed);
  if (growable.length === 0) return;
  let remaining = EDITOR_GRID_COLUMNS - row.reduce((total, item) => total + item.span, 0);
  if (remaining <= 0) return;
  for (let index = 0; remaining > 0; index = (index + 1) % growable.length) {
    growable[index].span += 1;
    remaining -= 1;
  }
}

function clampSpan(span: number) {
  return Math.min(EDITOR_GRID_COLUMNS, Math.max(1, Math.round(span)));
}
