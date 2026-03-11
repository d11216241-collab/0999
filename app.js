/**
 * app.js — 塔羅單張占卜邏輯
 */

(function () {
  'use strict';

  const CARDS_URL = 'data/cards.json';
  const PLACEHOLDER_URL = 'assets/placeholder.svg';

  let cards = [];
  let isDrawing = false;

  const drawBtn = document.getElementById('drawBtn');
  const resultSection = document.getElementById('resultSection');

  // ── Bootstrap ──────────────────────────────────────────────
  async function init() {
    try {
      const response = await fetch(CARDS_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('empty');
      }
      cards = data;
      drawBtn.disabled = false;
      drawBtn.addEventListener('click', handleDraw);
    } catch (err) {
      const msg = err.message === 'empty'
        ? '牌組資料缺失，請確認 data/cards.json 是否正確。'
        : '資料載入失敗，請重新整理頁面。';
      showError(msg);
      drawBtn.disabled = true;
    }
  }

  // ── Draw handler ────────────────────────────────────────────
  function handleDraw() {
    if (isDrawing || cards.length === 0) return;
    isDrawing = true;
    drawBtn.disabled = true;

    const card = pickRandom(cards);
    const isReversed = Math.random() < 0.5;
    renderCard(card, isReversed);

    isDrawing = false;
    drawBtn.disabled = false;
  }

  // ── Random picker ────────────────────────────────────────────
  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ── Render ───────────────────────────────────────────────────
  function renderCard(card, isReversed) {
    const orientation = isReversed ? 'reversed' : 'upright';
    const orientationLabel = isReversed ? '逆位' : '正位';
    const meaning = isReversed ? card.meaning_reversed : card.meaning_upright;
    const keywords = isReversed ? card.keywords_reversed : card.keywords_upright;
    const arcanaLabel = card.arcana === 'major'
      ? `大阿爾克那（第 ${card.number} 號）`
      : `小阿爾克那・${suitLabel(card.suit)}（${card.number}）`;

    const keywordsHTML = (keywords || [])
      .map(k => `<li class="keyword-tag">${escapeHTML(k)}</li>`)
      .join('');

    resultSection.innerHTML = `
      <article class="card-result" role="region" aria-label="抽牌結果">
        <span class="orientation-badge ${orientation}">${orientationLabel}</span>
        <h2 class="card-name">${escapeHTML(card.name_zh)}</h2>
        <div class="card-image-wrapper" id="imgWrapper">
          <img
            class="card-image${isReversed ? ' reversed-img' : ''}"
            src="${escapeAttr(card.image_url)}"
            alt="${escapeAttr(card.name_zh)}${isReversed ? '（逆位）' : '（正位）'}"
            id="cardImg"
          />
        </div>
        <div class="card-info">
          <div class="info-block">
            <span class="info-label">牌義</span>
            <p class="info-value">${escapeHTML(meaning)}</p>
          </div>
          <div class="info-block">
            <span class="info-label">關鍵字</span>
            <ul class="keywords-list">${keywordsHTML}</ul>
          </div>
        </div>
        <p class="arcana-info">${escapeHTML(arcanaLabel)}</p>
      </article>
    `;

    // Handle image load failure
    const imgEl = document.getElementById('cardImg');
    imgEl.addEventListener('error', function onError() {
      imgEl.removeEventListener('error', onError);
      const wrapper = document.getElementById('imgWrapper');
      if (wrapper) {
        wrapper.innerHTML = `
          <div class="card-image-placeholder">
            <span class="placeholder-icon">☽</span>
            <span>${escapeHTML(card.name_zh)}</span>
          </div>
        `;
      }
    });
  }

  // ── Helpers ──────────────────────────────────────────────────
  function suitLabel(suit) {
    const map = { wands: '權杖', cups: '聖杯', swords: '寶劍', pentacles: '星幣' };
    return map[suit] || suit || '';
  }

  function showError(message) {
    resultSection.innerHTML = `<p class="error-message">⚠️ ${escapeHTML(message)}</p>`;
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ── Start ────────────────────────────────────────────────────
  drawBtn.disabled = true;
  init();
})();
