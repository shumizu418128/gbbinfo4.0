import { redirect } from "react-router";
import { getLocale } from "../../paraglide/runtime";

export function loader() {
  const locale = getLocale();
  return redirect(`/${locale}/2026/top`);
}

export default function Index() {
  return null;
}
