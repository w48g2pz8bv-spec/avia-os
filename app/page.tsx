"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Döngüyü kırmak için replace kullanıyoruz
    router.replace("/login");
  }, [router]);

  return null;
}
