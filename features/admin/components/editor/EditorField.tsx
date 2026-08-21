"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { ImageField } from "@/features/admin/components/ImageField";
import type {
  AdminFieldConfig,
  AdminFieldValue,
} from "@/lib/admin/types/crud";
import { Button } from "@/lib/components/ui/button";
import { Input } from "@/lib/components/ui/input";
import { Textarea } from "@/lib/components/ui/textarea";
import { cn } from "@/lib/utils";

export function EditorField({
  field,
  value,
  altValue,
  error,
  onChange,
  onAltChange,
}: {
  field: AdminFieldConfig;
  value: AdminFieldValue | undefined;
  altValue?: string;
  error?: string;
  onChange: (value: AdminFieldValue) => void;
  onAltChange?: (value: string) => void;
}) {
  if (field.type === "image") {
    return (
      <div>
        <ImageField
          label={field.label}
          value={String(value ?? "")}
          alt={altValue ?? ""}
          ratio={field.ratio}
          recommendedSize={field.recommendedSize}
          showAlt={Boolean(field.altKey)}
          onChange={onChange}
          onAltChange={onAltChange}
        />
        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  }

  if (field.type === "boolean") {
    const enabled = Boolean(value);
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border bg-muted/25 px-4 py-3">
        <div>
          <p className="text-sm font-medium">{field.label}</p>
          {field.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {field.description}
            </p>
          )}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(!enabled)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full border outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/30",
            enabled ? "border-brand bg-brand" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 size-4.5 rounded-full bg-white shadow-sm transition-transform",
              enabled ? "translate-x-5" : "translate-x-0.5",
            )}
          />
          <span className="sr-only">{enabled ? "Đang hiển thị" : "Đang ẩn"}</span>
        </button>
      </div>
    );
  }

  if (field.type === "list") {
    return (
      <ArrayField
        label={field.label}
        description={field.description}
        values={Array.isArray(value) ? value : []}
        onChange={onChange}
      />
    );
  }

  const currentValue = String(value ?? "");
  const counter = field.maxLength
    ? `${currentValue.length}/${field.maxLength}`
    : undefined;

  return (
    <label className="grid gap-2 text-sm font-medium">
      <span className="flex flex-wrap items-center justify-between gap-2">
        <span>
          {field.label}
          {field.required && <span className="ml-1 text-brand">*</span>}
        </span>
        {counter && (
          <span className="text-[11px] font-normal text-muted-foreground">
            {counter}
          </span>
        )}
      </span>
      {field.type === "textarea" ? (
        <Textarea
          value={currentValue}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          aria-invalid={Boolean(error)}
          className="min-h-28 resize-y bg-background"
          onChange={(event) => onChange(event.target.value)}
        />
      ) : field.type === "select" ? (
        <select
          value={currentValue}
          aria-invalid={Boolean(error)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/30"
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Chọn giá trị</option>
          {field.options?.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <Input
          type={field.type === "number" ? "number" : "text"}
          inputMode={field.type === "url" ? "url" : undefined}
          value={currentValue}
          min={field.min}
          maxLength={field.maxLength}
          placeholder={field.placeholder}
          aria-invalid={Boolean(error)}
          className="h-10 bg-background"
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

function ArrayField({
  label,
  description,
  values,
  onChange,
}: {
  label: string;
  description?: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{label}</p>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
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
            <div className="flex items-center gap-2" key={index}>
              <span className="w-7 shrink-0 text-center text-xs tabular-nums text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <Input
                value={item}
                className="h-10 bg-background"
                onChange={(event) => {
                  const next = [...values];
                  next[index] = event.target.value;
                  onChange(next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === 0}
                aria-label="Di chuyển lên"
                onClick={() => move(index, -1)}
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={index === values.length - 1}
                aria-label="Di chuyển xuống"
                onClick={() => move(index, 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Xóa dòng"
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
