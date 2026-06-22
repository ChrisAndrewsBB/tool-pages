document.addEventListener("DOMContentLoaded", () => {
  console.log("=== HAV CALCULATOR INIT RUNNING ===");

  const standaloneSelect = document.querySelector(".standalone-tool-select");
  const standalonePanel = document.querySelector(".standalone-tool-panel");
  const standaloneHours = document.querySelector(".standalone-hours");
  const standaloneMinutes = document.querySelector(".standalone-minutes");

  document
  .getElementById("addStandalone")
  ?.addEventListener("click", () => {

    const rows = document.querySelectorAll(
      ".standalone-calculator-row"
    );

    const lastRow = rows[rows.length - 1];

    if (!isRowComplete(lastRow)) {
      return;
    }

    addStandaloneRow(false);
	updateAddButton();
  });

  // Close dropdowns when clicking away
  document.addEventListener("click", (e) => {
  if (standaloneSelect && standalonePanel) {
    const isInside = e.target.closest(".tool-dropdown");

    if (!isInside) {
      standalonePanel.classList.remove("open");
      standalonePanel.style.display = "none";
    }
  }
});

  const toolData = window.getToolLibrary ? window.getToolLibrary() : [];
  console.log(`-> Loaded ${toolData.length} tools into the inventory buffer.`);
;
 
 const wrapper = document.getElementById("addStandaloneWrapper");
 if (wrapper) {
 new bootstrap.Tooltip(wrapper, {trigger:"hover focus"});
 }
 
  addStandaloneRow(true);
  updateAddButton();
  updateDeleteButtons();
});

//// #endregion


function isRowComplete(row) {
  if (!row) return false;

  const toolName = row.dataset.toolName;

  const vibration =
    parseFloat(
      row.querySelector(".standalone-vibration")?.value
    ) || 0;

  const hours =
    parseFloat(
      row.querySelector(".standalone-hours")?.value
    ) || 0;

  const minutes =
    parseFloat(
      row.querySelector(".standalone-minutes")?.value
    ) || 0;

  return (
    !!toolName &&
    vibration > 0 &&
    (hours > 0 || minutes > 0)
  );
}

function updateAddButton() {

  const btn = document.getElementById("addStandalone");
  const wrapper =
    document.getElementById("addStandaloneWrapper");

  if (!btn || !wrapper) return;

  const rows = document.querySelectorAll(
    ".standalone-calculator-row"
  );

  const lastRow = rows[rows.length - 1];

  const reason = getIncompleteReason(lastRow);

  btn.disabled = !!reason;

  const tooltip =
    bootstrap.Tooltip.getInstance(wrapper);

  if (reason) {

    wrapper.setAttribute(
      "data-bs-original-title",
      reason
    );

    if (tooltip) {
      tooltip.setContent({
        ".tooltip-inner": reason
      });
    }

  } else {

    wrapper.setAttribute(
      "data-bs-original-title",
      "Add another tool"
    );

    if (tooltip) {
      tooltip.setContent({
        ".tooltip-inner": "Add another tool"
      });
    }
  }
}

// #region ========== ADD ROW (STANDALONE) ==========
function setupStandaloneRow(row, isInitial) {
	 console.log("Setting up row:", row);
  const select = row.querySelector(".standalone-tool-select");
  const panel = row.querySelector(".standalone-tool-panel");
  const hours = row.querySelector(".standalone-hours");
  const minutes = row.querySelector(".standalone-minutes");
  const vibration = row.querySelector(".standalone-vibration");
  
  vibration.addEventListener("input", () => {
  calculateRow(row);
  updateOutput();
  updateBreakdown();
  updateAddButton();
});
  
 console.log("select =", select);
    console.log("panel =", panel);
if (!isInitial) {
  row.classList.add("compact");
}

  if (!select || !panel || !hours || !minutes || !vibration) {
    console.error("Standalone row missing elements", row);
    return;
  }

  const toolData = window.getToolLibrary ? window.getToolLibrary() : [];

  buildDropdown(panel, toolData, row);

 select.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  const isOpen = panel.classList.contains("open");

  document.querySelectorAll(".tool-panel").forEach(p => {
    p.classList.remove("open");
    p.style.display = "none";
  });

  if (!isOpen) {
    panel.classList.add("open");
    panel.style.display = "block";
  }
});

  panel.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  [hours, minutes].forEach(input => {
    input.addEventListener("input", () => {
      calculateRow(row);
      updateOutput();
      updateBreakdown();
	  updateAddButton();
    });
  });
  
  const removeBtn = row.querySelector('[data-role="remove-row"]');

if (removeBtn) {
  removeBtn.addEventListener("click", () => {

    const rows = document.querySelectorAll(
      ".standalone-calculator-row"
    );

    if (rows.length <= 1) {
      return;
    }

    row.remove();
	updateDeleteButtons();
    updateOutput();
    updateBreakdown();
	updateAddButton();
  });
}
  
}

function addStandaloneRow(isInitial = false) {
  const container = document.getElementById("standaloneContainer");
console.log("addStandaloneRow called, isInitial =", isInitial);
  const templateId = isInitial
    ? "standaloneToolTemplateFull"
    : "standaloneToolTemplateCompact";

  console.log("readyState:", document.readyState);
  console.log("templateId:", templateId);
  console.log("template:", document.getElementById(templateId));

  const template = document.getElementById(templateId);

console.log("templateId =", templateId);
console.log("template =", template);

if (!template) {
  throw new Error(`Template not found: ${templateId}`);
}

const clone = template.content.cloneNode(true);

  container.appendChild(clone);

  const rows = container.querySelectorAll(".standalone-calculator-row");
  const newRow = rows[rows.length - 1];

  if (!isInitial) {
    newRow.classList.add("compact");
  }

  console.log("New row classes:", newRow.className);

  setupStandaloneRow(newRow, isInitial);
 
}
// #endregion

function updateDeleteButtons() {
  const rows = document.querySelectorAll(
    ".standalone-calculator-row"
  );

  rows.forEach(row => {
    const btn = row.querySelector(
      '[data-role="remove-row"]'
    );

    if (!btn) return;

    btn.style.display =
      rows.length <= 1 ? "none" : "";
  });
}

// #region ========== BUILD DROPDOWN ==========
 function buildDropdown(panel, tools, row) {
  panel.innerHTML = "";

  // =========================
  // SEARCH BOX
  // =========================
  const searchWrap = document.createElement("div");
  searchWrap.className = "tool-search-wrap";

  const search = document.createElement("input");
  search.className = "tool-search";
  search.placeholder = "Search...";

  searchWrap.appendChild(search);
  panel.appendChild(searchWrap);

  search.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();

    panel.querySelectorAll(".tool-option").forEach(opt => {
      opt.style.display = opt.textContent.toLowerCase().includes(val)
        ? "block"
        : "none";
    });
  });

  // =========================
  // GROUP TOOLS
  // =========================
  const grouped = {};
  const manual = [];

  tools.forEach(t => {
    if (t.category?.toLowerCase() === "manual") {
      manual.push(t);
      return;
    }

    const mfr = (t.manufacturer || "Other").trim(); // KEEP CASE AS-IS
    const type = (t.type || "Other").trim();

    grouped[mfr] ??= {};
    grouped[mfr][type] ??= [];
    grouped[mfr][type].push(t);
  });

  // =========================
  // MANUAL TOOLS
  // =========================
  manual.forEach(tool => {
    const opt = document.createElement("div");
    opt.className = "tool-option";
    opt.textContent = tool.name;

opt.addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();

  const customName = prompt("Enter tool name or model");

  if (!customName) return;

  const label = row.querySelector(".standalone-tool-select");
  const vibration = row.querySelector(".standalone-vibration");

  label.textContent = customName;

  row.dataset.toolName = customName;
  row.dataset.isManual = "true";

  vibration.value = "";
  vibration.readOnly = false;

  panel.classList.remove("open");
  panel.style.display = "none";

  calculateRow(row);
  updateOutput();
  updateBreakdown();
  updateAddButton();
});

    panel.appendChild(opt);
  });

  // =========================
  // MANUFACTURERS + TYPES
  // =========================
  Object.keys(grouped)
    .sort()
    .forEach(mfr => {

      const mfrDisplay = (mfr || "").trim(); // EXACT CASE

      const mfrHeader = document.createElement("div");
      mfrHeader.className = "tool-heading";
      mfrHeader.dataset.manufacturer = mfrDisplay;

	const textSpan = document.createElement("span");
	textSpan.className = "mfr-text";
	textSpan.textContent = mfrDisplay;
	
	mfrHeader.appendChild(textSpan);
	
	const img = document.createElement("img");
	img.className = "manufacturer-logo";
	img.alt = mfrDisplay;
	img.src = `./Assets/Logos/${mfrDisplay}.svg`;
	img.loading = "lazy";
	
	mfrHeader.classList.add("no-logo");
	img.onload = () => {
		mfrHeader.classList.remove("no-logo");
		mfrHeader.classList.add("has-logo");
	}
	
	img.onerror = () => {
		mfrHeader.classList.remove("has-logo");
		mfrHeader.classList.add("no-logo");
	};

	mfrHeader.appendChild(img);
	
      panel.appendChild(mfrHeader);

      Object.keys(grouped[mfr])
        .sort()
        .forEach(type => {

          const typeHeader = document.createElement("div");
          typeHeader.className = "tool-type-heading";
          typeHeader.textContent = type;

          panel.appendChild(typeHeader);

          grouped[mfr][type]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(tool => {

              const opt = document.createElement("div");
              opt.className = "tool-option";
              opt.textContent = tool.name;

              opt.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();

                const label = row.querySelector(".standalone-tool-select");
                if (label) label.textContent = tool.name;

const vibration = row.querySelector(".standalone-vibration");
const magnitude = tool.vibration || tool.magnitude || 0;

row.dataset.toolName = tool.name;
row.dataset.isManual = "false";
row.dataset.manufacturer = mfrDisplay;

if (vibration) {
  vibration.value = magnitude;
  vibration.readOnly = true;
}

                panel.classList.remove("open");
                panel.style.display = "none";

                calculateRow(row);
                updateOutput();
                updateBreakdown();
				updateAddButton();
              });

              panel.appendChild(opt);
            });
        });
    });
}

// #endregion



// #region ========== CALCULATE ROW ==========
function calculateRow(row) {
  
  let mag = 0;
  let h = 0;
  let m = 0;

    // Read standalone inputs
    mag = parseFloat(
  row.querySelector(".standalone-vibration")?.value
) || 0;
    h = parseFloat(row.querySelector(".standalone-hours")?.value) || 0;
    m = parseFloat(row.querySelector(".standalone-minutes")?.value) || 0;


  const totalMinutes = (h * 60) + m;

if (mag > 0 && totalMinutes > 0) {

  const partialPoints =
    2 * Math.pow(mag, 2) * (totalMinutes / 60);

  const partialMs =
    mag * Math.sqrt(totalMinutes / 480);

  row.dataset.mag = mag;
  row.dataset.minutes = totalMinutes;
  row.dataset.points = partialPoints;
  row.dataset.a8 = partialMs;
  updateToolStatus(row);

} else {

  row.dataset.mag = 0;
  row.dataset.minutes = 0;
  row.dataset.points = 0;
  row.dataset.a8 = 0;
  updateToolStatus(row);
}

  if (typeof updateBreakdown === "function") updateBreakdown();
  if (typeof updateOutput === "function") updateOutput();
}
// #endregion

// #region ========== FORMAT TIME ==========
function formatTime(mins) {
  if (!mins || mins <= 0) return "";

  if (mins >= 1440) { return ">24 hr"; }

  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);

  if (h > 0 && m > 0) { return `${h} hr ${m} min`; }

  if (h > 0) { return `${h} hr`; }

  return `${m} min`;
}
// #endregion

// #region ========== GET EXPOSURE BAND ==========
function getExposureBand(a8) {
  if (a8 >= 5.0) {
    return "danger";
  }

  if (a8 >= 4.0) {
    return "alert";
  }

  if (a8 >= 2.5) {
    return "warning";
  }

  if (a8 >= 2.0) {
    return "caution";
  }

  return "safe";
}
// #endregion


function updateToolStatus(row) {

  const indicator =
    row.querySelector(".tool-status-indicator");

  if (!indicator) return;

  indicator.classList.remove(
    "inactive",
    "safe",
    "caution",
    "warning",
    "alert",
    "danger"
  );

  const a8 =
    parseFloat(row.dataset.a8) || 0;

  if (a8 <= 0) {
    indicator.classList.add("inactive");
    return;
  }

  indicator.classList.add(
    getExposureBand(a8)
  );
}
// #region ========== UPDATE OUTPUT ==========
function updateOutput() {

  const output =
    document.querySelector("#output .result")
    || document.getElementById("output");

  if (!output) return;

  const resultsHeading =
    document.getElementById("results-heading");

  let totalPoints = 0;
  let totalMinutes = 0;

const queryRows = Array.from(
    document.querySelectorAll(".standalone-calculator-row")
);

  queryRows.forEach(row => {

  const pts = parseFloat(row.dataset.points) || 0;
  const mins = parseFloat(row.dataset.minutes) || 0;

  if (pts > 0 && mins > 0) {
    totalPoints += pts;
    totalMinutes += mins;
  }

});

  const icon = document.getElementById("result-icon");
  const title = document.getElementById("result-title");
  const exposure = document.getElementById("result-exposure");
  const detail = document.getElementById("result-detail");
  const action = document.getElementById("result-action");
  const debug = document.getElementById("debug-band");

  if (
    !icon ||
    !title ||
    !exposure ||
    !detail ||
    !action
  ) {
    return;
  }

  if (!totalPoints || totalMinutes === 0) {
    output.classList.remove("visible", "pulse", "band-safe", "band-caution", "band-warning", "band-alert", "band-danger");

    if (resultsHeading) {
      resultsHeading.classList.add("d-none");
    }

    title.textContent = "";
    exposure.textContent = "";
    detail.textContent = "";
    action.textContent = "";
    icon.innerHTML = "";
    if (debug) debug.textContent = "";
    return;
  }

  output.classList.add("visible");

  if (resultsHeading) {
    resultsHeading.classList.remove("d-none");
  }

  const a8 = Math.sqrt(totalPoints / 400) * 5;

  exposure.innerHTML = `
    ${Math.round(totalPoints)} points


    | ${a8.toFixed(1)} m/s² A(8)
  `;

  const exposureLevel = getExposureBand(a8);

  output.classList.remove("band-safe", "band-caution", "band-warning", "band-alert", "band-danger");
  output.classList.add(`band-${exposureLevel}`);

  const hseText = {
    safe: {
      title: "Daily vibration exposure within safe limits",
      detail: "The calculated daily vibration exposure is below the Exposure Action Value (EAV).",
      action: "No specific action is required, but exposure should be kept as low as reasonably practicable."
    },
    caution: {
      title: "Exposure increasing",
      detail: "Daily vibration exposure is elevated and approaching the Exposure Action Value (EAV).",
      action: "Exposure should be monitored and reduced where reasonably practicable."
    },
    warning: {
      title: "Exposure Action Value exceeded",
      detail: "The daily vibration exposure exceeds the Exposure Action Value (EAV).",
      action: "Employers must introduce technical or organisational measures to reduce exposure."
    },
    alert: {
      title: "Exposure approaching the legal limit",
      detail: "The daily vibration exposure is approaching the Exposure Limit Value (ELV).",
      action: "Immediate action should be taken to reduce exposure and prevent the limit being exceeded."
    },
    danger: {
      title: "Exposure Limit Value exceeded",
      detail: "The daily vibration exposure exceeds the legal Exposure Limit Value (ELV).",
      action: "Work must be stopped immediately and exposure reduced."
    }
  };

  const icons = {
    safe: "./Assets/Icons/Status/Safe.svg",
    caution: "./Assets/Icons/Status/Caution.svg",
    warning: "./Assets/Icons/Status/Warning.svg",
    alert: "./Assets/Icons/Status/Alert.svg",
    danger: "./Assets/Icons/Status/Danger.svg"
  };

  icon.innerHTML = `
    <img src="${icons[exposureLevel]}" class="result-status-icon" alt="${exposureLevel}">
  `;

  title.textContent = hseText[exposureLevel].title;
  detail.textContent = hseText[exposureLevel].detail;
  action.textContent = hseText[exposureLevel].action;

  //if (debug) {
 //   debug.textContent = `DEBUG: points = ${Math.round(totalPoints)} | a8 = ${a8.toFixed(2)} | level = ${exposureLevel}`;
 // }

  output.classList.remove("pulse");
  if (exposureLevel !== "safe" && exposureLevel !== "caution") {
    void output.offsetWidth;
    output.classList.add("pulse");
  }
}
// #endregion

// #region ========== UPDATE BREAKDOWN ==========
function updateBreakdown() {

  const wrapper =
    document.getElementById("tool-breakdown-wrapper");

  const container =
    document.getElementById("tool-breakdown");

  if (!wrapper || !container) return;

  container.innerHTML = ' <label class="input-group-text text-bold section-header mb-3">PER-TOOL BREAKDOWN</label>';

  let hasData = false;

const queryRows = Array.from(
    document.querySelectorAll(".standalone-calculator-row")
);

  queryRows.forEach(row => {

    const model = row.dataset.toolName;

    if (!model || model === "Select tool") {
      return;
    }

    const tools =
      window.getToolLibrary
        ? window.getToolLibrary()
        : [];

    const toolData = tools.find(
      t => t.name.trim() === model.trim()
    );

    const manufacturer =
      toolData?.manufacturer || "";

    const type =
      toolData?.type || "";

    let displayName = model;
	
	if (toolData) {
  displayName =
    `${toolData.manufacturer} ${toolData.name} (${toolData.type})`;
}

    const icon =
      toolData?.icon
      || "./Assets/Icons/Tools/Default.svg";

    let pts = 0;
    let a8 = 0;
    let mag = 0;
    let h = 0;
    let m = 0;

      mag = parseFloat(row.querySelector(".standalone-vibration")?.value) || 0;
      h = parseFloat(row.querySelector(".standalone-hours")?.value) || 0;
      m = parseFloat(row.querySelector(".standalone-minutes")?.value) || 0;
      
      const totalMins = (h * 60) + m;
      pts = mag > 0 && totalMins > 0 ? (2 * Math.pow(mag, 2) * (totalMins / 60)) : 0;
      a8 = mag > 0 && totalMins > 0 ? (mag * Math.sqrt(totalMins / 480)) : 0;

    if (isNaN(pts) || pts <= 0) return;
    if ((h + m) === 0) return;

    hasData = true;

    const exposureLevel =
      getExposureBand(a8);

    const bandClass =
      `band-${exposureLevel}`;

    const percentELV =
      (pts / 400) * 100;

    const barWidth =
      Math.min(percentELV, 100);

    const div = document.createElement("div");

    div.className =
      `alert ${bandClass} breakdown-row mb-3`;

    div.innerHTML = `
      <div class="row g-0 align-items-center">

        <div class="col-auto pe-3 breakdown-icon">

          <img
            src="${icon}"
            width="64"
            height="64"
          >

        </div>

        <div class="col">

          <h5 class="breakdown-title mb-2">
            ${displayName}
          </h5>

          <div
            class="progress mb-2"
            role="progressbar"
            aria-valuenow="${barWidth}"
            aria-valuemin="0"
            aria-valuemax="100"
          >

            <div
              class="progress-bar progress-bar-striped"
              style="width:${barWidth}%"
            ></div>

          </div>

          <div class="breakdown-values">

            ${pts.toFixed(0)} pts
            (${percentELV.toFixed(1)}% ELV) | A(8) = ${a8.toFixed(1)} m/s²

          </div>

        </div>

      </div>
    `;

    container.appendChild(div);

  });

  if (hasData) {
    wrapper.classList.remove("d-none");
  } else {
    wrapper.classList.add("d-none");
  }

}
// #endregion
function getIncompleteReason(row) {

  if (!row) {
    return "Complete the current tool.";
  }

  if (!row.dataset.toolName) {
    return "Select a tool first.";
  }

  const vibration =
    parseFloat(
      row.querySelector(".standalone-vibration")?.value
    ) || 0;

  if (vibration <= 0) {
    return "Enter a vibration value.";
  }

  const hours =
    parseFloat(
      row.querySelector(".standalone-hours")?.value
    ) || 0;

  const minutes =
    parseFloat(
      row.querySelector(".standalone-minutes")?.value
    ) || 0;

  if ((hours + minutes) <= 0) {
    return "Enter exposure time.";
  }

  return "";
}
;