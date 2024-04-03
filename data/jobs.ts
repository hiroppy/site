export type Meta = Record<
  string,
  {
    image: string;
    url: string;
  }
>;

export const meta = {
  mercari: {
    image: "mercari.png",
    url: "https://about.mercari.com/",
  },
  yuimedi: {
    image: "yuimedi.jpeg",
    url: "https://yuimedi.com/",
  },
  dwango: {
    image: "dwango.jpeg",
    url: "https://dwango.co.jp/",
  },
  estie: {
    image: "estie.png",
    url: "https://www.estie.jp/",
  },
  runpeace: {
    image: "runpeace.jpg",
    url: "https://www.runpeace.biz/",
  },
  rebase: {
    image: "rebase.png",
    url: "https://rebase.co.jp/",
  },
  route06: {
    image: "route06.jpg",
    url: "https://route06.co.jp/",
  },
  anotherworks: {
    image: "anotherworks.webp",
    url: "https://anotherworks.co.jp/",
  },
  alpaca: {
    image: "alpaca.jpg",
    url: "https://alpc.tokyo/",
  },
  black: {
    image: "black.jpg",
    url: "https://by.black/",
  },
  kakakucom: {
    image: "tabelog.jpg",
    url: "https://corporate.kakaku.com/",
  },
  bizreach: {
    image: "bizreach.jpeg",
    url: "https://www.bizreach.co.jp/",
  },
  eyesjapan: {
    image: "eyesjapan.jpg",
    url: "https://www.nowhere.co.jp/",
  },
  cyberagent: {
    image: "cyberagent.png",
    url: "https://www.cyberagent.co.jp/",
  },
} as const satisfies Meta;

export type Job = {
  main: JobContent[];
  side: JobContent[];
};

export type JobContent = {
  name: string;
  description: string;
  start: Date;
  end: Date | null;
  position: "VPoE" | "Technical Advisor" | "Architect" | "Engineer" | "Intern";
  initialState: "0" | "1-100" | "100";
  links: string[];
  company: keyof typeof meta;
};

export const history: Job = {
  main: [
    {
      name: "Yuimedi",
      start: new Date("2022-08-01"),
      end: null,
      position: "VPoE",
      initialState: "0",
      description: `
[Yuicleaner](https://yuimedi.com/yuicleaner)の開発をリードし、
[react-flow](https://reactflow.dev/)の導入と複雑なUIの作成、数百万データを高速に処理できるようにアーキテクチャの設計と実装、
既存コードをすべて置換し、Next.jsの導入などを行った。

またVPoEとしてエンジニア組織の構築も行い、エンジニアラダーの作成し評価制度のベース作成、スケールしやすい組織構築も模索しながら行っている。
      `,
      links: [
        "https://yuimedi.notion.site/Yuimedi-3981950c3d324fb183bc8e99279e9375",
        "https://yuimedi.notion.site/52914d8c12994bdfbdf8321cd2e96d5b",
        "https://daiki-skm.hatenablog.com/entry/2023/03/31/164744",
        "https://www.youtube.com/watch?v=QbWjVloaAuY",
      ],
      company: "yuimedi",
    },
    {
      name: "Mercari/Souzoh",
      start: new Date("2019-11-01"),
      end: new Date("2022-07-31"),
      position: "Architect",
      initialState: "0",
      description: `
技術顧問から正社員として復職し、再度入社。JPでは[Mercari Web](https://jp.mercari.com/)の0から作成するプロジェクトである[GroundUP App プロジェクト](https://engineering.mercari.com/blog/entry/20221213-ground-up-app/)に立ち上げ参加。

後に100%子会社であるSouzohの立ち上げ時に出向として参加し、[Mercari Shops](https://mercari-shops.com/)リリースまでの8ヶ月間、フロントエンドの開発をほぼ一人で担当。リリース後は[Enabling TeamとしてStream-aligned team](https://engineering.mercari.com/blog/entry/20210812-team-topologies-in-souzoh/)をサポート。
`,
      links: [
        "https://engineering.mercari.com/blog/entry/20210823-a57631d32e/",
        "https://findy-code.io/pick-up/interviews/souzoh-engineer",
        "https://mercan.mercari.com/articles/28113/",
        "https://www.youtube.com/watch?v=YNLvIkqRC-g",
        "https://www.youtube.com/watch?v=1uCWzfaIedE",
      ],
      company: "mercari",
    },
    {
      name: "Dwango",
      start: new Date("2017-12-16"),
      end: new Date("2019-10-31"),
      position: "Engineer",
      initialState: "1-100",
      description: `
前のドワンゴ退職から半年しか経ってないため、特に以前と開発の状態は大きく変わらず[N予備校]("https://www.nnn.ed.nico/")に復職。引き続き機能開発やwssを利用したリアルタイムイベントを管理するシステムをメンテナンス。
また、N校のプログラミング教材のレビューも行った。

後にニコニコ生放送への部署に移り、動画の低遅延、安定化の研究。WebRTCやこのときにはまだ仕様策定中であった[CMAF](https://www.liveinstantly.com/ja/resources/cross-posts/cmaf-format/)の実装調査を行った。
      `,
      links: [],
      company: "dwango",
    },
    {
      name: "Mercari",
      start: new Date("2017-06-01"),
      end: new Date("2017-11-31"),
      position: "Engineer",
      initialState: "1-100",
      description: `
[Mercari US](https://www.mercari.com/)の開発に従事し、現地にいったりし、ほぼなにもない状態のサービスを開発を行う。

Mercari JPではPWAやReactの導入をリードし行った。
      `,
      links: [],
      company: "mercari",
    },
    {
      name: "Dwango",
      start: new Date("2015-04-01"),
      end: new Date("2017-05-31"),
      position: "Engineer",
      initialState: "0",
      description: `
新卒で入社。新規開発を行うフロンティアチームで社内レジュメシステムの開発。その後に[ニコナレ](https://blog.nicovideo.jp/niconews/115830.html)の立ち上げを行いフロントエンド一人で開発。初React導入。

次に[N予備校](https://www.nnn.ed.nico/)の立ち上げを行い、主にwssを利用したリアルタイムイベントを管理するシステムを開発。
      `,
      links: [],
      company: "dwango",
    },
  ],
  side: [
    {
      name: "Tabelog",
      start: new Date("2018-12-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "100",
      description: `
Ruby on RailsからNext.jsへの移行方針の提案、実装サポート。また、jQueryからReactへの移行サポート。

エンジニアの育成。
      `,
      links: [
        "https://note.com/tabelog_frontend/n/n21b819c09121",
        "https://note.com/tabelog_frontend/n/n35664347180a",
        "https://note.com/tabelog_frontend/n/na9a2ce24a4d5",
        "https://tech-blog.tabelog.com/entry/using-static-exports-in-production",
      ],
      company: "kakakucom",
    },
    {
      name: "Mercari/Souzoh",
      start: new Date("2022-08-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "100",
      description: `
退職後引き続き、Architectとして社内のフロントエンドサポート。

エンジニア採用のサポート。
      `,
      links: [],
      company: "mercari",
    },
    {
      name: "estie",
      start: new Date("2024-04-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "100",
      description: `
フロントエンド改善支援
      `,
      links: [],
      company: "estie",
    },
    {
      name: "Rebase",
      start: new Date("2023-07-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "100",
      description: `
Next.jsのApp Routerを利用したサービスを展開しているので、そこで発生した問題点を解決するアドバイスを行う。

Ruby on Railsからフロントエンドを剥がす過程の提案、リファクタリングサポート。
      `,
      links: [
        "https://prtimes.jp/main/html/rd/p/000000097.000021828.html",
        "https://www.nikkei.com/compass/content/PRTKDB000000097_000021828/preview",
        "https://www.wantedly.com/companies/rebase/post_articles/887970",
      ],
      company: "rebase",
    },
    {
      name: "ROUTE06",
      start: new Date("2023-07-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
ADRの各意思決定の確認や議論、今後スケールする組織のためのアーキテクチャの提案。
      `,
      links: [
        "https://route06.co.jp/news/38",
        "https://tech.route06.co.jp/entry/2024/03/28/091000",
        "https://tech.route06.co.jp/entry/2023/09/07/091000",
        "https://mh4gf.dev/articles/2023-summary#hiroppy-%E3%81%95%E3%82%93%E3%81%A8%E3%81%AE%E9%80%B1%E6%AC%A1%E3%81%A7%E3%81%AE%E4%BC%9A%E8%A9%B1",
      ],
      company: "route06",
    },
    {
      name: "Runpeace",
      start: new Date("2023-07-01"),
      end: null,
      position: "Technical Advisor",
      initialState: "0",
      description: `
App Routerを利用したtoBサービスの開発、サポート。
      `,
      links: [],
      company: "runpeace",
    },
    {
      name: "Anotherworks",
      start: new Date("2023-02-01"),
      end: new Date("2023-12-31"),
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
CTOへの技術、組織的な改善提案。DDDからの脱却するため、リファクタリングへのテストの追加と安定性のサポート。
      `,
      links: [],
      company: "anotherworks",
    },
    {
      name: "Yuimedi",
      start: new Date("2021-11-01"),
      end: new Date("2022-06-01"),
      position: "Engineer",
      initialState: "1-100",
      description: `
[Yuicleaner](https://yuimedi.com/yuicleaner)の実装。
      `,
      links: [],
      company: "yuimedi",
    },
    {
      name: "Alpaca",
      start: new Date("2022-02-01"),
      end: new Date("2022-05-31"),
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
コードが複雑になっていたため、リファクタリングの提案。事業転換が発生したため、短い期間でのサポートとなった。

エンジニアの育成。
      `,
      links: [],
      company: "alpaca",
    },
    {
      name: "Black",
      start: new Date("2019-12-01"),
      end: new Date("2020-05-31"),
      position: "Technical Advisor",
      initialState: "1-100",
      description: `
create-react-appからNext.jsへの移行サポート。ゲーム開発のコードレビューとパフォーマンス改善提案。
      `,
      links: [],
      company: "black",
    },
    {
      name: "Mercari",
      start: new Date("2018-11-01"),
      end: new Date("2019-10-31"),
      position: "Technical Advisor",
      initialState: "0",
      description: `
アイルランドからのリモートワークで、Mercari JPを1から作り直すプロジェクトに顧問として参加。

Next.jsを初期から選択し、セキュリティをはじめとしたアーキテクチャの設計と実装をサポート。
      `,
      links: [
        "https://speakerdeck.com/mercari/web-re-architecture-puroziekutoniokeruji-shu-de-tiyarenzi",
      ],
      company: "mercari",
    },
    {
      name: "Bizreach",
      start: new Date("2017-06-01"),
      end: new Date("2017-09-31"),
      position: "Engineer",
      initialState: "100",
      description: `
スポットで開発に参加、Scalaを利用。
      `,
      links: [],
      company: "bizreach",
    },
    {
      name: "Eyes, Japan",
      start: new Date("2014-05-01"),
      end: new Date("2015-02-31"),
      position: "Engineer",
      initialState: "100",
      description: `
Backbone.jsやjQueryを利用し、学生アルバイトとして開発。
      `,
      links: [],
      company: "eyesjapan",
    },
    {
      name: "CyberAgent",
      start: new Date("2013-07-01"),
      end: new Date("2013-09-31"),
      position: "Intern",
      initialState: "0",
      description: `
Titaniumを利用した画像処理アプリ開発。
      `,
      links: [],
      company: "cyberagent",
    },
  ],
};
