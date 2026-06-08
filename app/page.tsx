import { redirect } from "next/navigation";
import { clearSession } from "@/lib/auth";

export default async function HomePage() {
  await clearSession();
  redirect("/login");
}
