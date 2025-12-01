const GA_ID = "G-FD7632999P";

const inlineScript = `window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag("js", new Date());

gtag("config", "${GA_ID}");`;

export const GA = () => (
  <>
    <script
      type="text/partytown"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
    ></script>
    <script
      type="text/partytown"
      dangerouslySetInnerHTML={{ __html: inlineScript }}
    ></script>
  </>
);
