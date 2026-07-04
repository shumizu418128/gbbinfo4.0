import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import { SocialEmbed } from "~/components/SocialEmbed.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";

type SevenToSmokeContentProps = {
  locale: SupportedLanguage;
  year: number;
};

const paragraphClass = "mb-4 leading-relaxed";
const sectionClass = "mb-8 text-2xl font-bold";
const tocClass = "mb-8 list-decimal pl-8 space-y-2";

export const SevenToSmokeContent = ({ locale, year }: SevenToSmokeContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className={paragraphClass}>
          GBB2023や、日本国内のBeatboxイベントでしばしば目にする「7toSmoke」
          <br />
          今回は、7toSmokeのルールについて解説します。
        </p>
        <PostIt>
          <p>
            2024/4/7追記
            <br />
            今後、このページの更新は行いません。
            <br />
            古い情報が含まれる可能性があるため、必ず最新情報をご確認ください。
          </p>
        </PostIt>

        <h2 className={sectionClass}>目次</h2>
        <ol className={tocClass}>
          <li><a href="#p01" className={anchorClass}>注意事項</a></li>
          <li><a href="#p02" className={anchorClass}>7toSmokeとは</a></li>
          <li><a href="#p03" className={anchorClass}>事前予選ルール</a></li>
          <li><a href="#p04" className={anchorClass}>当日予選ルール</a></li>
          <li><a href="#p05" className={anchorClass}>本戦ルール</a></li>
          <li><a href="#p06" className={anchorClass}>7toSmoke最新情報</a></li>
        </ol>

        <h2 id="p01" className={sectionClass}>注意事項</h2>
        <p className={paragraphClass}>
          以下に示す内容は、ネット上の情報（個人のブログ等非公式の情報）、管理人がGBB21を現地観戦した経験などを基に紹介するものです。
          <br />
          イベントによって、7toSmokeという名前のものであっても多少違いがある場合があります。
        </p>
        <p className={paragraphClass}>
          以下では、GBB21を例としてルールを紹介します。
          <br />
          GBB21では、本戦に参加するためには2回予選を勝ち抜く必要があります。
          <br />
          ここでは2回の予選をそれぞれ、事前予選、当日予選と呼ぶことにします。
        </p>

        <h2 id="p02" className={sectionClass}>7toSmokeとは</h2>
        <p className={paragraphClass}>
          7toSmokeという形式は、もともとブレイクダンスシーンにおいて有名な形式であり、ダンサー経験があるドイツのBeatboxer・Madoxによって、シーンに導入されました。
        </p>
        <p className={paragraphClass}>
          Beatboxシーンにおいては、基本的にイベントの後夜祭（英語でafterparty）としてよく開催されます。
        </p>
        <p className={paragraphClass}>
          ルール上、優勝するために7回勝利しなければならないこと、またsmokeという英単語に「相手を倒す」という意味があり、7回倒すという意味でこの名前になったそうです。
        </p>

        <h2 id="p03" className={sectionClass}>事前予選ルール</h2>
        <p className={paragraphClass}>
          GBB21本戦の開催日に、7toSmoke 事前予選が開催されました。
          <br />
          ショーケース形式で、制限時間は30秒。
          <br />
          GBB21のチケットを持っていれば、会場に行って参加したいと言うだけで、だれでも参加できます。
          <br />
          （年齢制限：18歳以上）
        </p>
        <p className={paragraphClass}>
          GBB21 7toSmoke 事前予選には、日本人として唯一sakuraさんが参加しました。
        </p>
        <p className="mb-4">
          <a
            href="https://twitter.com/BEATBOX10982364/status/1451919394532122626"
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            sakuraさんのツイート
          </a>
        </p>

        <SocialEmbed type="twitter">
          <blockquote className="twitter-tweet">
            <p lang="ja" dir="ltr">
              7 to smokeの予選でました！
              <br />
              後ろにBalance🇫🇷がいて動画撮ってもらいました笑笑
              <br />
              ある意味この動画貴重すぎる笑{" "}
              <a href="https://t.co/C56kwM7TWM">pic.twitter.com/C56kwM7TWM</a>
            </p>
            — 桜(Sakura)🌸 beatboxer (@BEATBOX10982364){" "}
            <a href="https://twitter.com/BEATBOX10982364/status/1451919394532122626?ref_src=twsrc%5Etfw">
              October 23, 2021
            </a>
          </blockquote>
        </SocialEmbed>

        <p className={paragraphClass}>
          実はこれ、GBB21会場入り口ドアのすぐ近くで開催されていたため、ただ待機列に並んでいるだけの人々がどよめきをあげるくらい、とんでもないレベルのBeatboxを聴けるという恐ろしい環境でした。
        </p>
        <p className={paragraphClass}>その後、GBB公式Instagramにて、事前予選通過者が発表されました。</p>

        <SocialEmbed type="instagram">
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink="https://www.instagram.com/p/CVb__8ujaB2/?utm_source=ig_embed&utm_campaign=loading"
            data-instgrm-version="14"
            style={{
              background: "#FFF",
              border: 0,
              borderRadius: 3,
              boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
              margin: "1px",
              maxWidth: 540,
              minWidth: 326,
              padding: 0,
              width: "99.375%",
            }}
          >
            <div style={{ padding: 16 }}>
              <a
                href="https://www.instagram.com/p/CVb__8ujaB2/?utm_source=ig_embed&utm_campaign=loading"
                target="_blank"
                rel="noopener noreferrer"
              >
                View this post on Instagram
              </a>
            </div>
          </blockquote>
        </SocialEmbed>

        <h2 id="p04" className={sectionClass}>当日予選ルール</h2>
        <p className={paragraphClass}>
          事前予選を勝ち上がった人、そしてGBB21出場者・ジャッジが参加する当日予選がGBB21 7toSmoke会場で行われました。
          <br />
          制限時間1分のショーケース形式です。
        </p>
        <p className={paragraphClass}>
          3日間GBB21に参加した疲れもあるせいか、GBB21出場者・ジャッジは出場権こそあるものの、ほとんどの方は来ません。
          <br />
          MCをやるはずのScott Jacksonすら来なかったとか。管理人も行きましたが本当に眠かった。
          <br />
          実際、参加した日本人Beatboxerは、KAJIさんだけでした。
        </p>
        <p className="mb-4">
          撮影：
          <a
            href="https://twitter.com/Mayco091"
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            種田芽衣子さん
          </a>
        </p>

        <SocialEmbed type="twitter">
          <blockquote className="twitter-tweet">
            <p lang="ja" dir="ltr">
              <a href="https://twitter.com/hashtag/GBB2021?src=hash&ref_src=twsrc%5Etfw">#GBB2021</a>{" "}
              7 To Smoke 予選動画です!!{" "}
              <a href="https://t.co/u97uIQk1Rx">pic.twitter.com/u97uIQk1Rx</a>
            </p>
            — KAJI / Chiwon (@k4j1__){" "}
            <a href="https://twitter.com/k4j1__/status/1453013054292205580?ref_src=twsrc%5Etfw">
              October 26, 2021
            </a>
          </blockquote>
        </SocialEmbed>

        <p className={paragraphClass}>
          当日予選通過者8名は、イベントMCを務めていたBBKにより、舞台上で口頭にて発表されました。
        </p>

        <h2 id="p05" className={sectionClass}>本戦ルール</h2>
        <p className={paragraphClass}>
          まず、当日予選1位 vs 2位のバトルが1分1ラウンドで行われます。
          <br />
          その後、このバトルの勝者 vs 3位
          <br />
          そのまた勝者 vs 4位...
          <br />
          というように、1位から8位が順番にバトルに参加します。つまり、負けるまでバトルをし続ける勝ち抜き戦です。これを何周も行います。
        </p>
        <p className={paragraphClass}>
          先に7回勝利したBeatboxerが優勝、次のGBBソロ部門への出場権を獲得します。
          <br />
          GBB21 7toSmoke優勝者はking inertiaでした。
        </p>
        <p className={paragraphClass}>
          ただこのバトルは、勝者が決まるまで理論上最大43回バトルを行わなければならず、イベントが長期化するため、28回バトルを行っても勝者が決まらない場合、上位2名が最終決戦を行います。（同率1位が3名いたり、同率2位が2名いるなど特殊な状況の場合は、状況に応じて対戦カードが組まれます）
          <br />
          この場合のみ、1分2ラウンド制になります。
        </p>

        <h2 id="p06" className={sectionClass}>7toSmoke最新情報</h2>
        <p className={paragraphClass}>
          当サイト内の
          <a href={`/${locale}/${year}/top_7tosmoke`} className={anchorClass}>
            「7toSmoke」
          </a>
          をご確認ください。
        </p>
        <div className="mb-8 flex flex-wrap gap-4">
          <LinkCard text="7toSmoke"
            href={`/${locale}/${year}/top_7tosmoke`}
            fullWidth
          />
        </div>
        <p className={paragraphClass}>
          なお、GBB2023以降、7toSmokeに関する最新情報がほとんど公開されなくなりました。
          <br />
          理由は不明です。
        </p>
      </div>
    </main>
  );
};
