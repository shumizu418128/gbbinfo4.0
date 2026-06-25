import { Table } from "~/components/Table.js";
import { LinkCard } from "~/components/LinkCard.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";

type V1FlightContentProps = {
  locale: SupportedLanguage;
};

const anchorClass =
  "text-(--gbb-color) underline transition-colors duration-150 hover:text-white";

const DEADLINE_TABLE_DATA = [
  ["手続き", "推奨時間"],
  ["チェックイン・手荷物預け", "出発2〜3時間前"],
  ["保安検査場への移動", "出発2時間前"],
  ["搭乗口への移動", "出発1時間〜45分前"],
];

export const V1FlightContent = ({ locale }: V1FlightContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8">
          カタール航空を例に、日本からワルシャワまでの航空機での移動について、GBB 2021の実体験を交えて解説します。
        </p>

        <h2 className="text-xl font-bold mb-4">目次</h2>
        <ol className="list-decimal pl-8 space-y-2 mb-8">
          <li><a href="#check-in-section" className={anchorClass}>チェックイン</a></li>
          <li><a href="#security-check-section" className={anchorClass}>手荷物検査</a></li>
          <li><a href="#deadline-times-section" className={anchorClass}>各種手続き締切時刻</a></li>
          <li><a href="#in-flight-services-section" className={anchorClass}>機内サービス</a></li>
          <li><a href="#connecting-flight-section" className={anchorClass}>乗り継ぎ</a></li>
          <li><a href="#arrival-immigration-section" className={anchorClass}>到着・入国手続き</a></li>
          <li><a href="#airport-to-city-section" className={anchorClass}>空港からワルシャワ市内への移動</a></li>
        </ol>

        <h2 id="check-in-section" className="text-xl font-bold mb-4 mt-8">1. チェックイン</h2>
        <p className="mb-4">
          乗り継ぎがある場合、多くの航空会社では最初のチェックイン時に最終目的地までの搭乗券をまとめて発行してくれます。
        </p>

        <h3 className="text-lg font-bold mb-2 mt-4">オンラインチェックイン</h3>
        <p className="mb-4">
          空港に到着する前に、オンラインチェックインを事前に済ませておくことをおすすめします。<br />
          航空会社によって対応は分かれており、オンラインチェックイン未対応の航空会社もありますが、たいていの航空会社では出発24時間前からオンラインチェックインが可能です。
        </p>

        <h3 className="text-lg font-bold mb-2 mt-4">カウンターチェックイン</h3>
        <p className="mb-4">
          空港カウンターで行うカウンターチェックインも可能ですが、基本的に長時間待たされます。<br />
          空港に到着したら、出発ロビーに向かい「どのカウンターでチェックインするのか」を確認します。<br />
          フライトインフォメーション（ボード）で、利用する便名・目的地から該当のカウンターを探します。
        </p>

        <h3 className="text-lg font-bold mb-2 mt-4">手荷物の制限</h3>
        <p className="mb-4">
          航空会社ごとに機内持ち込み手荷物や預け荷物のサイズ・重量制限、個数制限が細かく定められています。<br />
          超過した場合は追加料金が発生することが多いので、必ずご利用の航空会社の公式サイトで最新の規定をご確認ください。<br />
          特に昨今事故が多発しているリチウムイオン電池については、厳しい規制を設ける航空会社が出てきていますので、ご注意ください。
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <LinkCard text="カタール航空 公式サイト" href="https://www.qatarairways.com" />
          <LinkCard text="LOTポーランド航空 公式サイト" href="https://www.lot.com" />
          <LinkCard text="エミレーツ航空 公式サイト" href="https://www.emirates.com" />
          <LinkCard text="フィンエアー 公式サイト" href="https://www.finnair.com" />
          <LinkCard text="ターキッシュ エアラインズ 公式サイト" href="https://www.turkishairlines.com" />
          <LinkCard text="オーストリア航空 公式サイト" href="https://www.austrian.com" />
          <LinkCard text="KLMオランダ航空 公式サイト" href="https://www.klm.com" />
        </div>

        <h2 id="security-check-section" className="text-xl font-bold mb-4 mt-8">2. 手荷物検査</h2>
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

        <p className="mb-8">
          その他、刃物類や危険物も厳しく制限されています。詳しくは以下のサイトをご覧ください。<br />
          <a
            href="https://www.gov-online.go.jp/article/202403/entry-5822.html"
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            空港での保安検査をスムーズに通過するために
          </a>
        </p>

        <h2 id="deadline-times-section" className="text-xl font-bold mb-4 mt-8">3. 各種手続き締切時刻</h2>
        <p className="mb-4">搭乗口は出発の30分前には到着しておきましょう。国際線の場合、一般的な目安は以下の通りです：</p>
        <Table data={DEADLINE_TABLE_DATA} />

        <h2 id="in-flight-services-section" className="text-xl font-bold mb-4 mt-8">4. 機内サービス</h2>
        <h3 className="text-lg font-bold mb-2 mt-4">食事</h3>
        <p className="mb-4">
          メニューが座席前のポケット or 機内Wi-Fi（あれば）で確認できます。特別食（アレルギーなど）を希望する場合は、事前に航空会社に連絡して予約しておきましょう。
        </p>
        <h3 className="text-lg font-bold mb-2 mt-4">エンターテイメント・Wi-Fi</h3>
        <p className="mb-4">ヨーロッパ行きのフライトでは、たいていの場合座席にタブレットが設置されており、機内エンターテイメントが利用できます。</p>
        <p className="mb-8">機内Wi-Fiは、たいていの場合有料です。（しかもめっちゃ高い）</p>

        <h2 id="connecting-flight-section" className="text-xl font-bold mb-4 mt-8">5. 乗り継ぎ</h2>
        <h3 className="text-lg font-bold mb-2 mt-4">乗り継ぎの流れ</h3>
        <ol className="list-decimal pl-8 space-y-2 mb-4">
          <li>到着後、「Transfer」または「Connection」の案内に従って移動</li>
          <li>セキュリティチェック（ここで液体の制限を超える液体を持ち込むと、破棄されます）</li>
          <li>次の便の搭乗口を確認</li>
          <li>搭乗時間まで空港内で待機</li>
        </ol>
        <p className="mb-4">
          最低乗り継ぎ時間は空港によって異なりますが、通常45分〜1時間程度です。<br />
          ただし、余裕を持って2時間以上の乗り継ぎ時間があると安心です。
        </p>
        <h3 className="text-lg font-bold mb-2 mt-4">乗り継ぎの注意点</h3>
        <ul className="list-disc pl-8 space-y-2 mb-8">
          <li>乗り継ぎ便の搭乗券を事前に受け取っているか確認</li>
          <li>預け荷物は最終目的地まで自動的に運ばれるか確認</li>
          <li>乗り継ぎ時間が短い場合は、到着後すぐに次の搭乗口へ向かう</li>
          <li>遅延等で乗り継ぎができない場合は、航空会社スタッフに相談</li>
        </ul>

        <h2 id="arrival-immigration-section" className="text-xl font-bold mb-4 mt-8">6. 到着・入国手続き</h2>
        <h3 className="text-lg font-bold mb-2 mt-4">入国審査</h3>
        <p className="mb-4">
          ワルシャワ・ショパン空港到着後、入国審査を受けます。日本国籍の場合、90日以内の観光目的であればビザは不要です。<br />
          パスポートを提示し、滞在目的や期間について簡単な質問に答えます。GBB21の場合、当サイト管理人は滞在目的だけ聞かれて入国許可を貰えました。
        </p>
        <h3 className="text-lg font-bold mb-2 mt-4">税関手続き</h3>
        <p className="mb-4">
          EU圏内では、個人使用の範囲内であれば多くの品目が免税で持ち込めます。<br />
          詳しいルールについては、各国政府機関の公式サイトや、外務省の公式サイトをご覧ください。
        </p>
        <h3 className="text-lg font-bold mb-2 mt-4">荷物受取</h3>
        <p className="mb-4">
          入国審査後、預け荷物がある場合はバゲージクレームで受け取ります。<br />
          荷物が出てこない場合や破損している場合は、すぐに航空会社のカウンターに申し出てください。
        </p>

        <div className="border-l-4 border-(--gbb-color) bg-(--section-color) p-4 my-8">
          <p className="font-bold mb-2">Visit Japan Webについて</p>
          <p>
            帰国時の入国審査・税関手続きをスムーズにするため、<a href="https://www.vjw.digital.go.jp/" target="_blank" rel="noopener noreferrer" className={anchorClass}>Visit Japan Web</a>での事前登録をおすすめします。<br />
            出発前または現地で登録しておくと、帰国時の手続きが簡素化されます。
          </p>
        </div>

        <h2 id="airport-to-city-section" className="text-xl font-bold mb-4 mt-8">7. 空港からワルシャワ市内への移動</h2>
        <h3 className="text-lg font-bold mb-2 mt-4">電車</h3>
        <p className="mb-4">
          空港駅「Lotnisko Chopina」からワルシャワ中央駅「Warszawa Centralna」まで約20分です。<br />
          ワルシャワの電車は初見では少しわかりにくいため、事前に乗り方を確認しておくことをおすすめします。<br />
          <a
            href="https://polandjoho.com/warsaw-metro/"
            target="_blank"
            rel="noopener noreferrer"
            className={anchorClass}
          >
            【ワルシャワ】メトロ・バス・トラムの乗り方、定期券など徹底解説！｜ポーランド情報局
          </a>
        </p>
        <h3 className="text-lg font-bold mb-2 mt-4">タクシー・配車アプリ</h3>
        <p className="mb-8">
          空港の正規タクシーまたはUberなどの配車アプリが利用できます。市内中心部まで約30〜50PLN（約1,000〜1,700円）、所要時間は約30〜45分です。<br />
          荷物が多い場合や深夜・早朝の移動には便利です。<br />
          配車アプリについては、<a href={`/${locale}/travel/v1_journey`} className={anchorClass}>2. 旅程・荷物編</a>をご覧ください。
        </p>

        <div className="flex flex-wrap gap-4 mt-16 mb-4">
          <LinkCard
            text={
              <span>
                BACK<br />2. 旅程・荷物編
              </span>
            }
            href={`/${locale}/travel/v1_journey`}
          />
          <LinkCard
            text={
              <span>
                NEXT<br />4. 現地編
              </span>
            }
            href={`/${locale}/others/how_to_plan`}
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
