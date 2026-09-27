import type { AdminCrudRecord } from "@/features/admin/lib/types/crud";

/**
 * Nối một nhóm resource của admin với backend. Record của các resource này được
 * dựng HOÀN TOÀN từ dữ liệu backend (không có giá trị mặc định nào trong code) và
 * mọi thay đổi được lưu qua API, không qua mock.
 */
export interface RemoteResourceBinding {
  /** Khóa nhóm: các resource cùng nhóm được tải chung bằng một lượt gọi. */
  pageKey: string;
  /** Resource nào thuộc nhóm này. */
  handles(resourceKey: string): boolean;
  load(): Promise<Record<string, AdminCrudRecord[]>>;
  /** Lưu thay đổi giữa hai trạng thái của một resource; trả về record sau khi backend xác nhận. */
  save(
    resourceKey: string,
    previous: AdminCrudRecord[],
    next: AdminCrudRecord[],
  ): Promise<AdminCrudRecord[]>;
  /** Chỉ có với collection cho phép thêm/xóa mục (số mục không cố định). */
  create?(
    resourceKey: string,
    previous: AdminCrudRecord[],
    input: AdminCrudRecord,
  ): Promise<AdminCrudRecord[]>;
  remove?(
    resourceKey: string,
    previous: AdminCrudRecord[],
    id: string,
  ): Promise<AdminCrudRecord[]>;
}
