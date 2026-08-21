"use client";

import { LoaderCircle, Trash2 } from "lucide-react";

import { Button } from "@/lib/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/lib/components/ui/dialog";

export function DeleteContentDialog({
  open,
  title,
  itemLabel,
  deleting,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  title: string;
  itemLabel: string;
  deleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin-theme-surface max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            “{itemLabel}” chỉ bị xóa khỏi dữ liệu mẫu trong phiên hiện tại.
            Reload trang có thể khôi phục dữ liệu ban đầu.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          <Button variant="destructive" disabled={deleting} onClick={onConfirm}>
            {deleting ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
            Xóa nội dung
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
