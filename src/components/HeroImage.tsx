import type { YearWithCountry } from "../db/year";
import { Flag } from "./Flag";
import { staticAssetUrl } from "~/util/staticAsset.js";

type HeroImageProps = {
  yearWithCountry: YearWithCountry;
  subtitle?: string;
}

export const HeroImage = ({ yearWithCountry, subtitle = "WE LOVE BEATBOX" }: HeroImageProps) => {
  const { year, city, startsAt, endsAt, country } = yearWithCountry;
  const startDate = startsAt ? new Date(startsAt).toLocaleDateString() : "";
  const endDate = endsAt ? new Date(new Date(endsAt).setDate(new Date(endsAt).getDate())).toLocaleDateString() : "";

  return (
    <>
      <div className="relative w-full h-screen">

        <img
          src={staticAssetUrl("/images/background.webp")}
          alt="Grand Beatbox Battle"
          width={1920}
          height={1080}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(5,5,5,0.2) 0%, rgba(5,5,5,0.6) 40%, rgba(5,5,5,0.7) 80%, rgba(5,5,5,1) 100%)'
          }}
        />

        <div className="relative flex flex-col items-center justify-center h-full w-full gap-6 translate-y-8">
          <h1
            className="text-white z-10 w-full text-center"
            style={{ fontSize: "clamp(32px, 16vw, 96px)" }}
          >
            GBB {year}
          </h1>
          {startDate && endDate && (
            <div className="z-10 w-full text-center">
              <span className="text-white font-bold" style={{ fontSize: "clamp(16px, 3vw, 32px)" }}>
                {startDate} - {endDate}
              </span>
            </div>
          )}
          <div className="z-10 w-full text-center flex items-center justify-center gap-2">
            <Flag isoAlpha2={country.isoAlpha2} height={24} paddingBottom={0}/>
            <span
              className="text-white font-bold"
              style={{ fontSize: "clamp(16px, 3vw, 32px)" }}
            >
              {city}
            </span>
          </div>
          <div className="mt-16 z-10 w-full text-center">
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
