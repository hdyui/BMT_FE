"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";

import { Button } from "@/features/admin/components/ui/button";
import { Input } from "@/features/admin/components/ui/input";
import { sanitizeAdminLocation } from "@/features/admin/lib/auth-config";
import { api } from "@/shared/lib/api/client";
import { ApiError } from "@/shared/lib/api/errors";

function describeLoginError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 422) return "Email hoặc mật khẩu không đúng.";
    if (error.status === 429) {
      return `Bạn đăng nhập quá nhiều lần. Vui lòng đợi ${error.retryAfter ?? 60} giây rồi thử lại.`;
    }
    return "Đăng nhập không thành công. Vui lòng thử lại sau.";
  }
  return "Không kết nối được máy chủ. Vui lòng thử lại.";
}

export function AdminLoginForm({ location = "" }: { location?: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Gọi thẳng POST /api/v1/auth/login (Next chuyển tiếp sang backend). Backend
  // trả cookie phiên HttpOnly nên trình duyệt tự lưu, không cần xử lý token.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      await api.post("/auth/login", { email, password });
      router.replace(sanitizeAdminLocation(location));
    } catch (loginError) {
      setError(describeLoginError(loginError));
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-8 text-foreground sm:px-8">
      <section className="w-full max-w-md">
          <div className="mb-8 flex w-full items-center justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Quay lại website
            </Link>
          </div>

          <div className="w-full">
            <div className="mb-8 text-center">
              <Image
                className="mx-auto mb-5 h-auto w-[190px] object-contain"
                src="/images/cai-tao-sua-chua/logo.png"
                alt="BMT Decor"
                width={1196}
                height={207}
                priority
              />
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Đăng nhập quản trị
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Nhập tài khoản quản trị để truy cập khu vực quản lý nội dung BMT Decor.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <label htmlFor="admin-email" className="text-sm font-semibold">
                  Email
                </label>
                <Input
                  id="admin-email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@bmtdecor.vn"
                  className="h-11 px-3.5"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-semibold">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Nhập mật khẩu"
                    className="h-11 px-3.5 pr-11"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-sm font-medium text-destructive"
                >
                  {error}
                </p>
              )}

              <Button type="submit" className="h-11 w-full" disabled={pending}>
                {pending && <LoaderCircle className="animate-spin" />}
                {pending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </div>
      </section>
    </main>
  );
}