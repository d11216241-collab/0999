# 塔羅單張占卜

純前端塔羅抽牌網頁，支援單張抽牌、正逆位判斷與牌義顯示。

## 啟動方式

使用任何靜態伺服器即可在本機執行，例如：

```bash
# Node.js（需安裝 http-server）
npx http-server .

# Python 3
python3 -m http.server 8080

# VS Code Live Server 擴充套件
# 在 index.html 上按右鍵 → Open with Live Server
```

開啟瀏覽器後前往 `http://localhost:8080`（或對應埠號）即可使用。

> **注意**：由於頁面使用 `fetch()` 載入 `data/cards.json`，需透過 HTTP 伺服器開啟，不可直接用 `file://` 協定開啟。

## 目錄結構

```
.
├── index.html          # 主頁面
├── styles.css          # 樣式
├── app.js              # 抽牌邏輯
├── data/
│   └── cards.json      # 78 張牌卡資料
└── assets/
    ├── placeholder.svg # 牌圖載入失敗時的替代圖示
    ├── major/          # 大阿爾克那牌圖（00_fool.jpg … 21_world.jpg）
    └── minor/          # 小阿爾克那牌圖
```

## 牌圖

`assets/major/` 與 `assets/minor/` 目錄下需放置對應的牌圖檔案。若圖片不存在，頁面會顯示替代佔位符，不會破版。

## cards.json 格式

```json
[
  {
    "card_id": "MA_00_FOOL",
    "name_zh": "愚者",
    "arcana": "major",
    "suit": null,
    "number": 0,
    "image_url": "assets/major/00_fool.jpg",
    "meaning_upright": "新的開始、自由、信任直覺，願意踏出第一步。",
    "meaning_reversed": "衝動、逃避責任、缺乏計畫，容易冒進。",
    "keywords_upright": ["新開始", "自由", "冒險", "直覺"],
    "keywords_reversed": ["衝動", "魯莽", "不負責", "迷惘"]
  }
]
```

## 免責聲明

本網站塔羅解讀僅供娛樂與自我探索參考，不構成醫療、法律或財務建議。
