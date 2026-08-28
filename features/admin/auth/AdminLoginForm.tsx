"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowLeft, Eye, EyeOff, LoaderCircle } from "lucide-react";

import { Button } from "@/features/admin/components/ui/button";
import { Input } from "@/features/admin/components/ui/input";
import { loginAdmin, type AdminLoginState } from "@/features/admin/auth/actions";
import { MOCK_ADMIN_ACCOUNT } from "@/features/admin/lib/auth-config";

const initialState: AdminLoginState = { error: null };

export function AdminLoginForm({ location = "" }: { location?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(loginAdmin, initialState);

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

            <form action={formAction} className="space-y-5">
              <input type="hidden" name="location" value={location} />

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

              {state.error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-sm font-medium text-destructive"
                >
                  {state.error}
                </p>
              )}

              <Button type="submit" className="h-11 w-full" disabled={pending}>
                {pending && <LoaderCircle className="animate-spin" />}
                {pending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-6 rounded-xl border bg-muted/35 p-4 text-sm">
              <p className="font-semibold">Tài khoản demo hiện tại</p>
              <div className="mt-2 grid gap-1 text-muted-foreground">
                <p>
                  Email: <span className="font-medium text-foreground">{MOCK_ADMIN_ACCOUNT.email}</span>
                </p>
                <p>
                  Mật khẩu: <span className="font-medium text-foreground">{MOCK_ADMIN_ACCOUNT.password}</span>
                </p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Đây là tài khoản giả lập cho giai đoạn chưa kết nối backend.
              </p>
            </div>
          </div>
      </section>
    </main>
  );
}