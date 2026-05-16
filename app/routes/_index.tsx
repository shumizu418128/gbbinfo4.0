import { redirect } from "react-router";
import { getLocale } from "../../paraglide/runtime";

export function loader() {
  const locale = getLocale();
  const nowTime = new Date();
  const year = nowTime.getFullYear();
  return redirect(`/${locale}/${year}/top`);
}

// ルートパスでは常に現在の年度のトップページにリダイレクトする
export default function Index() {
  return null;
}
