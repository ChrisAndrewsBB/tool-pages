document.addEventListener("DOMContentLoaded", () => {

  updateBreakdown();

  const search =
    document.getElementById("tool-search");

  if (search) {
    search.addEventListener("input", updateBreakdown);
  }

});

function getTools() {
  return window.getToolLibrary?.() || [];
}

function buildToolCatalogue() {
  const tools = getTools();

  const grouped = {};

  tools
    .filter(t => t.category === "preset")
    .forEach(tool => {

      const mfr = (tool.manufacturer || "Other").trim();
      const type = (tool.type || "Other").trim();

      grouped[mfr] ??= {};
      grouped[mfr][type] ??= [];

      grouped[mfr][type].push(tool);
    });

  return grouped;
}

function buildToolCatalogue(searchTerm = "") {
  const tools = getTools();

  const grouped = {};

  const filter = searchTerm.trim().toLowerCase();

  tools
    .filter(t => t.category === "preset")
    .filter(tool => {

      if (!filter) return true;

      return [
        tool.manufacturer,
        tool.type,
        tool.name
      ]
        .join(" ")
        .toLowerCase()
        .includes(filter);
    })
    .forEach(tool => {

      const mfr = (tool.manufacturer || "Other").trim();
      const type = (tool.type || "Other").trim();

      grouped[mfr] ??= {};
      grouped[mfr][type] ??= [];

      grouped[mfr][type].push(tool);
    });

  return grouped;
}



function renderToolBreakdown(grouped) {
  const wrapper = document.getElementById("tool-breakdown-wrapper");
  const container = document.getElementById("tool-breakdown");

  if (!wrapper || !container) return;

  container.innerHTML = `
    <label class="input-group-text text-bold section-header mb-3">
      TOOL NOISE BREAKDOWN (Sound Power LwA)
    </label>
  `;

  const manufacturers = Object.keys(grouped);

  if (!manufacturers.length) {
    wrapper.classList.add("d-none");
    return;
  }

  manufacturers.sort().forEach(mfr => {

   const mfrBlock = document.createElement("div");
mfrBlock.className = "mb-4";

const mfrHeader = document.createElement("div");
mfrHeader.className = "input-group-text tool-heading noise-tool-heading mb-3";
mfrHeader.dataset.manufacturer = mfr;

const textSpan = document.createElement("span");
textSpan.className = "mfr-text";
textSpan.textContent = mfr;
mfrHeader.appendChild(textSpan);

const img = document.createElement("img");
img.className = "manufacturer-logo";
img.alt = mfr;
img.src = `./Assets/Logos/${mfr}.svg`;
img.loading = "eager";

mfrHeader.classList.add("no-logo");

img.onload = () => {
    mfrHeader.classList.remove("no-logo");
    mfrHeader.classList.add("has-logo");
};

img.onerror = () => {
    mfrHeader.classList.remove("has-logo");
    mfrHeader.classList.add("no-logo");
};

mfrHeader.appendChild(img);

mfrBlock.appendChild(mfrHeader);

    const types = Object.keys(grouped[mfr]).sort();

    types.forEach(type => {

      const typeBlock = document.createElement("div");
      typeBlock.className = "mb-3 ps-3";

      typeBlock.innerHTML = `<h5 class="mb-2 input-group-text tool-heading noise-tool-subheading">${type}</h5>`;

      grouped[mfr][type]
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(tool => {

          const sound = Number(tool.soundpower) || 0;
          const icon = tool.icon || "./Assets/Icons/Tools/Default.svg";

          const div = document.createElement("div");
          div.className = "alert noise-alert mb-2";

          div.innerHTML = `
            <div class="row g-0 align-items-center">

              <div class="col-auto pe-3">
                <img
                  src="${icon}"
                  width="64"
                  height="64"
                  onerror="this.src='./Assets/Icons/Tools/Default.svg'"
                >
              </div>

              <div class="col">
                <h5 class="mb-1">${tool.name}</h5>
              </div>

              <div class="col-auto text-end">
                <span class="badge bg-primary">
                  ${sound.toFixed(1)} dB LwA
                </span>
              </div>

            </div>
          `;

          typeBlock.appendChild(div);
        });

      mfrBlock.appendChild(typeBlock);
    });

    container.appendChild(mfrBlock);
  });

  wrapper.classList.remove("d-none");
}

function updateBreakdown() {
  const search =
    document.getElementById("tool-search")?.value || "";

  const grouped =
    buildToolCatalogue(search);

  renderToolBreakdown(grouped);
}