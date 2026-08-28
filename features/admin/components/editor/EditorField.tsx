"use client";

import { useLayoutEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";

import { ImageField } from "@/features/admin/components/ImageField";
import { RichTextField } from "@/features/admin/components/editor/RichTextField";
import type {
  AdminFieldConfig,
  AdminFieldOption,
  AdminFieldValue,
} from "@/features/admin/lib/types/crud";
import { Button } from "@/features/admin/components/ui/button";
import { Input } from "@/features/admin/components/ui/input";
import { Textarea } from "@/features/admin/components/ui/textarea";
import { Switch } from "@/features/admin/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/features/admin/components/ui/select";
import { cn } from "@/shared/lib/utils";

export function EditorField({
  field,
  value,
  labelOverride,
  error,
  dirty = false,
  altValue,
  altDirty = false,
  contentEditorStyle = false,
  multilineText = false,
  lockItemCount = false,
  hideAlt = false,
  imageSize = "thumb",
  onChange,
  onAltChange,
}: {
  field: AdminFieldConfig;
  value: AdminFieldValue | undefined;
  labelOverride?: string;
  error?: string;
  dirty?: boolean;
  altValue?: AdminFieldValue;
  altDirty?: boolean;
  contentEditorStyle?: boolean;
  /** Cho phép ô text/list nhận Enter khi nội dung website có ngắt dòng chủ động. */
  multilineText?: boolean;
  /**
   * Khóa số lượng dòng của ô danh sách: chỉ sửa nội dung từng dòng, không thêm
   * hay xóa. Dùng cho các trang có layout cố định theo số mục.
   */
  lockItemCount?: boolean;
  /**
   * Ẩn ô "Văn bản thay thế" đi kèm ảnh — dùng khi bố cục đã tách nó sang cột
   * chữ để bám đúng vị trí trên website.
   */
  hideAlt?: boolean;
  /**
   * Cỡ ảnh xem trước. `fill` cho ô ảnh cao hết cột chứa nó — dùng ở bố cục ảnh
   * một bên, chữ một bên để cột ảnh không còn là một mẩu nhỏ trên vùng trống.
   */
  imageSize?: "thumb" | "large" | "wide" | "fill";
  onChange: (value: AdminFieldValue) => void;
  onAltChange?: (value: AdminFieldValue) => void;
}) {
  if (field.type === "image") {
    return (
      <div className={cn("grid gap-3", imageSize === "fill" && "min-h-0 flex-1")}>
        <ImageField
          label={labelOverride ?? getConciseImageLabel(field.label)}
          value={String(value ?? "")}
          alt={labelOverride ?? field.label}
          ratio={field.ratio}
          recommendedSize={field.recommendedSize}
          dirty={dirty}
          streamlined={contentEditorStyle}
          size={imageSize}
          onChange={onChange}
        />
        {!hideAlt && field.altKey && onAltChange && (
          <label className="grid gap-2 text-sm font-normal">
            <span
              className={cn(
                "flex items-center gap-2",
                contentEditorStyle ? "font-semibold" : "font-medium",
              )}
            >
              {altDirty && <span className="size-2 rounded-full bg-brand" aria-label="Có thay đổi chưa lưu" />}
              Văn bản thay thế
            </span>
            <Input
              value={String(altValue ?? "")}
              className="h-10 bg-background font-normal"
              onChange={(event) => onAltChange(event.target.value)}
            />
          </label>
        )}
        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  }

  if (field.type === "boolean") {
    const enabled = Boolean(value);
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/25 px-4 py-3">
        <div>
          <p
            className={cn(
              "flex items-center gap-2 text-sm",
              contentEditorStyle ? "font-semibold" : "font-medium",
            )}
          >
            {dirty && <span className="size-2 rounded-full bg-brand" aria-label="Có thay đổi chưa lưu" />}
            {field.label}
          </p>
          {field.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {field.description}
            </p>
          )}
        </div>
        <Switch
          checked={enabled}
          disabled={field.disabled}
          title={field.disabledReason}
          onCheckedChange={(checked) => onChange(checked)}
          aria-label={enabled ? "Đang hiển thị" : "Đang ẩn"}
        />
      </div>
    );
  }

  if (field.type === "list") {
    return (
      <ArrayField
        label={field.label}
        description={field.description}
        dirty={dirty}
        emphasized={contentEditorStyle}
        multilineText={multilineText}
        values={Array.isArray(value) ? value : []}
        mode={lockItemCount ? "fixed" : field.listMode ?? "dynamic"}
        inline={field.listLayout === "inline"}
        onChange={onChange}
      />
    );
  }

  const currentValue = String(value ?? "");
  const counter = field.maxLength
    ? `${currentValue.length}/${field.maxLength}`
    : undefined;

  return (
    <label className="grid gap-2 text-sm font-normal">
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={cn(
            "flex items-center gap-2",
            contentEditorStyle ? "font-semibold" : "font-medium",
          )}
        >
          {dirty && <span className="size-2 rounded-full bg-brand" aria-label="Có thay đổi chưa lưu" />}
          {field.label}
        </span>
        {counter && (
          <span className="text-[11px] font-normal text-muted-foreground">
            {counter}
          </span>
        )}
      </span>
      {field.type === "richtext" ? (
        <div className="font-normal">
          <RichTextField
            value={currentValue}
            placeholder={field.placeholder}
            invalid={Boolean(error)}
            onChange={onChange}
          />
        </div>
      ) : field.type === "textarea" || (multilineText && field.type === "text") ? (
        <AutoGrowTextarea
          value={currentValue}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : field.type === "select" ? (
        <Select value={currentValue || null} onValueChange={(nextValue) => onChange(nextValue ?? "")}>
          <SelectTrigger className="w-full font-normal" aria-invalid={Boolean(error)}>
            <SelectValue placeholder={field.placeholder ?? "Chọn giá trị"} />
          </SelectTrigger>
          {/* `alignItemWithTrigger={false}`: mặc định base-ui đặt mục đang chọn
              chồng lên nút bấm kiểu select của macOS, che mất cả nhãn lẫn giá
              trị hiện tại. Cho thả xuống dưới, canh mép trái nút. */}
          <SelectContent
            className="font-normal"
            align="start"
            alignItemWithTrigger={false}
          >
            {getSelectOptions(field, currentValue).map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={field.type === "number" ? "number" : "text"}
          inputMode={field.type === "url" ? "url" : undefined}
          value={currentValue}
          min={field.min}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          aria-invalid={Boolean(error)}
          className="h-10 bg-background font-normal"
          onChange={(event) =>
            onChange(
              field.type === "number"
                ? Number(event.target.value)
                : event.target.value,
            )
          }
        />
      )}
      {field.description && (
        <span className="text-xs font-normal text-muted-foreground">
          {field.description}
        </span>
      )}
      {error && <FieldError>{error}</FieldError>}
    </label>
  );
}

/**
 * Chuẩn hóa danh sách lựa chọn của ô `select`.
 *
 * Nếu giá trị đang lưu không còn nằm trong danh sách (trang đã bị xóa hoặc đổi
 * đường dẫn) thì vẫn đưa nó lên đầu kèm ghi chú, để admin nhìn ra là đang trỏ
 * vào một địa chỉ hỏng thay vì thấy ô trống không rõ đang trỏ đâu.
 */
function getSelectOptions(
  field: AdminFieldConfig,
  currentValue: string,
): AdminFieldOption[] {
  const options = (field.options ?? []).map((option) =>
    typeof option === "string" ? { value: option, label: option } : option,
  );
  if (!currentValue || options.some((option) => option.value === currentValue)) {
    return options;
  }
  return [
    { value: currentValue, label: `${currentValue} — liên kết không còn trang` },
    ...options,
  ];
}

function getConciseImageLabel(label: string) {
  const concise = label.split("·").at(-1)?.trim() ?? label;
  return concise
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * `field-sizing: content` (đã có sẵn trong `Textarea`) cho ô tự cao theo nội
 * dung. Trình duyệt chưa hỗ trợ thì mới cần đo bằng JS.
 */
const supportsFieldSizing =
  typeof CSS !== "undefined" && typeof CSS.supports === "function"
    ? CSS.supports("field-sizing", "content")
    : false;

/**
 * Ô nhiều dòng luôn cao vừa đủ để thấy hết nội dung.
 *
 * Bản cũ gán cứng `height` đo một lần theo `value` rồi `overflow-hidden`, nên
 * mỗi khi bề ngang ô đổi (lưới 12 cột đổi theo khổ màn hình, thanh cuộn xuất
 * hiện, font tải xong) số dòng đổi theo mà chiều cao thì không — chữ bị cắt mất.
 */
function AutoGrowTextarea({
  value,
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    if (supportsFieldSizing) return;
    const textarea = ref.current;
    if (!textarea) return;

    const resize = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    resize();

    if (typeof ResizeObserver === "undefined") return;
    // Chỉ đo lại khi bề ngang đổi — nếu bắt cả chiều cao thì chính việc gán
    // chiều cao lại kích hoạt observer, thành vòng lặp vô tận.
    let lastWidth = textarea.clientWidth;
    const observer = new ResizeObserver(() => {
      if (textarea.clientWidth === lastWidth) return;
      lastWidth = textarea.clientWidth;
      resize();
    });
    observer.observe(textarea);
    return () => observer.disconnect();
  }, [value]);

  return (
    <Textarea
      {...props}
      ref={ref}
      value={value}
      rows={1}
      className={cn(
        // Bỏ `overflow-hidden`: lỡ chiều cao có đo hụt thì nội dung vẫn cuộn
        // được để đọc tiếp, chứ không biến mất.
        "min-h-10 resize-none bg-background font-normal",
        className,
      )}
    />
  );
}

function ArrayField({
  label,
  description,
  dirty,
  emphasized,
  multilineText = false,
  values,
  mode,
  inline = false,
  onChange,
}: {
  label: string;
  description?: string;
  dirty: boolean;
  emphasized: boolean;
  multilineText?: boolean;
  values: string[];
  mode: "fixed" | "dynamic";
  /** Xếp các dòng nằm ngang cạnh nhau, như cách website bày chúng. */
  inline?: boolean;
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className={cn(
              "flex items-center gap-2 text-sm",
              emphasized ? "font-semibold" : "font-medium",
            )}
          >
            {dirty && <span className="size-2 rounded-full bg-brand" aria-label="Có thay đổi chưa lưu" />}
            {label}
          </p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
          {mode === "fixed" && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Số dòng cố định theo layout website — chỉ sửa được nội dung từng dòng.
            </p>
          )}
        </div>
        {mode === "dynamic" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onChange([...values, ""])}
          >
            <Plus /> Thêm dòng
          </Button>
        )}
      </div>
      {values.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-6 text-center text-xs text-muted-foreground">
          Chưa có nội dung trong danh sách.
        </div>
      ) : (
        <div
          className={cn(
            inline
              ? // Xếp ngang: mỗi dòng một cột, số thứ tự nằm trên ô nhập cho gọn.
                "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              : "space-y-2",
          )}
        >
          {values.map((item, index) => (
            <div
              className={cn(
                inline ? "flex flex-col gap-1" : "flex items-start gap-2",
              )}
              key={index}
            >
              <span
                className={cn(
                  "shrink-0 text-xs tabular-nums text-muted-foreground",
                  inline ? "font-semibold" : "mt-3 w-7 text-center",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {multilineText ? (
                <AutoGrowTextarea
                  className="flex-1"
                  value={item}
                  onChange={(event) => {
                    const next = [...values];
                    next[index] = event.target.value;
                    onChange(next);
                  }}
                />
              ) : (
                <Input
                  value={item}
                  className="h-10 bg-background font-normal"
                  onChange={(event) => {
                    const next = [...values];
                    next[index] = event.target.value;
                    onChange(next);
                  }}
                />
              )}
              {mode === "dynamic" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Xóa dòng"
                  onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium text-destructive" role="alert">
      {children}
    </span>
  );
}
