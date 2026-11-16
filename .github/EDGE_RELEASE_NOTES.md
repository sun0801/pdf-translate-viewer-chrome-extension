Microsoft Edge向けのPDF翻訳ビューアです。原文と訳文の対訳表示、Gemini翻訳、PDF保存、引用出力を利用できます。

## インストール

1. 添付の `pdf-translate-viewer-edge-v0.8.5.zip` をダウンロードして展開します。GitHub自動生成の「Source code」は使わないでください。
2. Edgeで `edge://extensions` を開き、「開発者モード」をONにします。
3. 「展開して読み込み」で、展開した中の `manifest.json` があるフォルダを選びます。
4. PDFを開きます。ローカルAIが使えない環境では、ビューア右上の設定にGemini APIキーを保存し、「Gemini」を押してください。

Node.js・npmは不要です。読み込ませたフォルダは削除・移動しないでください。更新時は同じフォルダへZIPの中身を上書きし、拡張機能を再読み込みしてPDFを開き直します。ローカルPDFには「ファイルのURLへのアクセスを許可する」をONにしてください。

## 検証範囲

- lint・整形確認・378件のオフラインテストが通過しています。公開時にも再確認します。
- Linux版Edge 155でPDFの自動表示・原文選択レイヤー・Gemini操作と訳文反映（API応答をモック）・翻訳PDFの保存・通常ビューアへの復帰を確認しています。
- Windows/macOS、実際のGemini APIへの接続、ローカルモデルによる翻訳は未確認です。
- Edge版はURLに基づいてPDFを開くため、元のPDF URLを維持する表示には対応していません。

[詳しい使い方](https://github.com/sun0801/pdf-translate-viewer-chrome-extension#readme)。SHA-256は添付の `SHA256SUMS.txt` を参照してください。
