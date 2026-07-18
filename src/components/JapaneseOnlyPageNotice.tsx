import { PostIt } from "~/components/PostIt.js";
import { baseLocale } from "~/constants/languageLabels.js";
import { getLocale } from "@paraglide/runtime.js";
import * as m from "../../paraglide/messages.js";

export const JapaneseOnlyPageNotice = () => {
  if (getLocale() === baseLocale) {
    return null;
  }

  return (
    <PostIt>
      <p>{m.japanese_only_page_notice()}</p>
    </PostIt>
  );
};
