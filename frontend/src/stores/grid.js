/**
 * グリッドストア
 * ライフグリッド（週単位のグリッド）のデータを管理します
 * 週のリスト、各週のイベント情報などを保持します
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useGridStore = defineStore('grid', () => {
  // 状態（リアクティブな変数）
  const weeks = ref([]); // 週のリスト（各週は { id, year, week, hasEvent, isCurrent } の形式）
  const eventsByWeek = ref({}); // 週 ID をキーとしたイベント情報のマップ
  const selectedWeek = ref(null); // 選択中の週
  const loading = ref(false); // データの読み込み中かどうか

  /**
   * 週のリストを設定
   *
   * @param {Array} items - 週の配列
   */
  const setWeeks = (items) => {
    weeks.value = items ?? [];
  };

  /**
   * イベント情報のマップを設定
   *
   * @param {Object} map - 週 ID をキーとしたイベント情報のマップ
   */
  const setEvents = (map) => {
    eventsByWeek.value = map ?? {};
  };

  /**
   * 選択中の週を設定
   *
   * @param {Object|null} value - 選択された週
   */
  const setSelectedWeek = (value) => {
    selectedWeek.value = value ?? null;
  };

  /**
   * ローディング状態を設定
   *
   * @param {boolean} value - ローディング中かどうか
   */
  const setLoading = (value) => {
    loading.value = Boolean(value);
  };

  /**
   * 現在の週の ID を計算
   * 年と週番号から "YYYY-WXX" 形式の ID を生成します
   * 例: "2024-W15"（2024年の第15週）
   */
  const currentWeekId = computed(() => {
    const now = new Date();
    // その年の1月1日を基準日として計算
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now - start;
    // 経過日数を週数に変換（7日で割る）
    const week = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`;
  });

  /**
   * 週のリストを年ごとにグループ化
   * グリッド表示時に年ごとにまとめて表示するために使用します
   */
  const weeksByYear = computed(() => {
    const groups = [];
    let currentYear = null;
    let bucket = [];
    weeks.value.forEach((w) => {
      // 年が変わったら、それまでの週をグループに追加して新しいバケットを作成
      if (currentYear !== w.year) {
        if (bucket.length) groups.push({ year: currentYear, weeks: bucket });
        currentYear = w.year;
        bucket = [];
      }
      bucket.push(w);
    });
    // 最後のバケットも追加
    if (bucket.length) groups.push({ year: currentYear, weeks: bucket });
    return groups;
  });

  /**
   * モックデータ（ダミーデータ）を生成
   * 開発用に、指定された寿命年数分の週データを生成します
   *
   * @param {number} lifespan - 寿命（年数、デフォルト: 81）
   * @param {number} startYear - 開始年（デフォルト: 1990）
   * @returns {Array} 週の配列
   */
  const generateMockWeeks = (lifespan = 81, startYear = 1990) => {
    const current = currentWeekId.value;
    const list = [];
    // 寿命年数分の年をループ
    for (let y = 0; y < lifespan; y += 1) {
      const year = startYear + y;
      // 1年は52週
      for (let w = 0; w < 52; w += 1) {
        const id = `${year}-W${String(w).padStart(2, '0')}`;
        list.push({
          id,
          year,
          week: w,
          hasEvent: false, // 実際のイベントデータはAPIから取得
          isCurrent: id === current, // 現在の週かどうか
        });
      }
    }
    return list;
  };

  /**
   * モックデータが存在しない場合に生成
   * プロフィール情報が利用可能な場合はそれを使用します
   *
   * @param {Object} profile - プロフィール情報（birthYear, lifespan を含む）
   */
  const ensureMockData = (profile = null) => {
    // プロフィール情報から設定を取得
    const lifespan = profile?.lifespan ?? 81;
    const startYear = profile?.birthYear ?? 1990;

    // 既存のデータがある場合でも、プロフィール情報が変更された場合は再生成
    const shouldRegenerate =
      !weeks.value.length ||
      (profile && (weeks.value.length !== lifespan * 52 || weeks.value[0]?.year !== startYear));

    if (shouldRegenerate) {
      setWeeks(generateMockWeeks(lifespan, startYear));
    }
  };

  return {
    weeks,
    eventsByWeek,
    selectedWeek,
    loading,
    currentWeekId,
    weeksByYear,
    setWeeks,
    setEvents,
    setSelectedWeek,
    setLoading,
    ensureMockData,
  };
});
