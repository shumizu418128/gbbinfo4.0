import { LinkCard } from "~/components/LinkCard.js";
import { PostIt } from "~/components/PostIt.js";
import { Table } from "~/components/Table.js";
import type { SupportedLanguage } from "~/constants/languageLabels.js";
import { anchorClass } from "~/constants/linkStyle.js";

type V1ReservationContentProps = {
  locale: SupportedLanguage;
};

const AIRLINE_TABLE_DATA = [
  ["航空会社", "就航地", "経路"],
  [
    <a key="qatar" href="https://www.qatarairways.com" target="_blank" rel="noopener noreferrer" className={anchorClass}>カタール航空</a>,
    "成田・羽田・関空",
    "ドーハ経由",
  ],
  [
    <a key="lot" href="https://www.lot.com" target="_blank" rel="noopener noreferrer" className={anchorClass}>LOTポーランド航空</a>,
    "成田のみ",
    "直行",
  ],
  [
    <a key="emirates" href="https://www.emirates.com" target="_blank" rel="noopener noreferrer" className={anchorClass}>エミレーツ航空</a>,
    "成田・羽田・関空",
    "ドバイ経由",
  ],
  [
    <a key="finnair" href="https://www.finnair.com" target="_blank" rel="noopener noreferrer" className={anchorClass}>フィンエアー</a>,
    "成田・羽田・中部・関空",
    "ヘルシンキ経由",
  ],
  [
    <a key="turkish" href="https://www.turkishairlines.com" target="_blank" rel="noopener noreferrer" className={anchorClass}>ターキッシュ エアラインズ</a>,
    "成田・羽田・関空",
    "イスタンブール経由",
  ],
  [
    <a key="austrian" href="https://www.austrian.com" target="_blank" rel="noopener noreferrer" className={anchorClass}>オーストリア航空</a>,
    "成田のみ",
    "ウィーン経由",
  ],
  [
    <a key="klm" href="https://www.klm.com" target="_blank" rel="noopener noreferrer" className={anchorClass}>KLMオランダ航空</a>,
    "成田・関空",
    "アムステルダム経由",
  ],
];

const COST_TABLE_DATA = [
  ["項目", "金額", "備考"],
  ["航空券", "150,000〜200,000円", "時期・航空会社により変動"],
  ["ホテル", "10,000円/泊", "1万でそこそこのグレードいける"],
  ["GBBチケット", "160〜200ユーロ", "GBB 2026"],
  ["海外旅行保険", "3,000〜5,000円", "保険内容により変動"],
  ["現地での生活費", "3,000〜5,000円/日", "物価は日本と大体同じくらい"],
  [<strong key="total">合計</strong>, <strong key="total-amount">200,000〜250,000円</strong>, "GBBチケット代を除く"],
];

export const V1ReservationContent = ({ locale }: V1ReservationContentProps) => {
  return (
    <main className="pt-16 pb-8 text-white" style={{ backgroundColor: "var(--background-color)" }}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <p className="mb-8">
          ワルシャワまでの飛行機やホテルの予約を立てるための情報を、GBB 2021 の実例を参考にまとめています。
        </p>

        <h2 className="text-xl font-bold mb-4">目次</h2>
        <ol className="list-decimal pl-8 space-y-2 mb-8">
          <li><a href="#stay-duration-section" className={anchorClass}>滞在期間</a></li>
          <li><a href="#flight-booking-section" className={anchorClass}>飛行機の予約</a></li>
          <li><a href="#accommodation-section" className={anchorClass}>宿泊施設の予約</a></li>
          <li><a href="#ticket-purchase-section" className={anchorClass}>チケットの購入</a></li>
          <li><a href="#passport-section" className={anchorClass}>【重要】パスポートについて</a></li>
          <li><a href="#visa-section" className={anchorClass}>ビザについて</a></li>
          <li><a href="#travel-insurance-section" className={anchorClass}>海外旅行保険</a></li>
          <li><a href="#cost-estimate-section" className={anchorClass}>総額の見積もり</a></li>
        </ol>

        <h2 id="stay-duration-section" className="text-xl font-bold mb-4 mt-8">1. 滞在期間</h2>
        <p className="mb-4">おすすめの滞在期間は以下の通りです。</p>
        <ul className="list-disc pl-8 space-y-4 mb-4">
          <li>
            <strong>前日入り</strong>：<br />
            日本とポーランド（ワルシャワ）では時差が約7時間あります。<br />
            長時間のフライトや時差の影響で、到着直後は体が疲れやすく、眠気やだるさ（時差ボケ）を感じることがあります。<br />
            そのため、GBB開催日の前日にワルシャワへ到着することで、現地の時間や環境に体を慣らす余裕ができます。
          </li>
          <li>
            <strong>1日遅れの帰国</strong>：<br />
            <a href={`/${locale}/2021/timetable`} className={anchorClass}>GBB 2021 タイムテーブル</a>を確認すると、GBB 2021最終日の終了時刻が非常に遅いことがわかります。<br />
            イベント終了後すぐに空港へ向かい、そのまま帰国便に乗るのは、体力的にとても大変です。<br />
            イベントの余韻を楽しんだり、荷物の整理やお土産の購入、観光などの時間を確保するためにも、GBB終了日の翌日または翌々日に帰国するのが安心です。
          </li>
        </ul>
        <p className="mb-4">
          ※航空券の価格やフライトスケジュールによっては、さらに前後する場合もあります。<br />
          余裕を持った日程を組むことで、トラブルや体調不良にも対応しやすくなります。
        </p>

        <PostIt>
          <p className="font-bold mb-2">GBB 2021 での管理人の経験</p>
          <p>Day1当日にワルシャワに到着したところ、あまりにも疲れすぎてSolo部門 eliminationを見ず帰りました<br />あーあ</p>
        </PostIt>

        <h2 id="flight-booking-section" className="text-xl font-bold mb-4 mt-8">2. 飛行機の予約</h2>
        <p className="mb-4">
          最安値は時期によって大きく変動しますが、以下のフライトが最安値になることが多いです。
        </p>
        <p className="mb-4">
          旅行当日の飛行機搭乗に関する詳細情報は、<a href={`/${locale}/travel/v1_flight`} className={anchorClass}>飛行機編</a>をご覧ください。
        </p>

        <h3 className="text-lg font-bold mb-4 mt-4">主要な航空会社・ルート</h3>
        <Table data={AIRLINE_TABLE_DATA} />
        <p className="mt-4 mb-4">
          どのルートを選んでも、基本的には日本を深夜発→ワルシャワに朝 or 昼ごろ到着するようになっています。
        </p>
        <p className="mb-4">
          なお、SARUKANI・ROFUは、GBB 2021 では羽田発・KLMオランダ航空を利用したようですが、出発時間が朝早く、価格的にもおすすめできません。
        </p>

        <PostIt>
          <p className="font-bold mb-2">管理人の私見</p>
          <p className="mb-2">GBB 2021 では、管理人はカタール航空を利用しました。機内食おいしかった</p>
          <p>
            個人的には<a href="https://www.skyscanner.net" target="_blank" rel="noopener noreferrer" className={anchorClass}>skyscanner</a>で予約するのがおすすめです<br />
            ステマじゃないよ
          </p>
        </PostIt>

        <h2 id="accommodation-section" className="text-xl font-bold mb-4 mt-8">3. 宿泊施設の予約</h2>
        <p className="mb-4">基本的には個人の好みで選んでかまいませんが、以下の選択肢があります。</p>
        <ul className="list-disc pl-8 space-y-2 mb-4">
          <li>オフィシャルホテルを利用</li>
          <li>ホテル予約サイト・公式サイトで予約</li>
          <li>Airbnb</li>
        </ul>
        <p className="mb-4">値段を見ている限り、Airbnbの方が安いことが多いようです。</p>

        <h3 className="text-lg font-bold mb-2 mt-4">ホテル予約サイトについて</h3>
        <p className="mb-2">
          ホテル予約サイト（例：
          <a href="https://www.booking.com/" target="_blank" rel="noopener noreferrer" className={anchorClass}>Booking.com</a>、
          <a href="https://www.hotels.com/" target="_blank" rel="noopener noreferrer" className={anchorClass}>Hotels.com</a>、
          <a href="https://www.expedia.co.jp/" target="_blank" rel="noopener noreferrer" className={anchorClass}>Expedia</a>、
          <a href="https://www.agoda.com/" target="_blank" rel="noopener noreferrer" className={anchorClass}>Agoda</a>）は、世界中のホテルや宿泊施設を簡単に検索・比較・予約できるサービスです。
        </p>
        <ul className="list-disc pl-8 space-y-2 mb-4">
          <li>日本語対応や日本円での決済が可能なサイトも多い</li>
          <li>キャンセル無料プランや、直前割引などの特典がある場合も</li>
          <li>ホテル公式サイトより安い場合もあるが、公式サイト限定の特典がある場合もあるので要比較</li>
          <li>予約後は、必ず予約確認書（バウチャー）を保存・印刷しておくと安心</li>
        </ul>

        <h3 className="text-lg font-bold mb-2 mt-4">Airbnbについて</h3>
        <p className="mb-2">
          <a href="https://www.airbnb.jp/" target="_blank" rel="noopener noreferrer" className={anchorClass}>Airbnb</a>は、現地の一般家庭やアパート、マンションの一室などを借りられる民泊サービスです。
        </p>
        <ul className="list-disc pl-8 space-y-2 mb-4">
          <li>キッチンや洗濯機付きの物件も多く、生活費を抑えやすい</li>
          <li>ホスト（貸主）とのやりとりは基本的に英語（または現地語）</li>
          <li>物件によってはチェックイン方法が異なるため、事前に確認が必要</li>
          <li>ホテルと比べて清掃や設備の質にバラつきがある場合もあるので、口コミの確認をおすすめします</li>
        </ul>

        <h3 className="text-lg font-bold mb-2 mt-4">参考：オフィシャルホテルについて</h3>
        <p className="mb-8">
          GBB 2021 では、オフィシャルホテルとして Hotel Westin Warsaw が利用されました。※高級ホテルなので普通に予約すると高いです。
        </p>

        <h2 id="ticket-purchase-section" className="text-xl font-bold mb-4 mt-8">4. チケットの購入</h2>
        <p className="mb-4">
          チケットに関する情報は、原則公式Instagramから情報が出るのみです。日本での開催ではありませんので、日本語サポートは期待できません。
        </p>
        <p className="mb-4">
          また、GBB 2019 以前は、GBBチケットを持っている方は無料で7toSmokeへ参加できましたが、GBB 2021 では新型コロナウイルス対策を理由に7toSmokeチケットの購入が必要になりました。<br />
          以降のGBBでは7toSmokeチケットの購入が必要になり、今後もこの運用は続く可能性があります。
        </p>

        <PostIt>
          <p className="font-bold mb-2">GBB 2021 の場合</p>
          <p>
            GBB 2021 では、<a href="https://goout.net/en/" target="_blank" rel="noopener noreferrer" className={anchorClass}>goout</a>という、ヨーロッパのチケット販売会社によって販売されました。
          </p>
        </PostIt>

        <h2 id="passport-section" className="text-xl font-bold mb-4 mt-8">5.【重要】パスポートについて</h2>
        <p className="font-bold mb-2">⚠️ 最重要：パスポートの有効期限</p>
        <p className="mb-4">
          <strong>パスポートの有効期限は、渡航地からの帰国日を基準に3〜6カ月以上</strong>（国によって異なります）必要です。ポーランドの場合は3カ月以上必要です。
        </p>
        <p className="mb-4">
          必ずご自身の帰国日を基準に、パスポートの残存有効期間が十分か確認してください。有効期限が不足している場合、入国を拒否される可能性があります。
        </p>
        <p className="mb-4">
          東京都生活文化局は、パスポートの申請は使用の1か月前を目安に、時間に余裕を持った申請と受け取りをするよう呼びかけています。
        </p>

        <PostIt>
          <p className="font-bold mb-2">「今の時点で有効期限に余裕があるから大丈夫」は間違いです</p>
          <p className="mb-2">
            コロナによる渡航規制が撤廃された2023年以降、この有効期限のルールを知らず、空港で搭乗拒否された方が多くいます。
          </p>
          <p>
            救済措置はありません、家に帰らされます。<br />
            パスポートの管理は自己責任なので、旅行代金の返金はありません。
          </p>
        </PostIt>

        <h2 id="visa-section" className="text-xl font-bold mb-4 mt-8">6. ビザについて</h2>
        <p className="mb-4">
          GBBの現地観戦だけが目的の日本国籍の方の場合、ポーランド含むほとんどの国で観光ビザは不要です。
        </p>
        <p className="mb-4">
          その他の入国条件については、各国政府機関の公式サイトや、外務省の公式サイトをご覧ください。
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <LinkCard text="外務省 海外安全ホームページ" href="https://www.anzen.mofa.go.jp/" />
          <LinkCard text="在ポーランド日本大使館" href="https://www.pl.emb-japan.go.jp/itprtop_ja/index.html" />
          <LinkCard text="在日ポーランド大使館" href="https://www.gov.pl/web/nippon" />
        </div>

        <h2 id="travel-insurance-section" className="text-xl font-bold mb-4 mt-8">7. 海外旅行保険</h2>
        <p className="mb-8">
          GBB 2021 では、管理人は<a href="https://www.hs-sonpo.co.jp/travel/" target="_blank" rel="noopener noreferrer" className={anchorClass}>たびとも</a>を利用しました。<br />
          クレジットカード付帯保険は、利用条件があることに加え、補償額が低いことが多いです。
        </p>

        <h2 id="cost-estimate-section" className="text-xl font-bold mb-4 mt-8">8. 総額の見積もり</h2>
        <Table data={COST_TABLE_DATA} />

        <div className="flex flex-wrap gap-4 mt-16 mb-4">
          <LinkCard
            text={
              <span>
                NEXT<br />2. 旅程・荷物編
              </span>
            }
            href={`/${locale}/travel/v1_journey`}
            fullWidth
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <LinkCard
            text={
              <span>
                ポーランドへ行こう<br />トップページへ戻る
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
