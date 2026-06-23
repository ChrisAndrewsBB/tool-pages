document.addEventListener("DOMContentLoaded", () => {

    const printButton = document.getElementById("generatePdf");

    if (printButton) {
        printButton.addEventListener("click", generatePdfReport);
    }

});

function generatePdfReport() {

    populatePdfReport();

    console.log("Exposure:",
        document.getElementById("pdfExposure").textContent);

    console.log("Status:",
        document.getElementById("pdfStatus").textContent);

    console.log("Action:",
        document.getElementById("pdfAction").textContent);


    window.print();

}

function populatePdfReport() {

    document.getElementById("pdfEmployee").textContent =
        document.getElementById("employeeName").value;

    document.getElementById("pdfSite").textContent =
        document.getElementById("siteName").value;

    document.getElementById("pdfDate").textContent =
        document.getElementById("startDate").value;

    const tbody = document.getElementById("pdfToolRows");

    tbody.innerHTML = "";

    let totalPoints = 0;

    const rows = document.querySelectorAll(
        "#standaloneContainer .standalone-calculator-row"
    );

console.log(
    document.querySelectorAll(
        "#standaloneContainer .standalone-calculator-row"
    ).length
);

    rows.forEach(row => {

        const tool =
            row.querySelector(".standalone-tool-select")?.textContent.trim() || "";

        const magnitude =
            row.querySelector(".standalone-vibration")?.value || "";

        const hours =
            parseFloat(
                row.querySelector(".standalone-hours")?.value
            ) || 0;

        const minutes =
            parseFloat(
                row.querySelector(".standalone-minutes")?.value
            ) || 0;

        if (!tool || tool === "Select tool") return;

        const triggerTime = `${hours}h ${minutes}m`;

        /*
         Replace this with your existing
         HAVS points calculation
        */
        const points = parseFloat(row.dataset.points) || 0;

	
        totalPoints += Number(points);

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${tool}</td>
            <td>${magnitude}</td>
            <td>${triggerTime}</td>
            <td>${points.toFixed(0)}</td>
        `;

        tbody.appendChild(tr);

    });
document.getElementById("pdfAction").textContent =
    document.getElementById("result-action").textContent;
    document.getElementById("pdfTotalPoints").textContent =
        document.getElementById("result-exposure").textContent;
		
		document.getElementById("pdfExposure").textContent =
    document.getElementById("result-exposure").textContent;

document.getElementById("pdfStatus").textContent =
    document.getElementById("result-title").textContent;
		
		
}