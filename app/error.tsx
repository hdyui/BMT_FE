"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <main className="grid min-h-[60vh] place-content-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-bold">Chưa thể tải nội dung</h1>
      <p>Vui lòng thử lại sau ít phút.</p>
      <button
        className="rounded bg-brand px-5 py-3 text-white disabled:opacity-50"
        disabled={pending}
        onClick={() => startTransition(() => { router.refresh(); reset(); })}
      >Thử lại</button>
    </main>
  );
}
