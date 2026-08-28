import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface AdminBreadcrumbItem {
  label: string;
  href?: string;
}

export function AdminBreadcrumb({ items }: { items: AdminBreadcrumbItem[] }) {
  return (
    <nav
      className="admin-scrollbar overflow-x-auto pb-1"
      aria-label="Breadcrumb"
    >
      <ol className="flex min-w-max items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link className="hover:text-foreground" href="/admin/dashboard">
            Admin
          </Link>
        </li>
        {items.map((item, index) => (
          <li className="flex items-center gap-1.5" key={`${item.label}-${index}`}>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            {item.href ? (
              <Link className="hover:text-foreground" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
