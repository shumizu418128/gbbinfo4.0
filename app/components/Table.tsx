import type { ReactNode } from "react";

type TableProps = {
  data: (string | number | ReactNode)[][];
  textCenter?: boolean;
};

export const Table: React.FC<TableProps> = ({ data, textCenter = false }) => {
  if (!data || data.length === 0) return null;

  return (
    <table className="mx-auto w-[95%] border-collapse">
      <thead>
        <tr className="border-b border-white/20 bg-(--section-color)">
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
            <tr
              key={i + 1}
              className={((i + 1) % 2 === 0) ? "bg-(--section-color)" : undefined}
            >
              {row.map((cell, j) => (
                <td key={j} style={{ padding: 8 }} className={textCenter ? "text-center" : undefined}>
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
