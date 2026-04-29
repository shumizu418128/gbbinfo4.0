export const HeaderMenu = () => {
  return (
    <>
      <div className="bg-black flex items-center justify-center p-4 space-x-4 h-16">
        <a href="" className="text-white font-bold text-2xl">Home</a>
        <a href="" className="text-white font-bold text-2xl">年度選択</a> {/* TODO: ドロップダウンで、今の年度を出す + 下矢印をつける */}
        <a href="" className="text-white font-bold text-2xl">言語選択</a> {/* TODO: ドロップダウンで、今の言語を出す + 下矢印をつける */}
      </div>
    </>
  )
}
