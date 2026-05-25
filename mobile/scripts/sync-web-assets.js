const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..");
const targetRoot = path.resolve(__dirname, "..", "assets", "web");
const targetPics = path.join(targetRoot, "pics");

const files = [
  "common.css",
  "map_select.css",
  "style_by_orientation.css"
];

fs.mkdirSync(targetPics, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(repoRoot, file), path.join(targetRoot, file));
}

fs.copyFileSync(path.join(repoRoot, "index.min.js"), path.join(targetRoot, "index.min.webjs"));

for (const image of fs.readdirSync(path.join(repoRoot, "pics"))) {
  fs.copyFileSync(path.join(repoRoot, "pics", image), path.join(targetPics, image));
}

let html = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");

html = html
  .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\r?\n/g, "")
  .replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin="">\r?\n/g, "")
  .replace(/\s*<link href="https:\/\/fonts\.googleapis\.com[^"]+" rel="stylesheet">\r?\n/g, "")
  .replace(/\s*<link href="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5\.3\.3\/dist\/css\/bootstrap\.min\.css" rel="stylesheet">\r?\n/g, "")
  .replace(/\s*<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5\.3\.3\/dist\/js\/bootstrap\.bundle\.min\.js"><\/script>\r?\n/g, "")
  .replace(/\s*<script async="" id="netlify-rum-container"[\s\S]*?<\/script>\r?\n/g, "")
  .replace(
    '<link rel="stylesheet" type="text/css" href="./style_by_orientation.css">',
    '<link rel="stylesheet" type="text/css" href="./style_by_orientation.css">\n    <link rel="stylesheet" type="text/css" href="./mobile-bridge.css">'
  )
  .replace(
    '<script type="text/javascript" src="./index.min.js"></script></body></html>',
    '<script type="text/javascript" src="./mobile-bridge.js"></script>\n<script type="text/javascript" src="./index.min.js"></script></body></html>'
  );

fs.writeFileSync(path.join(targetRoot, "index.html"), html);

fs.writeFileSync(
  path.join(targetRoot, "mobile-bridge.css"),
  `:root {
    --native-safe-top: 0px;
    --native-safe-right: 0px;
    --native-safe-bottom: 0px;
    --native-safe-left: 0px;
    --mobile-gap: clamp(8px, 2.5vw, 18px);
}

html,
body {
    box-sizing: border-box;
    min-height: 100%;
    overflow-x: hidden;
    width: 100%;
}

*,
*::before,
*::after {
    box-sizing: inherit;
}

body {
    align-items: center;
    display: flex;
    flex-direction: column;
    padding: var(--mobile-gap) max(var(--mobile-gap), var(--native-safe-right)) max(var(--mobile-gap), var(--native-safe-bottom)) max(var(--mobile-gap), var(--native-safe-left));
}

body.mobile-modal-open {
    overflow: hidden;
}

#title {
    flex: 0 0 auto;
    max-width: min(100%, 720px);
    width: 100%;
}

#title h1 {
    font-size: clamp(26px, 7vw, 52px);
    line-height: 0.92;
    margin: 0;
}

#board {
    flex: 0 0 auto;
    max-width: min(100%, 720px);
}

@media all and (orientation: portrait) {
    #board {
        height: min(calc(100vw - var(--native-safe-left) - var(--native-safe-right) - (var(--mobile-gap) * 2)), calc(100vh - var(--native-safe-top) - var(--native-safe-bottom) - 142px));
        left: auto;
        margin: var(--mobile-gap) auto 0;
        transform: none;
        width: min(calc(100vw - var(--native-safe-left) - var(--native-safe-right) - (var(--mobile-gap) * 2)), calc(100vh - var(--native-safe-top) - var(--native-safe-bottom) - 142px));
    }

    .border-normal {
        width: min(calc(100vw - var(--native-safe-left) - var(--native-safe-right) - (var(--mobile-gap) * 2)), calc(100vh - var(--native-safe-top) - var(--native-safe-bottom) - 142px));
        height: calc(min(calc(100vw - var(--native-safe-left) - var(--native-safe-right) - (var(--mobile-gap) * 2)), calc(100vh - var(--native-safe-top) - var(--native-safe-bottom) - 142px)) * 1.732050808 / 2);
    }
}

@media all and (orientation: landscape) {
    body {
        align-items: stretch;
        padding-top: max(8px, var(--native-safe-top));
    }
}

.btn {
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    font-family: inherit;
    padding: 0.375rem 0.75rem;
}

.btn-primary {
    background: #0d6efd;
    color: #fff;
}

.btn-secondary {
    background: #6c757d;
    color: #fff;
}

.btn-close {
    background: transparent;
    border: 0;
    color: #222;
    flex: 0 0 auto;
    font-size: 1.4rem;
    line-height: 1;
    min-height: 36px;
    min-width: 36px;
    padding: 0;
}

.btn-close::before {
    content: "x";
}

.form-select,
.form-control {
    border: 1px solid #ced4da;
    border-radius: 6px;
    font: inherit;
    padding: 0.375rem 0.75rem;
}

.form-check-input {
    height: 1rem;
    width: 1rem;
}

.resource-icon {
    height: 32px;
    width: 32px;
}

.modal {
    background: rgba(0, 0, 0, 0.48);
    color: #111;
    display: none;
    font-family: Arial, sans-serif;
    font-size: 16px;
    inset: 0;
    overflow: auto;
    padding: max(12px, var(--native-safe-top)) max(10px, var(--native-safe-right)) max(12px, var(--native-safe-bottom)) max(10px, var(--native-safe-left));
    position: fixed;
    z-index: 1000;
}

.modal.show {
    display: block;
}

.modal-dialog {
    margin: 0 auto;
    max-width: min(100%, 760px);
}

.modal-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 16px 50px rgba(0, 0, 0, 0.32);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - max(10px, var(--native-safe-top)) - max(10px, var(--native-safe-bottom)));
    overflow: hidden;
}

.modal-header,
.modal-footer {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    gap: 12px;
    justify-content: space-between;
    padding: 10px 14px;
}

.modal-body {
    flex: 1 1 auto;
    overflow: auto;
    padding: 10px 14px;
}

.modal-title {
    font-size: clamp(22px, 6vw, 34px);
    line-height: 1.05;
    margin: 0;
}

.modal h5 {
    font-size: clamp(17px, 4vw, 22px);
    line-height: 1.2;
    margin: 0 0 0.5rem;
}

.modal .row {
    gap: 14px;
}

.modal .col-12 {
    min-width: 0;
}

.modal .d-flex,
.modal .mb-2 {
    margin-bottom: 0.45rem;
}

.modal label {
    display: inline-block;
    min-width: 2.25rem;
}

.modal .form-control {
    font-size: 16px;
    height: 38px;
    max-width: 82px;
    min-width: 68px;
    padding: 0.25rem 0.55rem;
}

.modal .form-check {
    align-items: center;
    display: flex;
    gap: 10px;
}

.modal .form-check-label {
    line-height: 1.2;
    min-width: 0;
}

.modal .form-check-input {
    flex: 0 0 auto;
}

.modal-footer .btn {
    font-size: 16px;
    min-height: 42px;
}

.container-fluid {
    width: 100%;
}

.row {
    display: flex;
    flex-wrap: wrap;
}

.col-12 {
    box-sizing: border-box;
    width: 100%;
}

.d-flex {
    display: flex;
}

.align-items-center {
    align-items: center;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.mt-3 {
    margin-top: 1rem;
}

.me-2 {
    margin-right: 0.5rem;
}

.ms-2 {
    margin-left: 0.5rem;
}

.w-auto {
    width: auto;
}

.w-100 {
    width: 100%;
}

.d-inline-block {
    display: inline-block;
}

@media (min-width: 768px) {
    .col-md-6 {
        width: calc(50% - 7px);
    }
}

@media (max-width: 430px) {
    .modal-header,
    .modal-footer,
    .modal-body {
        padding: 10px 12px;
    }

    .resource-icon {
        height: 26px;
        width: 26px;
    }

    .form-control {
        max-width: 72px;
    }

    .modal .row {
        gap: 8px;
    }

    .modal .form-control {
        height: 36px;
    }
}
`
);

fs.writeFileSync(
  path.join(targetRoot, "mobile-bridge-script.webjs"),
  `(function () {
    function showModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.add("show");
        modal.style.display = "block";
        modal.removeAttribute("aria-hidden");
        document.body.classList.add("mobile-modal-open");
        modal.dispatchEvent(new Event("show.bs.modal"));
    }

    function hideModal(modal) {
        if (!modal) {
            return;
        }

        modal.classList.remove("show");
        modal.style.display = "none";
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("mobile-modal-open");
    }

    window.bootstrap = {
        Modal: {
            getOrCreateInstance: function (modal) {
                return {
                    show: function () {
                        showModal(modal);
                    },
                    hide: function () {
                        hideModal(modal);
                    }
                };
            }
        }
    };

    document.addEventListener("click", function (event) {
        const toggle = event.target.closest("[data-bs-toggle='modal']");
        if (toggle) {
            event.preventDefault();
            showModal(document.querySelector(toggle.getAttribute("data-bs-target")));
            return;
        }

        if (event.target.closest("[data-bs-dismiss='modal']")) {
            event.preventDefault();
            hideModal(event.target.closest(".modal"));
        }
    });
}());
`
);

console.log(`Synced web assets to ${targetRoot}`);
