"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";

import { Input } from "@/features/admin/components/ui/input";
import { loginAdmin } from "@/features/admin/auth/service";

export function AdminLoginForm({ location = "" }: { location?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    try {
      await loginAdmin({
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
      });
      const next = location.startsWith("/") && !location.startsWith("//")
        ? location
        : "/admin/dashboard";
      window.location.assign(next);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Đăng nhập thất bại.");
    } finally {
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

            <form method="post" onSubmit={handleSubmit} className="space-y-5">

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

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 disabled:pointer-events-none disabled:opacity-50"
                disabled={pending}
              >
                {pending && <LoaderCircle className="animate-spin" />}
                {pending ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

          </div>
      </section>
    </main>
  );
}
