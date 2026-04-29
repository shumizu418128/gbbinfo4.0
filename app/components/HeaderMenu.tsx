export const HeaderMenu = () => {
  return (
    <>
      <div className="bg-[#1d0302] flex items-center justify-center p-4 space-x-4">
        <a href="" className="text-white font-bold text-lg">Home</a>
        <a href="" className="text-white font-bold text-lg">年度選択</a> {/* TODO: ドロップダウンで、今の年度を出す + 下矢印をつける */}
        <a href="" className="text-white font-bold text-lg">言語選択</a> {/* TODO: ドロップダウンで、今の言語を出す + 下矢印をつける */}
      </div>
    </>
  )
}
