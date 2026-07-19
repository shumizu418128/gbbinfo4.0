import fs from "fs";
import path from "path";

const dir = "messages";

/** 削除する重複キー（残す側は KEY_RENAMES または既存共通キー） */
const KEYS_TO_REMOVE = [
  "result_name",
  "participant_col_ticket",
  "participant_participants_list_year",
  "rule_col_judges",
  "rule_target",
];

/** 旧キー → value の意味を表す新キー */
const KEY_RENAMES = {
  rule_toc_challenger: "rule_challenger_series",
  wildcard_reg_age_limit_title: "wildcard_age_limit",
  wildcard_reg_category_rules_title: "wildcard_category_rules",
  wildcard_reg_disqualification_title: "wildcard_avoid_disqualification",
  wildcard_reg_submit_once: "wildcard_submit_once",
  wildcard_reg_submit_step_2: "wildcard_submit_via_form",
  wildcard_reg_toc_submission: "wildcard_submission_about",
};

/** 削除前に値をコピーして新規追加 */
const KEYS_TO_ADD_FROM = {
  participants_list: "participant_participants_list_year",
};

const VALUE_PATCHES = {
  en: {
    rule_eligibility_loop_top20: "Top 20 at GBB 2019 or later",
    rule_eligibility_solo_top30: "Top 30 at GBB 2019 or later",
  },
  de: {
    rule_eligibility_loop_top20: "Top 20 bei GBB 2019 oder später",
    rule_eligibility_solo_top30: "Top 30 bei GBB 2019 oder später",
    ticket_venue_stodola:
      "GBB {year} Veranstaltungsort: klub Stodola (Warschau, Polen)",
    ticket_venue_voltahalle:
      "GBB {year} Veranstaltungsort: Voltahalle (Basel, Schweiz)",
  },
  fr: {
    rule_eligibility_loop_top20: "Avoir atteint le top 20 depuis GBB 2019",
    rule_eligibility_solo_top30: "Avoir atteint le top 30 depuis GBB 2019",
  },
  it: {
    rule_eligibility_loop_top20:
      "Aver raggiunto il top 20 dal GBB 2019 in avanti",
    rule_eligibility_solo_top30:
      "Aver raggiunto il top 30 dal GBB 2019 in avanti",
  },
  ko: {
    rule_eligibility_loop_top20: "GBB 2019 이후 톱 20 입상 경험이 있는",
    rule_eligibility_solo_top30: "GBB 2019 이후 톱 30 입상 경험이 있는",
    ticket_venue: "장소",
    ticket_venue_stodola: "GBB {year} 장소: klub Stodola (폴란드 바르샤바)",
    ticket_venue_voltahalle: "GBB {year} 장소: Voltahalle (스위스 바젤)",
  },
  hi: {
    rule_eligibility_loop_top20: "GBB 2019 से टॉप 20 में स्थान हासिल किया हो",
    rule_eligibility_solo_top30: "GBB 2019 से टॉप 30 में स्थान हासिल किया हो",
  },
  hu: {
    rule_eligibility_loop_top20:
      "GBB 2019 óta legalább egyszer top 20-as helyezést ért el",
    rule_eligibility_solo_top30:
      "GBB 2019 óta legalább egyszer top 30-as helyezést ért el",
  },
  cs: {
    rule_eligibility_loop_top20: "Mít umístění v top 20 od GBB 2019",
    rule_eligibility_solo_top30: "Mít umístění v top 30 od GBB 2019",
  },
  pt: {
    rule_eligibility_loop_top20:
      "Ter estado entre os 20 primeiros a partir da GBB 2019",
    rule_eligibility_solo_top30:
      "Ter estado entre os 30 primeiros a partir da GBB 2019",
  },
};

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const filePath = path.join(dir, file);
  const locale = file.replace(".json", "");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const [newKey, sourceKey] of Object.entries(KEYS_TO_ADD_FROM)) {
    if (Object.hasOwn(data, sourceKey)) {
      data[newKey] = data[sourceKey];
    }
  }

  for (const oldKey of KEYS_TO_REMOVE) {
    delete data[oldKey];
  }

  for (const [oldKey, newKey] of Object.entries(KEY_RENAMES)) {
    if (Object.hasOwn(data, oldKey)) {
      data[newKey] = data[oldKey];
      delete data[oldKey];
    }
  }

  const patches = VALUE_PATCHES[locale];
  if (patches) {
    for (const [key, value] of Object.entries(patches)) {
      if (Object.hasOwn(data, key)) {
        data[key] = value;
      }
    }
  }

  const schema = data["$schema"];
  delete data["$schema"];

  const sortedKeys = Object.keys(data).sort();
  const sorted = {};
  for (const key of sortedKeys) {
    sorted[key] = data[key];
  }
  if (schema) {
    sorted["$schema"] = schema;
  }

  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + "\n", "utf8");
}

console.log("Done. i18n keys consolidated and renamed.");
