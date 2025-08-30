# 画像OCR & 要約アプリ

このアプリケーションは、アップロードされた画像（JPG/PNG）からGoogle Cloud Vision APIを利用してテキストを抽出し、Gemini 1.5 Flash を使用して日本語で要約を生成します。

![App Screenshot](https://i.imgur.com/example.png) <!-- 後で実際のスクリーンショットに置き換える -->

## ✨ 主な機能

- **画像アップロード**: 10MBまでのJPG/PNG画像をアップロードできます。
- **高精度OCR**: Google Cloud Vision APIによる高精度な多言語テキスト抽出。
- **AI要約**: 抽出されたテキストを Gemini 1.5 Flash が3〜5行の箇条書きで日本語に要約します。
- **結果表示**: 抽出された原文（折りたたみ可能）と、AIによる要約を並べて表示します。
- **パフォーマンス計測**: OCR、要約、合計処理時間をミリ秒単位で表示します。
- **エラーハンドリング**: ファイルサイズ超過、非対応形式、APIエラーなどを適切に処理し、ユーザーにフィードバックします。

## 🛠️ 技術スタック

- **フレームワーク**: Next.js (React)
- **言語**: TypeScript
- **API**: Next.js API Routes (Node.js runtime)
- **OCR**: Google Cloud Vision API
- **要約**: Google Gemini 1.5 Flash API
- **スタイリング**: Tailwind CSS
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

- `GOOGLE_API_KEY`: **(必須)** [Google AI Studio](https://aistudio.google.com/app/apikey) で取得したGemini APIキー。
- `GOOGLE_CLOUD_PROJECT`: **(必須)** お使いのGoogle CloudプロジェクトID。
- `GCP_SA_KEY_JSON`: **(必須)** 
  1. Google Cloudコンソールでサービスアカウントを作成し、「Cloud Vision API ユーザー」ロールを付与します。
  2. そのサービスアカウントのJSONキーを作成・ダウンロードします。
  3. ダウンロードしたJSONファイルの中身全体を、一行の文字列としてコピーし、一重引用符（`'`）で囲んで貼り付けます。（変換方法の詳細はトラブルシューティングの項を参照）

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

## ☁️ デプロイ

このアプリはVercelに簡単にデプロイできます。

1. プロジェクトをGitHubリポジトリにプッシュします。
2. Vercelにログインし、「Add New... > Project」からリポジトリをインポートします。
3. **Environment Variables** の設定画面で、`.env.local` と同じ内容の環境変数を設定します。
4. 「Deploy」ボタンをクリックします。

`vercel.json` により、画像アップロードを処理するAPIルートでNode.jsランタイムが使用されるように設定済みです。

## ⚠️ 制限事項・既知の問題

- **Google Cloud Vision OCR**: 利用にはGoogle Cloudプロジェクトとサービスアカウントの設定、および関連APIの有効化が必要です。
- **レート制限**: IPアドレスごとに1分あたり10回のリクエスト制限が簡易的に実装されています。

## 🖼️ サンプル画像

以下のリンク先の画像をダウンロードして試すことができます。

- [英語の印刷されたテキスト](https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Sample_of_English_text.png/800px-Sample_of_English_text.png)
- [日本語の印刷されたテキスト](https://upload.wikimedia.org/wikipedia/org/a/a8/NatsumeSoseki-Kokoro-Sample.jpg)