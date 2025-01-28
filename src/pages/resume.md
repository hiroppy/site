---
title: Resume
layout: ../layouts/ResumeLayout.astro
---

## 自己紹介

廣戸 裕大(a.k.a hiroppy)といいます。

プログラミングは2008年(中学生)ぐらいから始めており、JavaScript(以下JS)を本格的に始めたのもActionScript@3が廃れ始めた2011年ぐらいです。

会津大学時代には、地元のベンチャーでアルバイトしつつ研究や競技プログラミングをしていました。また大学1年生の頃から画像処理の研究室に所属しており、4年間、画像処理に関する勉強もしました。

2015年に学部を卒業した後、株式会社ドワンゴで正社員として働き始め、それ以降はフロントエンドを主軸にWebサービスを作ってきました。

本業以外だと、大企業からスタートアップまで幅広く技術顧問として10社以上関わってきた経験があり、社外CTOや会社経営もしています。技術以外にも採用面接やエンジニア組織課題の解決のサポートをしたりと様々なことをやってきました。

この2年間は毎月、JS界隈の先月の最新技術やアップデートを発信するPodcastの[mozaic.fm](https://mozaic.fm/)もやっています。

## OSS

現在は仕事や家の事情等もあり、あまり活発ではないですが昔は様々なOSSで活動していました。

また、webpackでは[Google Summer of Code](https://summerofcode.withgoogle.com/)で外国人の方のメンターもやっていました。

| プロジェクト名 | 期間        | 種類、チーム, リポジトリ                          |
| :------------- | :---------- | :------------------------------------------------ |
| Node.js        | 2016 - 2019 | コアコミッター, Node.js, Console, Module, FS      |
| webpack        | 2018 -      | コアコミッター, webpack, webpack-dev-server, etc. |
| Stylelint      | 2019 - 2024 | コアコミッター, Stylelint                         |
| Gatsby         | 2019 - 2021 | コアコミッター, Gatsby                            |
| Babel          | 2019 -      | コミッター, babel-loader                          |
| ChakraUI       | 2020 - 2021 | パフォーマンスアドバイザー                        |

## コミュニティ

毎月、毎年のイベント開催、及びPodcastなど。

| コミュニティ名                    | 期間   | チームなど                                                   |
| :-------------------------------- | :----- | :----------------------------------------------------------- |
| mozaic.fm                         | 2022 - | Monthly Ecosystem                                            |
| JSConf JP / Node学園 / Node学園祭 | 2016 - | コアスタッフ                                                 |
| TSKaigi                           | 2024 - | [プロポーザル審査員](https://tskaigi.org/call-for-proposals) |
| React.js meetup                   | 2021 - | コアスタッフ                                                 |
| TechFeed 公認エキスパート         | 2022 - | Node.js                                                      |

## 職歴

_基本、機能実装は行っているのでそれぞれでの記載は省略_

### Yuimedi

|          |              |
| :------- | :----------- |
| 職位     | VPoE         |
| 所属期間 | 2022/08/01 ~ |

2021/11/01から副業として参加し、元々本業であった株式会社メルカリを退職し、VPoEとして参加しました。
このときに株式会社メルカリは3度目の副業へ切り替わりました。

この会社では、データの規模が数百億レベルの中、Node.jsを利用してどう速度やメモリ効率を考えて処理していくかが一番難しかった課題でした。

#### US事業 [立ち上げ]

未公開。

- [医療データ利活用のYuimedi、米国法人を設立。４億円を追加調達](https://yuimedi.com/news/240702establishment_of_us_company)

#### 数百億のデータセットのデータをクレンジング [立ち上げ]

数百億のデータセットのデータをクレンジングする巨大なパイプラインのAWSインフラのアーキテクチャ作成、及び、Node.jsの処理基板作成を行いました。

#### Yuicleaner既存実装の全体的なアーキテクチャ変更

入社当時、既存実装だと、大規模のクレンジングに耐えれない可能性があるのがわかったので、Turbopack(like Bazel)のアーキテクチャと同様の実装を行い、処理の高速化やキャッシュ効率化を実現しました。

- [Yuimedi、ノーコードの医療データクレンジングソフトウェア「Yuicleaner」β版をリリース](https://prtimes.jp/main/html/rd/p/000000009.000081576.html)

#### エンジニアラダー作成

エンジニアが増えてきたこともあり、評価制度を固めていきました。ICを目指す方もいたので、ICに特化したエンジニアラダーの作成を行い、評価の指標を再定義しました。

### メルカリ

|          |                                      |
| :------- | :----------------------------------- |
| 職位     | Frontend Enginner, Enabling Engineer |
| 所属期間 | 2019/11/01 ~ 2022 / 07 / 31          |

**2025年現在、副業として今もこの職位で所属しています。**

#### メルカリShops [立ち上げ]

メルカリから出向でソウゾウ社へ行き、メルカリShopsの初期立ち上げから現在まで開発をしていました。フロントエンドの基盤から作成し、リリースまでの8ヶ月間、ほぼ一人でフロントエンドの開発を担当しリリースしました。リリース後はEnabling TeamとしてStream-aligned teamをサポートしていました。

- [メルカリShops のフロントエンド](https://engineering.mercari.com/blog/entry/20210823-a57631d32e/)
- [Team Topologies in Souzoh](https://engineering.mercari.com/blog/entry/20210812-team-topologies-in-souzoh/)
- [メルカリShops パフォーマンス改善 奮闘記](https://engineering.mercari.com/blog/entry/20221114-souzoh-performance-improvement/)
- [メルカリShopsフロントエンドのパフォーマンスを可視化する](https://engineering.mercari.com/blog/entry/20221111-mercari-shops-frontend-performance-visualization/)
- [Souzoh Tech Talk #03: Frontend](https://www.youtube.com/watch?v=YNLvIkqRC-g)
- [Souzoh Tech Talk #05:Infrastructure](https://www.youtube.com/watch?v=1uCWzfaIedE)
- [Cache Strategy on Mercari Shops](https://slides.hiroppy.me/cache-strategy-on-mercari-shops/)

#### GroundUp Web [立ち上げ]

Web re-architectureを止める後処理を行った後、合流し、0から各種ページの実装を行いました。

- [新しいメルカリ Web の話](https://engineering.mercari.com/blog/entry/20210810-the-new-mercari-web/)

#### Web re-architecture

技術顧問時代から開発チームのサポートをし、入社後はre-architectureの開発に従事しました。Graphql Federationの導入やまだ2018年当時新しかったNext.jsの導入など将来でも採用されているライブラリの選定を行いました。

- [メルカリWebのマイクロサービス化、その4年](https://engineering.mercari.com/blog/entry/20220830-15d4e8480e/)

### ドワンゴ

|          |                                 |
| :------- | :------------------------------ |
| 職位     | Frontend Enginner               |
| 所属期間 | 2017 / 12 / 16 ~ 2019 / 10 / 31 |

#### ニコニコ生放送、低遅延最適化 [研究]

ニコニコ生放送はHLSを利用していますが、一般的に遅延の問題があります。この問題を解決するためにWebSocketにチャンクを乗せる実装をC++で書いたり、WebRTCを利用したり、当時まだ勧告されてなかった[CMAF](https://www.wowza.com/blog/what-is-cmaf)の参考実装を作ったりしていました。

#### N予備校

出戻り後、立ち上げ初期からやっていたN予備校に戻り、FlowからTypeScriptへの移行などのアーキテクチャ改善を行っていきました。

- [全てを書き換え続ける。N予備校Webフロントエンド実装6年のあゆみ](https://blog.nnn.dev/entry/2022/04/08/170000)

#### N高教材レビュー

N高で使われているプログラミング教材のレビュワーとして、参加しました。

### メルカリ

|          |                                 |
| :------- | :------------------------------ |
| 職位     | Frontend Enginner               |
| 所属期間 | 2017 / 06 / 01 ~ 2017 / 12 / 01 |

#### メルカリPWA実験プロジェクト [立ち上げ]

PWAが流行った時代というのもあるが、課題としてお客さまの平均的な通信速度に対してサービスが遅い点があり、それを改善するためにメルカリJPをPWA化するプロジェクトをリードしました。

#### メルカリUS

ほぼ何もない状態から様々な機能を日本とアメリカの二拠点で開発しました。

#### メルカリJP

Reactを導入したりHTML Templateエンジンからの脱却を試みました。

### ドワンゴ

|          |                                 |
| :------- | :------------------------------ |
| 職位     | Frontend Enginner               |
| 所属期間 | 2015 / 04 / 01 ~ 2017 / 05 / 31 |

#### N予備校 [立ち上げ]

予備校で使われる双方向基盤をNode.jsで作成しました。

#### ニコナレ [立ち上げ]

スライド共有サービスのフロントエンドをほぼ一人でやりました。ニコニコ特有のコメントレンダラーも社内パッケージとして公開しました。

- [【niconare】niconareのサービスを終了いたしました](https://blog.nicovideo.jp/niconews/115830.html)

#### 社内交流ツール [立ち上げ]

2人で社内ツールの作成をしました。

## 本業以外

[こちら](/jobs)を参照。

## メディア掲載

[こちら](/media/articles)を参照。

## リンク

- [GitHub](https://github.com/hiroppy)
- [X](https://x.com/about_hiroppy)
- [Facebook](https://www.facebook.com/yuta.hiroto0429/)
