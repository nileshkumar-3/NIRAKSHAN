/**
 * Static hosts (GitHub Pages, S3, Netlify) serve 404.html for any path that is
 * not a real file. Since the deployed app uses hash routing, we bounce the
 * visitor to the entry point with the path they asked for preserved in the
 * hash, so a pasted or trimmed link still lands on the right page.
 *
 * The base is derived from this script's own URL rather than hard-coded, so
 * everything keeps working if the repository is renamed.
 */
(function () {
  var base = new URL('.', document.currentScript.src).pathname; // e.g. "/NIRAKSHAN/"
  var requested = window.location.pathname;

  var route = requested.indexOf(base) === 0 ? requested.slice(base.length) : requested.replace(/^\/+/, '');
  if (!route || route === '/') route = '/';

  window.location.replace(base + '#' + route + window.location.search);
})();
