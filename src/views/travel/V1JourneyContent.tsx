import { Table } from "~/components/Table.js";
import { LinkCard } from "~/components/LinkCard.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";

type V1JourneyContentProps = {
  locale: SupportedLanguage;
};

const anchorClass =
  "text-(--gbb-color) underline transition-colors duration-150 hover:text-white";

const POLAND_INFO_DATA = [
  ["項目", "情報"],
  ["首都", "ワルシャワ"],
  ["通貨単位", "ズウォティ (PLN)"],
  ["時差", "日本より8時間遅れ（サマータイム時は7時間）"],
  ["気候", "ワルシャワの9月は日本の10〜11月に相当"],
  ["言語", "ポーランド語（英語は観光地で通じる）"],
  ["緊急連絡先", "警察・消防・救急：112"],
  [
    "大使館",
    <a key="emb" href="https://www.pl.emb-japan.go.jp/itprtop_ja/index.html" target="_blank" rel="noopener noreferrer" className={anchorClass}>在ポーランド日本大使館</a>,
  ],
  ["電圧/プラグ", "220V・Cタイププラグ（日本のプラグは使えません）"],
];

const APPS_DATA = [
  ["アプリ名", "概要・特徴"],
  [
    <a key="jakdojade" href="https://jakdojade.pl/" target="_blank" rel="noopener noreferrer" className={anchorClass}>jakdojade</a>,
    "ワルシャワの公共交通機関（バス・トラム・地下鉄）のルート検索・時刻表確認・チケット購入ができるアプリ。英語対応。現地移動の必需品。",
  ],
  [
    <a key="veturilo" href="https://veturilo.waw.pl/en/" target="_blank" rel="noopener noreferrer" className={anchorClass}>Veturilo</a>,
    "ワルシャワ市内の自転車シェアリングサービス。アプリや専用端末で自転車を借りて、市内各地のステーションで返却できる。観光やちょっとした移動に便利。",
  ],
  [
    <a key="tabireg" href="https://www.ezairyu.mofa.go.jp/" target="_blank" rel="noopener noreferrer" className={anchorClass}>たびレジ</a>,
    "外務省が提供する海外安全情報サービス。LINEで最新の安全情報や緊急時の連絡が受け取れる。渡航前に登録推奨。",
  ],
  [
    <a key="tgtg" href="https://www.toogoodtogo.com/" target="_blank" rel="noopener noreferrer" className={anchorClass}>Too Good To Go</a>,
    "飲食店やスーパーの余った食品を安く購入できる食品ロス削減アプリ。現地の食文化体験にもおすすめ。",
  ],
  ["Google Maps", "オフラインマップ機能を使えば、ネットがなくても地図や経路検索が可能。現地のレストランや観光地探しにも便利。"],
  [
    <a key="navitime" href="https://transit.navitime.com/ja/" target="_blank" rel="noopener noreferrer" className={anchorClass}>NAVITIME transit</a>,
    "海外の公共交通機関の乗換案内アプリ。日本語対応で、初めての海外でも安心して使える。",
  ],
  ["Google翻訳", "オフライン翻訳やカメラ翻訳機能があり、ポーランド語の看板やメニューもその場で翻訳できる。"],
  ["ChatGPT/Gemini", "画像翻訳や現地でのちょっとした相談、英語・ポーランド語でのやりとりのサポートなど、幅広く活用できるAIアプリ。"],
];

const MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2444.1545784050995!2d21.03964487692846!3d52.22240935821945!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecd02df99729d%3A0x120bb57e07d1fd45!2sArena%20COS%20Torwar!5e0!3m2!1sen!2sjp!4v1760853556821!5m2!1sen!2sjp";

export const V1JourneyContent = ({ locale }: V1JourneyContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8">
          ワルシャワでの旅程や、おすすめの持ち物などを、GBB 2021 の実例を参考にまとめています。
        </p>

        <h2 className="text-xl font-bold mb-4">目次</h2>
        <ol className="list-decimal pl-8 space-y-2 mb-8">
          <li><a href="#poland-basic-info-section" className={anchorClass}>ポーランド基本情報</a></li>
          <li><a href="#useful-apps-section" className={anchorClass}>お役立ちアプリ</a></li>
          <li><a href="#sim-communication-section" className={anchorClass}>SIMカード・通信環境</a></li>
          <li><a href="#currency-exchange-section" className={anchorClass}>通貨・両替について</a></li>
          <li><a href="#luggage-preparation-section" className={anchorClass}>荷物の準備</a></li>
          <li><a href="#passport-validity-section" className={anchorClass}>パスポートの有効期限</a></li>
          <li><a href="#venue-info-section" className={anchorClass}>GBB 会場内について</a></li>
        </ol>

        <h2 id="poland-basic-info-section" className="text-xl font-bold mb-4 mt-8">1. ポーランド基本情報</h2>
        <Table data={POLAND_INFO_DATA} />

        <h2 id="useful-apps-section" className="text-xl font-bold mb-4 mt-8">2. お役立ちアプリ</h2>
        <p className="mb-4">GBB 2021現地観戦にあたり、役に立ったアプリ一覧です。</p>
        <Table data={APPS_DATA} />

        <h2 id="sim-communication-section" className="text-xl font-bold mb-4 mt-8">3. SIMカード・通信環境</h2>
        <p className="mb-4">
          ポーランドでインターネットを利用するには、<strong>eSIM</strong>、<strong>プリペイドSIMカード</strong>、<strong>ポケットWiFi</strong>のいずれかを利用する方法があります。
        </p>
        <ul className="list-disc pl-8 space-y-4 mb-4">
          <li>
            <strong>eSIM</strong>
            <ul className="list-disc pl-8 space-y-1 mt-1">
              <li>対応機種なら日本でオンライン購入・設定が可能</li>
              <li>現地到着後すぐに通信が使える</li>
              <li>物理SIMの差し替え不要で手軽</li>
              <li>料金やプランも豊富</li>
            </ul>
          </li>
          <li>
            <strong>プリペイドSIMカード</strong>
            <ul className="list-disc pl-8 space-y-1 mt-1">
              <li>ワルシャワ空港や市内の携帯ショップ、コンビニ等で購入可能</li>
              <li>購入時にパスポート提示が必要な場合あり</li>
              <li>SIMロック解除済みスマートフォンが必要</li>
              <li>現地での調達や設定が必要</li>
            </ul>
          </li>
          <li>
            <strong>ポケットWiFi</strong>
            <ul className="list-disc pl-8 space-y-1 mt-1">
              <li>日本で事前にレンタルして持参するのが一般的</li>
              <li>料金が高額（1日あたり数千円になることも）</li>
              <li>複数人で同時利用したい場合やSIMロック解除できない端末向け</li>
              <li>バッテリー管理や返却手続きが必要</li>
            </ul>
          </li>
        </ul>
        <p className="mb-8">
          それぞれ、データ通信量・有効期間・料金・手軽さなどに違いがあるため、お好みでご選択ください。
        </p>

        <h2 id="currency-exchange-section" className="text-xl font-bold mb-4 mt-8">4. 通貨・両替について</h2>
        <p className="mb-4">
          ポーランドで現地通貨（ズウォティ）に両替する場合、空港や銀行、ホテル、街中の両替所（Kantor）、デパートやショッピングモール内の両替所など、さまざまな場所で両替が可能です。両替所ごとにレートや手数料が異なるため、複数の場所を比較してから両替するのがおすすめです。
        </p>
        <p className="mb-8">
          また、ポーランドではクレジットカードが広く利用でき、ほとんどの店舗やレストラン、ホテルで支払いに使えます。現地のATMでクレジットカードを使って現金を引き出すこと（キャッシング）も可能です。必要に応じて、現金とカードを使い分けると安心です。
        </p>

        <h2 id="luggage-preparation-section" className="text-xl font-bold mb-4 mt-8">5. 荷物の準備</h2>
        <h3 className="text-lg font-bold mb-2 mt-4">服装・持ち物のリスト</h3>
        <p className="mb-4">以下のサイトをぜひ参考にしてください。</p>
        <div className="flex flex-wrap gap-4 mb-4">
          <LinkCard
            text="持ち物チェックリスト | 地球の歩き方"
            href="https://www.arukikata.co.jp/travelgoods/"
            fullWidth
          />
        </div>

        <h3 className="text-lg font-bold mb-2 mt-4">機内持ち込み・預け荷物の制限</h3>
        <p className="mb-4">
          航空会社ごとに機内持ち込み手荷物や預け荷物のサイズ・重量制限、個数制限が細かく定められています。<br />
          超過した場合は追加料金が発生することが多いので、必ずご利用の航空会社の公式サイトで最新の規定をご確認ください。<br />
          特に昨今事故が多発しているリチウムイオン電池については、厳しい規制を設ける航空会社が出てきていますので、ご注意ください。
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          <LinkCard text="カタール航空 公式サイト" href="https://www.qatarairways.com" />
          <LinkCard text="LOTポーランド航空 公式サイト" href="https://www.lot.com" />
          <LinkCard text="エミレーツ航空 公式サイト" href="https://www.emirates.com" />
          <LinkCard text="フィンエアー 公式サイト" href="https://www.finnair.com" />
          <LinkCard text="ターキッシュ エアラインズ 公式サイト" href="https://www.turkishairlines.com" />
          <LinkCard text="オーストリア航空 公式サイト" href="https://www.austrian.com" />
          <LinkCard text="KLMオランダ航空 公式サイト" href="https://www.klm.com" />
        </div>

        <p className="mb-4">
          国際線の手荷物検査では、<strong>液体の持ち込みが非常に厳しく制限されています</strong>。<br />
          一般的に、100ml（グラム）を超える液体・ジェル・スプレー類は<strong>手荷物に入れて機内に持ち込むことはできません</strong>。<br />
          さらに、100ml以下の容器に入っている液体でも、<strong>1リットル以下の再封可能な透明プラスチック袋（ジップロック等）1人1袋まで</strong>という制限があります。
        </p>
        <ul className="list-disc pl-8 space-y-2 mb-4">
          <li>化粧水や乳液、歯磨き粉、飲み物、ペットボトル飲料、ジェル状のお菓子やヨーグルト、液体の医薬品・サプリ、コンタクトレンズ洗浄液などもすべて対象です。</li>
          <li>飲み物やペットボトルは、<strong>保安検査前</strong>に飲み切るか破棄する必要があります（保安検査後のエリアで購入した飲料は機内持ち込み可能）。</li>
          <li>預け入れ荷物（スーツケース等）には液体の容量制限はありません。</li>
        </ul>

        <div className="border-l-4 border-(--gbb-color) bg-(--section-color) p-4 my-8">
          <p className="font-bold mb-2">意外と忘れがちな液体物</p>
          <ul className="list-disc pl-8 space-y-1">
            <li>ペットボトルの飲み物</li>
            <li>ゼリー状のお菓子（お土産に注意）</li>
            <li>歯磨き粉</li>
          </ul>
        </div>

        <h2 id="passport-validity-section" className="text-xl font-bold mb-4 mt-8">6. パスポートの有効期限</h2>
        <p className="mb-4">
          <strong>パスポートの有効期限は、渡航地からの帰国日を基準に3〜6カ月以上</strong>（国によって異なります）必要です。ポーランドの場合は3カ月以上必要です。
        </p>
        <p className="mb-4">
          有効期限が不足している場合、航空会社から搭乗を拒否される可能性があります。
        </p>
        <p className="mb-8">
          東京都生活文化局は、パスポートの申請は使用の1か月前を目安に、時間に余裕を持った申請と受け取りをするよう呼びかけています。
        </p>

        <h2 id="venue-info-section" className="text-xl font-bold mb-4 mt-8">7. GBB 会場内について</h2>
        <p className="mb-4">
          GBB 2021の売店の品揃えはめちゃくちゃしょぼかったです。飲み物とスナック程度で、食事といえるものはほとんどありません。<br />
          また、GBB 2021 会場内での飲食物の持ち込みは禁止でした。厳しい手荷物検査が行われ、飲み物もその場で没収でした。
        </p>
        <p className="mb-4">
          タイムテーブルを確認すると、GBB 2021は午前4時ごろまで行われていました。また、GBB 2019も午前4時ごろにGENE SHINOZAKI SHOWCASEが行われています。
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <LinkCard
            text="GBB 2021 タイムテーブル"
            href={`/${locale}/2021/timetable`}
            fullWidth
          />
        </div>

        <p className="mb-4">
          GBB 2026会場である "COS Torwar" は、近くにバス停が多くアクセスは良いように見えますが、飲食店やコンビニがあまり見当たらないため、町の中心部からは離れているようです。
        </p>
        <div className="my-8 flex justify-center">
          <iframe
            src={MAPS_EMBED_SRC}
            width="400"
            height="320"
            style={{ border: 0, maxWidth: "100%" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="COS Torwar"
          />
        </div>

        <div className="border-l-4 border-(--gbb-color) bg-(--section-color) p-4 my-8">
          <p className="font-bold mb-2">撮影制限について</p>
          <p>
            ポーランドでは、鉄道、橋、政府関連の建物などでの撮影が法律で禁止されています。<br />
            これは、ウクライナでの情勢悪化に伴う安全保障の観点から制定された、スパイ活動を念頭に置いた法律です。<strong>ポーランドは、ウクライナ・ロシアと国境を接しています。</strong><br />
            違反した場合、拘束・法的措置を受ける可能性がありますので、ご注意ください。
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-16 mb-4">
          <LinkCard
            text={
              <span>
                BACK<br />1. 予約編
              </span>
            }
            href={`/${locale}/travel/v1_reservation`}
          />
          <LinkCard
            text={
              <span>
                NEXT<br />3. 飛行機編
              </span>
            }
            href={`/${locale}/travel/v1_flight`}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                ワルシャワへ行こう<br />トップページへ戻る
              </span>
            }
            href={`/${locale}/travel/top`}
            fullWidth
          />
        </div>
      </div>
    </main>
  );
};
