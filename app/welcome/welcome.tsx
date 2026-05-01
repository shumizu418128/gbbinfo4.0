export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4" style={{ backgroundColor: "#050505" }}>
      <div className="flex flex-col space-y-8 w-full max-w-2xl">
        <div className="bg-white/4 p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">エントリー状況</h2>
          <hr className="border-white/10 mb-4" />
          <p>現在のエントリー状況や締め切りなどを表示予定</p>
        </div>
        <div className="bg-white/4 p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Wildcard結果速報</h2>
          <hr className="border-white/10 mb-4" />
          <p>最新のワイルドカード結果・出場者リストなどをここに表示予定</p>
        </div>
        <div className="bg-white/4 p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-2">お知らせ</h2>
          <hr className="border-white/10 mb-4" />
          <p>イベント情報や大会ルール等のお知らせをここに掲載予定</p>
        </div>
      </div>
    </main>
  );
}
