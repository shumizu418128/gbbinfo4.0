import type { CSSProperties, ReactNode } from "react";

type TableProps = {
  data: (string | number | ReactNode)[][];
  textCenter?: boolean;
  /** 列幅の比率（例: [5, 1, 4] → 50% : 10% : 40%）。 */
  columnWidths?: number[];
  /** 列幅の固定値（例: ['32px']）。指定列は columnWidths より優先される。 */
  columnFixedWidths?: string[];
  className?: string;
};

/**
 * 列幅比率からパーセンテージ文字列を返す。
 *
 * Args:
 *   weights: 列幅の比率配列。
 *   index: 対象列のインデックス。
 *
 * Returns:
 *   幅のパーセンテージ文字列。未定義の列は undefined。
 */
const toColumnWidthPercent = (
  weights: number[],
  index: number,
): string | undefined => {
  if (index >= weights.length) return undefined;
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  return `${(weights[index] / total) * 100}%`;
};

/**
 * 列幅比率に基づく style を返す。
 *
 * Args:
 *   columnWidths: 列幅の比率配列。
 *   index: 対象列のインデックス。
 *
 * Returns:
 *   width を含む style オブジェクト。比率未定義時は padding のみ。
 */
const getCellStyle = (
  columnWidths: number[] | undefined,
  columnFixedWidths: string[] | undefined,
  index: number,
): CSSProperties => {
  const fixedWidth = columnFixedWidths?.[index];
  if (fixedWidth) {
    return {
      boxSizing: "border-box",
      padding: 8,
      width: fixedWidth,
      minWidth: fixedWidth,
      maxWidth: fixedWidth,
    };
  }

  const width = columnWidths
    ? toColumnWidthPercent(columnWidths, index)
    : undefined;
  return width ? { padding: 8, width } : { padding: 8 };
};

export const Table = ({
  data,
  textCenter = false,
  columnWidths,
  columnFixedWidths,
  className,
}: TableProps) => {
  if (!data || data.length === 0) return null;

  return (
    <table
      className={className ?? "mx-auto my-4 w-[95%] border-collapse"}
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      <thead>
        <tr className="border-b border-(--table-border-color) bg-(--section-color)">
          {data[0].map((cell, j) => (
            <th
              key={j}
              style={{
                ...getCellStyle(columnWidths, columnFixedWidths, j),
                fontWeight: "bold",
              }}
            >
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
              className={(i + 1) % 2 === 0 ? "bg-(--section-color)" : undefined}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={getCellStyle(columnWidths, columnFixedWidths, j)}
                  className={textCenter ? "text-center" : undefined}
                >
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
