"use client";

import { useLayoutEffect, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";

import { ImageField } from "@/features/admin/components/ImageField";
import { RichTextField } from "@/features/admin/components/editor/RichTextField";
import type {
  AdminFieldConfig,
  AdminFieldValue,
} from "@/lib/admin/types/crud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  onChange: (value: AdminFieldValue) => void;
  onAltChange?: (value: AdminFieldValue) => void;
}) {
  if (field.type === "image") {
    return (
      <div className="grid gap-3">
        <ImageField
          label={labelOverride ?? getConciseImageLabel(field.label)}
          value={String(value ?? "")}
          alt={labelOverride ?? field.label}
          ratio={field.ratio}
          recommendedSize={field.recommendedSize}
          dirty={dirty}
          streamlined={contentEditorStyle}
          onChange={onChange}
        />
        {field.altKey && onAltChange && (
          <label className="grid gap-2 text-sm font-normal">
            <span
              className={cn(
                "flex items-center gap-2",
                contentEditorStyle ? "font-semibold" : "font-medium",
              )}
            >
              {altDirty && <span className="size-2 rounded-full bg-brand" aria-label="Có thay đổi chưa lưu" />}
              Văn bản thay thế (alt)
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
        mode={field.listMode ?? "dynamic"}
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
            <SelectValue placeholder="Chọn giá trị" />
          </SelectTrigger>
          <SelectContent className="font-normal">
            {field.options?.map((option) => (
              <SelectItem value={option} key={option}>{option}</SelectItem>
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

function getConciseImageLabel(label: string) {
  const concise = label.split("·").at(-1)?.trim() ?? label;
  return concise
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function AutoGrowTextarea({
  value,
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = ref.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <Textarea
      {...props}
      ref={ref}
      value={value}
      rows={1}
      className={cn(
        "min-h-10 resize-none overflow-hidden bg-background font-normal",
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
  onChange,
}: {
  label: string;
  description?: string;
  dirty: boolean;
  emphasized: boolean;
  multilineText?: boolean;
  values: string[];
  mode: "fixed" | "dynamic";
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
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={mode === "fixed"}
          title={mode === "fixed" ? "Số lượng mục được cố định theo layout website" : undefined}
          onClick={() => onChange([...values, ""])}
        >
          <Plus /> Thêm dòng
        </Button>
      </div>
      {values.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-6 text-center text-xs text-muted-foreground">
          Chưa có nội dung trong danh sách.
        </div>
      ) : (
        <div className="space-y-2">
          {values.map((item, index) => (
            <div className="flex items-start gap-2" key={index}>
              <span className="mt-3 w-7 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
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
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Xóa dòng"
                disabled={mode === "fixed"}
                title={mode === "fixed" ? "Số lượng mục được cố định theo layout website" : undefined}
                onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              >
                <Trash2 />
              </Button>
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
