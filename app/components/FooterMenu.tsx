import { GbbCountdown } from "./GbbCountdown.js";

export const FooterMenu = () => {
  return (
    <>
      <div className="bg-(--background-color) h-100" />

      <div className="flex justify-center bg-(--background-color) pb-36">
        <GbbCountdown />
      </div>

      <footer className="bg-black text-center text-white pt-16">
        <p>
          GBB.info<br />
          Unofficial website developed by <span style={{ color: "var(--gbb-color)" }}>tari3210</span><br />
          NOT affiliated with swissbeatbox
        </p>


        <div className="h-100" />

        <div className="flex flex-col items-center justify-center">
          <a href="#" className="flex flex-col items-center pb-16">
            <img src="/images/background.webp" className="w-[90%] max-w-5xl mx-auto pb-16" />
            <p className="text-center">いい景色だろ？</p>
          </a>
        </div>

      </footer>
    </>
  )
}
