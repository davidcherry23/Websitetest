async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        console.log("Raw data:", data);

        const rows = data.split('\n').map(row => {
            const cells = [];
            let currentCell = '';
            let withinQuotes = false;

            for (let char of row) {
                if (char === '"') {
                    withinQuotes = !withinQuotes;
                } else if (char === ',' && !withinQuotes) {
                    cells.push(currentCell.trim());
                    currentCell = '';
                } else {
                    currentCell += char;
                }
            }
            cells.push(currentCell.trim());
            return cells;
        });

        console.log("All Rows:", rows);
        return rows;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

function processJockeyData(rows, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) {
        console.error(`Table body with id ${tableId} not found`);
        return;
    }
    tableBody.innerHTML = '';

    const headers = rows[0].map(header => header.trim().toLowerCase());
    console.log("Normalized Jockey Headers:", headers);

    const jockeyColumns = [
        "jockey", "3day_runs", "3day_wins", "3day_places", "3day_win_strike",
        "3day_place_strike", "3day_sp_profitloss", "7day_runs", "7day_wins",
        "7day_places", "7day_win_strike", "7day_place_strike", "7day_sp_profitloss",
        "14day_runs", "14day_wins", "14day_places", "14day_win_strike",
        "14day_place_strike", "14day_sp_profitloss", "1yr_runs", "1yr_wins",
        "1yr_places", "1yr_win_strike", "1yr_place_strike", "1yr_sp_profitloss"
    ];

    const indices = {};
    jockeyColumns.forEach(columnName => {
        const index = headers.findIndex(header => header === columnName.toLowerCase());
        indices[columnName] = index;
        if (index === -1) {
            console.error(`Jockey column not found: ${columnName}`);
        }
    });

    console.log("Found jockey column indices:", indices);

    const filteredRows = rows.slice(1).filter(row => {
        const name = row[indices['jockey']];
        return name && name.trim() !== "";
    });

    filteredRows.forEach(row => {
        const newRow = document.createElement('tr');
        const cells = jockeyColumns.map(columnName => {
            const index = indices[columnName];
            const value = index !== -1 && index < row.length ? row[index] : 'N/A';
            return `<td>${value.replace(/^"|"$/g, '') || 'N/A'}</td>`;
        });
        newRow.innerHTML = cells.join('');
        tableBody.appendChild(newRow);
    });
}

function processTrainerData(rows, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) {
        console.error(`Table body with id ${tableId} not found`);
        return;
    }
    tableBody.innerHTML = '';

    const headers = rows[0].map(header => header.trim().toLowerCase());
    console.log("Normalized Trainer Headers:", headers);

    const trainerColumns = [
        "trainer", "3day_runs", "3day_wins", "3day_places", "3day_win_strike",
        "3day_place_strike", "3day_sp_profitloss", "7day_runs", "7day_wins",
        "7day_places", "7day_win_strike", "7day_place_strike", "7day_sp_profitloss",
        "14day_runs", "14day_wins", "14day_places", "14day_win_strike",
        "14day_place_strike", "14day_sp_profitloss", "1yr_runs", "1yr_wins",
        "1yr_places", "1yr_win_strike", "1yr_place_strike", "1yr_sp_profitloss"
    ];

    const indices = {};
    trainerColumns.forEach(columnName => {
        const index = headers.findIndex(header => header === columnName.toLowerCase());
        indices[columnName] = index;
        if (index === -1) {
            console.error(`Trainer column not found: ${columnName}`);
        }
    });

    console.log("Found trainer column indices:", indices);

    const filteredRows = rows.slice(1).filter(row => {
        const name = row[indices['trainer']];
        return name && name.trim() !== "";
    });

    filteredRows.forEach(row => {
        const newRow = document.createElement('tr');
        const cells = trainerColumns.map(columnName => {
            const index = indices[columnName];
            const value = index !== -1 && index < row.length ? row[index] : 'N/A';
            return `<td>${value.replace(/^"|"$/g, '') || 'N/A'}</td>`;
        });
        newRow.innerHTML = cells.join('');
        tableBody.appendChild(newRow);
    });
}

function processComboData(rows, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) {
        console.error(`Table body with id ${tableId} not found`);
        return;
    }
    tableBody.innerHTML = '';

    const headers = rows[0].map(header => header.trim().toLowerCase());
    console.log("Normalized Combo Headers:", headers);

    const comboColumns = [
        "track", "jockey", "trainer", "allcombineruns", "allcombinewins",
        "allcombinestrike", "combinetrackruns", "combinetrackwins", "combinetrackstrike"
    ];

    const indices = {};
    comboColumns.forEach(columnName => {
        const index = headers.findIndex(header => header === columnName.toLowerCase());
        indices[columnName] = index;
        if (index === -1) {
            console.error(`Combo column not found: ${columnName}`);
        }
    });

    console.log("Found combo column indices:", indices);

    rows.slice(1).forEach(row => {
        const newRow = document.createElement('tr');
        const cells = comboColumns.map(columnName => {
            const index = indices[columnName];
            const value = index !== -1 && index < row.length ? row[index] : 'N/A';
            return `<td>${value.replace(/^"|"$/g, '') || 'N/A'}</td>`;
        });
        newRow.innerHTML = cells.join('');
        tableBody.appendChild(newRow);
    });
}

async function main() {
    // Fetch and process Jockey Data
    const jockeyUrl = "https://docs.google.com/spreadsheets/d/1o404gnNxauWQjXDnMDHng3fUGe3U0HTx750AKPH8PXc/export?format=csv";
    const jockeyData = await fetchData(jockeyUrl);
    if (jockeyData) {
        processJockeyData(jockeyData, "jockeyData");
    }

    // Fetch and process Trainer Data
    const trainerUrl = "https://docs.google.com/spreadsheets/d/1CWFzSzLL6dN76SchoxaC94K5DZNskQZR08ikxhxpUW0/export?format=csv";
    const trainerData = await fetchData(trainerUrl);
    if (trainerData) {
        processTrainerData(trainerData, "trainerData");
    }

    // Fetch and process Trainer Jockey Combo Data
    const comboUrl = "https://docs.google.com/spreadsheets/d/14T8vC9U5-S9x_EedGSe_FRq3Wh6xdssdCVp7dxI1nC4/export?format=csv";
    const comboData = await fetchData(comboUrl);
    if (comboData) {
        processComboData(comboData, "comboData");
    }
}

// Run the main function
main();
