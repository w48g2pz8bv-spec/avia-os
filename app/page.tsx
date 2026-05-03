import { redirect } from "next/navigation";

/**
 * Melih, ana sayfayı landing gibi kullanmak yerine 
 * doğrudan Dashboard'a yönlendiriyoruz. 
 * Bu, landing page scroll hatalarını kökten çözer.
 */
export default function Home() {
  redirect("/dashboard");
}
