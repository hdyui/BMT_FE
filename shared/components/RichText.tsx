import { Fragment, type ReactNode } from "react";

/**
 * Hiển thị chữ lấy từ DB kèm định dạng. DB chỉ lưu chữ thuần nên định dạng được
 * suy ra từ CHÍNH chữ đó theo quy ước, để admin sửa chữ mà không mất chi tiết:
 *  - `\n` trong chữ là chỗ ngắt dòng admin đặt (xuống dòng khi nhập);
 *  - cụm in đậm: khai báo danh sách cụm cần đậm, cụm nào còn nằm trong chữ thì
 *    được in đậm (kể cả khi bị ngắt dòng giữa cụm);
 *  - điểm ngắt riêng cho mobile: khai báo cụm đứng trước chỗ ngắt.
 * Component không bọc thêm thẻ nào, dùng trực tiếp bên trong h1/h2/p.
 */

export type RichTextMode =
  /** Mỗi `\n` là một lần xuống dòng ở mọi kích thước (tiêu đề). */
  | "lines"
  /** Mỗi dòng là một khối riêng không tự xuống dòng (`block whitespace-nowrap`). */
  | "blocks"
  /** Nối các dòng bằng khoảng trắng, không ép ngắt dòng. */
  | "inline"
  /** `\n` chỉ ngắt dòng từ breakpoint `breakFrom` trở lên (đoạn văn). */
  | "desktopBreaks"
  /** Dòng đầu chữ thường, các dòng sau in đậm (tiêu đề hai độ đậm). */
  | "twoWeights"
  /** Tiêu đề có "&" cuối dòng 1: bản mobile đẩy "&" xuống dòng 2, bản desktop dính "&" vào dòng 1. */
  | "ampersand"
  /** Chỉ bản mobile của `ampersand`. */
  | "ampersandMobile";

export type BreakFrom = "sm" | "md" | "lg" | "sm-block";

// Viết đủ tên class để Tailwind quét được.
const BREAK_CLASS: Record<BreakFrom, string> = {
  sm: "hidden sm:inline",
  md: "hidden md:inline",
  lg: "hidden lg:inline",
  "sm-block": "hidden sm:block",
};

export interface RichTextProps {
  /** Chữ từ DB. */
  text: string | undefined;
  mode?: RichTextMode;
  /** Chỉ dùng với `desktopBreaks`. */
  breakFrom?: BreakFrom;
  bold?: { phrases: readonly string[]; className: string; tag?: "span" | "strong" };
  /**
   * Chèn một chỗ ngắt dòng sau cụm này. `mobileOnly`: chỉ ngắt ở mobile (từ md
   * trở lên bỏ ngắt); không đặt thì ngắt ở mọi kích thước.
   */
  breakAfter?: { phrase: string; mobileOnly?: boolean };
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const MOBILE_BREAK = "\u0001";

function withBreaks(value: string, mode: RichTextMode, breakFrom: BreakFrom): ReactNode {
  const parts = value.split(/\n|\u0001/);
  const separators = [...value.matchAll(/\n|\u0001/g)].map((match) => match[0]);
  return parts.map((part, index) => {
    const separator = index > 0 ? separators[index - 1] : null;
    return (
      <Fragment key={index}>
        {separator === MOBILE_BREAK ? (
          <>
            {" "}
            <br className="md:hidden" />
          </>
        ) : separator === "\n" ? (
          mode === "lines" ? (
            <br />
          ) : mode === "inline" ? (
            " "
          ) : (
            <>
              <br className={BREAK_CLASS[breakFrom]} />{" "}
            </>
          )
        ) : null}
        {part}
      </Fragment>
    );
  });
}

export function RichText({
  text,
  mode = "lines",
  breakFrom = "lg",
  bold,
  breakAfter,
}: RichTextProps) {
  if (!text) return null;
  let value = text.replace(/\r\n/g, "\n").trim();

  if (mode === "blocks") {
    return (
      <>
        {value.split("\n").map((line, index) => (
          <span className="block whitespace-nowrap" key={index}>
            {line}
          </span>
        ))}
      </>
    );
  }

  if (mode === "twoWeights") {
    const [first, ...rest] = value.split("\n");
    return (
      <>
        <span className="font-normal">{first}</span>
        {rest.length > 0 && (
          <>
            <br />
            <span className="font-extrabold">{rest.join(" ")}</span>
          </>
        )}
      </>
    );
  }

  if (mode === "ampersand" || mode === "ampersandMobile") {
    const [first, ...rest] = value.split("\n");
    const second = rest.join(" ");
    if (/\s&$/.test(first) && second) {
      const head = first.replace(/\s&$/, "");
      const mobile = (
        <>
          {head}
          <br />& {second}
        </>
      );
      if (mode === "ampersandMobile") return mobile;
      return (
        <>
          <span className="md:hidden">{mobile}</span>
          <span className="hidden md:inline">
            {head}
            {" &"}
            <br />
            {second}
          </span>
        </>
      );
    }
    // Không có "&" cuối dòng 1: giữ nguyên các dòng.
    return <>{withBreaks(value, "lines", breakFrom)}</>;
  }

  if (breakAfter) {
    // Không phân biệt hoa/thường và khoảng trắng/xuống dòng trong cụm.
    const found = new RegExp(escapeRegExp(breakAfter.phrase).replace(/ +/g, "\\s+"), "i").exec(value);
    if (found) {
      const end = found.index + found[0].length;
      const rest = value.slice(end).replace(/^\s+/, "");
      value = `${value.slice(0, end)}${breakAfter.mobileOnly ? MOBILE_BREAK : "\n"}${rest}`;
    }
  }

  if (!bold || bold.phrases.length === 0) {
    return <>{withBreaks(value, mode, breakFrom)}</>;
  }

  // In đậm: tìm cụm trong cả chuỗi (dấu cách trong cụm khớp cả `\n`), rồi mới xử lý ngắt dòng.
  const pattern = new RegExp(
    bold.phrases.map((phrase) => escapeRegExp(phrase).replace(/ +/g, "\\s+")).join("|"),
    "gi",
  );
  const Tag = bold.tag ?? "strong";
  const nodes: ReactNode[] = [];
  let cursor = 0;
  for (const match of value.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > cursor) nodes.push(<Fragment key={`t${cursor}`}>{withBreaks(value.slice(cursor, start), mode, breakFrom)}</Fragment>);
    nodes.push(
      <Tag className={bold.className} key={`b${start}`}>
        {withBreaks(match[0], mode, breakFrom)}
      </Tag>,
    );
    cursor = start + match[0].length;
  }
  if (cursor < value.length) nodes.push(<Fragment key={`t${cursor}`}>{withBreaks(value.slice(cursor), mode, breakFrom)}</Fragment>);
  return <>{nodes}</>;
}
