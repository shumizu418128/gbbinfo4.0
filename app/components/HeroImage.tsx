export const HeroImage = ({ title, subtitle }: { title: string, subtitle: string }) => {
  return (
    <>
      <div className="relative w-full h-screen">

        <img
          src="/images/background.webp"
          alt="Grand Beatbox Battle"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.6) 40%, rgba(5,5,5,0.7) 80%, rgba(5,5,5,1) 100%)'
          }}
        />

        <div className="relative flex flex-col items-center justify-center h-full w-full">
          <h1
            className="text-white z-10 w-full text-center"
            style={{ fontSize: "clamp(32px, 16vw, 96px)" }}
          >
            {title}
          </h1>
          <div className="mt-6 z-10 w-80% text-center">
            <span
              className="text-white font-bold"
              style={{ fontSize: "clamp(24px, 4vw, 48px)" }}
            >
              {subtitle}
            </span>
          </div>
        </div>

      </div>
    </>
  )
}
