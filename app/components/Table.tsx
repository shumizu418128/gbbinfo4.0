import type { ReactNode } from "react";

type TableProps = {
  data: (string | number | ReactNode)[][];
};

export const Table: React.FC<TableProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <table className="mx-auto w-[95%] border-collapse">
      <thead>
        <tr className="border-b border-white/20">
          {data[0].map((cell, j) => (
            <th key={j} style={{ padding: 8, fontWeight: "bold" }}>
              {cell}
            </th>
          ))}
        </tr>
      </thead>
      {data.length > 1 && (
        <tbody>
          {data.slice(1).map((row, i) => (
            <tr key={i + 1}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: 8 }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      )}
    </table>
  );
};
