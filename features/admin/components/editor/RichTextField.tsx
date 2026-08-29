"use client";

import { useLayoutEffect, useRef } from "react";
import { Bold, Italic, Link2, List, Pilcrow } from "lucide-react";

import { Button } from "@/features/admin/components/ui/button";

const ALLOWED_TAGS = new Set(["P", "BR", "STRONG", "B", "EM", "I", "A", "UL", "LI"]);

export function RichTextField({
  value,
  placeholder,
  invalid,
  onChange,
}: {
  value: string;
  placeholder?: string;
  invalid?: boolean;
  onChange: (value: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);

  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor || editor.innerHTML === value) return;
    editor.innerHTML = sanitizeRichText(value);
  }, [value]);

  function rememberSelection() {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return;
    selectionRef.current = range.cloneRange();
  }

  function restoreSelection() {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const selection = window.getSelection();
    const range = selectionRef.current;
    if (!selection || !range) return;
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function run(command: "bold" | "italic" | "insertUnorderedList" | "formatBlock", argument?: string) {
    restoreSelection();
    document.execCommand(command, false, argument);
    rememberSelection();
    commit();
  }

  function addLink() {
    rememberSelection();
    const href = window.prompt("Nhập liên kết (https://, /duong-dan, mailto: hoặc tel:)");
    if (!href) return;
    const normalized = href.trim();
    if (!/^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(normalized)) return;
    restoreSelection();
    document.execCommand("createLink", false, normalized);
    rememberSelection();
    commit();
  }

  function emitDraft() {
    const editor = editorRef.current;
    if (!editor) return;

    // Không sanitize/rewrite DOM trong lúc người dùng đang gõ. Trình duyệt cần
    // giữ các node tạm (đặc biệt khi Enter trong <li>) để caret và danh sách hoạt
    // động đúng. Nội dung vẫn được sanitize khi blur hoặc sau thao tác toolbar.
    onChange(editor.innerHTML);
    rememberSelection();
  }

  function commit() {
    const editor = editorRef.current;
    if (!editor) return;
    const next = sanitizeRichText(editor.innerHTML);
    const previous = sanitizeRichText(value);
    if (editor.innerHTML !== next) editor.innerHTML = next;
    if (next !== previous) onChange(next);
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-background focus-within:ring-3 focus-within:ring-ring/20" aria-invalid={invalid}>
      <div className="flex flex-wrap gap-1 border-b bg-muted/30 p-1.5" aria-label="Định dạng nội dung">
        <ToolbarButton label="Đoạn văn" onMouseDown={rememberSelection} onClick={() => run("formatBlock", "p")}><Pilcrow /></ToolbarButton>
        <ToolbarButton label="In đậm" onMouseDown={rememberSelection} onClick={() => run("bold")}><Bold /></ToolbarButton>
        <ToolbarButton label="In nghiêng" onMouseDown={rememberSelection} onClick={() => run("italic")}><Italic /></ToolbarButton>
        <ToolbarButton label="Thêm liên kết" onMouseDown={rememberSelection} onClick={addLink}><Link2 /></ToolbarButton>
        <ToolbarButton label="Danh sách dấu đầu dòng" onMouseDown={rememberSelection} onClick={() => run("insertUnorderedList")}><List /></ToolbarButton>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder ?? "Nhập nội dung..."}
        className="admin-richtext min-h-36 px-3 py-2.5 text-sm leading-relaxed outline-none empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)] [&_a]:text-brand [&_a]:underline [&_li]:ml-5 [&_ul]:list-disc"
        onBlur={commit}
        onFocus={rememberSelection}
        onInput={emitDraft}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
      />
    </div>
  );
}

function ToolbarButton({
  label,
  onMouseDown,
  onClick,
  children,
}: {
  label: string;
  onMouseDown: () => void;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      title={label}
      onMouseDown={(event) => {
        onMouseDown();
        event.preventDefault();
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function sanitizeRichText(html: string) {
  if (typeof document === "undefined") return html;
  const parsed = new DOMParser().parseFromString(html, "text/html");

  for (const element of Array.from(parsed.body.querySelectorAll("*"))) {
    if (!ALLOWED_TAGS.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      continue;
    }
    for (const attribute of Array.from(element.attributes)) {
      if (element.tagName !== "A" || attribute.name !== "href") {
        element.removeAttribute(attribute.name);
      }
    }
    if (element.tagName === "A") {
      const href = element.getAttribute("href") ?? "";
      if (!/^(https?:\/\/|\/(?!\/)|mailto:|tel:|#)/i.test(href)) element.removeAttribute("href");
    }
  }

  return parsed.body.innerHTML.trim();
}
