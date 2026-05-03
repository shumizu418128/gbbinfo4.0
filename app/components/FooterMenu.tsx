import { GbbCountdown } from "./GbbCountdown.js";

export const FooterMenu = () => {
  return (
    <>
      <div className="bg-(--background-color) h-100" />

      <div className="flex justify-center bg-(--background-color) pb-36">
        <GbbCountdown />
      </div>

      <footer className="bg-black text-center pt-16">
        <p className="text-white">
          GBB.info<br />
          Unofficial website developed by <a href="https://twitter.com/tari_3210_" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gbb-color)", textDecoration: "underline" }}>tari3210</a><br />
          NOT affiliated with swissbeatbox
        </p>

        <div className="h-100" />

        <div className="flex flex-col items-center justify-center">
          <a href="#" className="flex flex-col items-center pb-36">
            <img src="/images/background.webp" className="w-[90%] max-w-5xl mx-auto pb-16" />
            <p className="text-center text-(--gbb-color) font-bold">いい景色だろ？</p>
          </a>
        </div>

      </footer>
    </>
  )
}
