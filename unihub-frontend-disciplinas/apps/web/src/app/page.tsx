import { redirect } from "next/navigation";

// A raiz só encaminha; o grupo (app) decide se manda para /login.
export default function Index() {
  redirect("/home");
}
