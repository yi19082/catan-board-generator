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
  `body.mobile-modal-open {
    overflow: hidden;
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
    font-size: 1.6rem;
    line-height: 1;
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
    display: none;
    inset: 0;
    overflow: auto;
    position: fixed;
    z-index: 1000;
}

.modal.show {
    display: block;
}

.modal-dialog {
    margin: 18px auto;
    max-width: min(92vw, 720px);
}

.modal-content {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 16px 50px rgba(0, 0, 0, 0.32);
}

.modal-header,
.modal-footer {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding: 12px 16px;
}

.modal-body {
    padding: 12px 16px;
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
        width: 50%;
    }
}
`
);

fs.writeFileSync(
  path.join(targetRoot, "mobile-bridge.webjs"),
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
