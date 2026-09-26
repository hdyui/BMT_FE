"use client";

import { useEffect } from "react";
import { LoaderCircle, TriangleAlert } from "lucide-react";

import { Button } from "@/features/admin/components/ui/button";
import { ImageUploadProvider } from "@/features/admin/components/ImageUploadContext";
import { useAdminCrud } from "@/features/admin/components/editor/AdminCrudProvider";
import { uploadImage } from "@/features/admin/lib/upload-image";

/**
 * Bọc các editor của resource đã nối API: tải dữ liệu thật từ backend trước khi
 * hiện editor (tránh sửa nhầm trên bản mock), và bật upload ảnh lên backend cho
 * `ImageField` bên trong. Resource chưa nối API thì hiện thẳng nội dung.
 */
export function RemoteResourceGate({
  resourceKey,
  children,
}: {
  resourceKey: string;
  children: React.ReactNode;
}) {
  const { getRemoteState, loadRemote } = useAdminCrud();
  const state = getRemoteState(resourceKey);

  useEffect(() => {
    if (state.status === "idle") void loadRemote(resourceKey);
  }, [loadRemote, resourceKey, state.status]);

  if (state.status === "none") return <>{children}</>;

  if (state.status === "ready") {
    return <ImageUploadProvider value={uploadImage}>{children}</ImageUploadProvider>;
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 px-4 py-20 text-center">
        <TriangleAlert className="size-8 text-destructive" />
        <div>
          <p className="font-semibold">Không tải được nội dung trang</p>
          <p className="mt-1 text-sm text-muted-foreground">{state.error}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void loadRemote(resourceKey)}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 px-4 py-24 text-sm text-muted-foreground"
    >
      <LoaderCircle className="size-4 animate-spin" />
      Đang tải nội dung...
    </div>
  );
}
