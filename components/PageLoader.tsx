import { Crest } from "./Mark";
import s from "./PageLoader.module.css";

/*
 * Runs as soon as the browser reaches it, before the page's JavaScript: if the page hasn't finished loading
 * within 0.3 s, the loading screen shows, and it fades out once everything has loaded.
 */
const script = `(function () {
  var el = document.getElementById("page-loader");
  if (!el || document.readyState === "complete") return;
  var wait = setTimeout(function () { el.hidden = false; }, 300);
  addEventListener("load", function () {
    clearTimeout(wait);
    if (el.hidden) return;
    el.setAttribute("data-leaving", "");
    setTimeout(function () { el.hidden = true; }, 260);
  });
})();`;

/** The loading screen: the crest drawing itself on the page background, shown only for slow loads. */
export function PageLoader() {
  return (
    <>
      <div id="page-loader" role="status" aria-label="Loading SuuUI" hidden className={s.loader} suppressHydrationWarning>
        <Crest id="loader" entrance className={s.crest} />
      </div>
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
