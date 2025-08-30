# 画像OCR & 要約アプリ

このアプリケーションは、アップロードされた画像（JPG/PNG）からGoogle Cloud Vision APIを利用してテキストを抽出し、Gemini 1.5 Flash を使用して日本語で要約を生成します。
モダンでインタラクティブなUIデザインを採用し、快適なユーザー体験を提供します。

![App Screenshot](https://i.imgur.com/example.png) <!-- 後で実際のスクリーンショットに置き換える -->

## ✨ 主な機能

- **インタラクティブなUI**: ドラッグ＆ドロップに対応したファイルアップロードエリアや、スムーズなアニメーションで、直感的な操作が可能です。
- **高精度OCR**: Google Cloud Vision APIによる高精度な多言語テキスト抽出。
- **AI要約**: 抽出されたテキストを Gemini 1.5 Flash が3〜5行の箇条書きで日本語に要約します。
- **クリップボードへのコピー**: 抽出された原文と要約結果は、ワンクリックで簡単にコピーできます。
- **モダンな通知機能**: 処理の成功やエラーは、画面上部に表示されるトースト通知によってフィードバックされます。
- **パフォーマンス計測**: OCR、要約、合計処理時間をミリ秒単位で表示します。

## 🛠️ 技術スタック

- **フレームワーク**: Next.js (React)
- **言語**: TypeScript
- **API**: Next.js API Routes (Node.js runtime)
- **OCR**: Google Cloud Vision API
- **要約**: Google Gemini 1.5 Flash API
- **スタイリング**: Tailwind CSS
- **アニメーション**: Framer Motion
- **通知**: React Hot Toast
- **アイコン**: React Icons
- **デプロイ**: Vercel

## 🚀 セットアップと起動

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/ocr-summary-app.git
cd ocr-summary-app
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local.example` をコピーして `.env.local` を作成します。

```bash
cp .env.local.example .env.local
```

次に、`.env.local` ファイルを開き、各APIキーを設定します。

- `GOOGLE_API_KEY`: **(必須)** [Google AI Studio](https://aistudio.google.com/app/apikey) で取得したGemini APIキー。このキーに紐づくプロジェクトで **Generative Language API** を有効にする必要があります。
- `GOOGLE_CLOUD_PROJECT`: **(必須)** お使いのGoogle CloudプロジェクトID。
- `GCP_SA_KEY_JSON`: **(必須)** 
  1. Google Cloudコンソールでサービスアカウントを作成し、「**Cloud Vision API ユーザー**」ロールを付与します。
  2. そのサービスアカウントのJSONキーを作成・ダウンロードします。
  3. ダウンロードしたJSONファイルの中身全体を、一行の文字列としてコピーし、一重引用符（`'`）で囲んで貼り付けます。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## 🏗️ コード構成

UIコンポーネントは `components` ディレクトリに分割されており、それぞれが特定の役割を持っています。

- `Header.tsx`: ページ上部のヘッダー
- `FileUpload.tsx`: ファイルアップロードエリア
- `LoadingSpinner.tsx`: 処理中のスピナー
- `ResultCard.tsx`: OCR結果表示用カード
- `SummaryCard.tsx`: 要約結果表示用カード
- `ToastProvider.tsx`: 通知機能のプロバイダ

メインのページロジックは `pages/index.tsx` にあり、これらのコンポーネントを組み合わせてUIを構築しています。

## ⚠️ 制限事項・既知の問題

- **Google Cloud設定**: Google Cloud Vision APIの利用には、GCPプロジェクト、サービスアカウント、請求先アカウントの設定、および関連API（Cloud Vision API, Generative Language API）の有効化が必要です。
- **レート制限**: IPアドレスごとに1分あたり10回のリクエスト制限が簡易的に実装されています。