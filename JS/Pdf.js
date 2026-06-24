document.addEventListener("DOMContentLoaded", () => {

    const printButton = document.getElementById("generatePdf");

    if (printButton) {
        printButton.addEventListener("click", generatePdfReport);
    }

});

function generatePdfReport() {

    console.log("generatePdfReport called");

    populatePdfReport();

    alert("about to print");

    window.print();

    console.log("window.print returned");
}

function populatePdfReport() {

    // Work details

    document.getElementById("pdfEmployee").textContent =
        document.getElementById("employeeName").value;

    document.getElementById("pdfSite").textContent =
        document.getElementById("siteName").value;

    document.getElementById("pdfDate").textContent =
        document.getElementById("startDate").value;


    // Tool table

    const tbody = document.getElementById("pdfToolRows");

    tbody.innerHTML = "";

    let totalPoints = 0;

    const rows = document.querySelectorAll(
        "#standaloneContainer .standalone-calculator-row"
    );

    rows.forEach(row => {

        const tool =
            row.querySelector(".standalone-tool-select")
                ?.textContent
                .trim() || "";

        const magnitude =
            row.querySelector(".standalone-vibration")
                ?.value || "";

        const hours =
            parseFloat(
                row.querySelector(".standalone-hours")
                    ?.value
            ) || 0;

        const minutes =
            parseFloat(
                row.querySelector(".standalone-minutes")
                    ?.value
            ) || 0;

        if (!tool || tool === "Select tool") return;

        const triggerTime = `${hours}h ${minutes}m`;

        const points =
            Number(row.dataset.points) || 0;

        totalPoints += points;

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${tool}</td>
            <td>${magnitude}</td>
            <td>${triggerTime}</td>
            <td>${Math.round(points)}</td>
        `;

        tbody.appendChild(tr);

    });

    document.getElementById("pdfTotalPoints").textContent =
        Math.round(totalPoints);


    // Result summary

    document.getElementById("pdfExposure").textContent =
        document.getElementById("result-exposure").textContent;

    document.getElementById("pdfStatus").textContent =
        document.getElementById("result-title").textContent;

    document.getElementById("pdfDetail").textContent =
        document.getElementById("result-detail").textContent;

    document.getElementById("pdfAction").textContent =
        document.getElementById("result-action").textContent;


    // Copy result band styling

    const output =
        document.getElementById("output");

    const pdfResult =
        document.getElementById("pdfResult");

    pdfResult.className = output.className;


    // Copy status icon if present

    const sourceIcon =
        document.getElementById("result-icon");

    const targetIcon =
        document.getElementById("pdfResultIcon");

    if (sourceIcon && targetIcon) {
        targetIcon.innerHTML = sourceIcon.innerHTML;
    }

}