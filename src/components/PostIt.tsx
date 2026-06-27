import type { ReactNode } from "react";

type PostItProps = {
  children: ReactNode;
};

const postItClass =
  "my-4 border-l-4 border-(--gbb-color) bg-(--post-it-color) p-4";

export const PostIt = ({ children }: PostItProps) => (
  <div className={postItClass}>{children}</div>
);
