async function fetchData(url, tableId, isJockey = true) {
    try {
        const response = await fetch(url);
        const data = await response.text();

        console.log("Raw data:", data); // Log the raw data

        // Split into rows and handle quoted values correctly
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

        console.log("All Rows:", rows); // Log all rows after parsing

        const tableBody = document.querySelector(`#${tableId} tbody`);
        if (!tableBody) {
            console.error(`Table body with id ${tableId} not found`);
            return;
        }
        tableBody.innerHTML = '';

        const headers = rows[0].map(header => header.trim().toLowerCase()); // Normalize headers
        console.log("Normalized Headers:", headers); // Log normalized headers

        // Define column names for each data type
        const jockeyColumns = [
            "jockey", "3day_runs", "3day_wins", "3day_places", "3day_win_strike",
            "3day_place_strike", "3day_sp_profitloss", "7day_runs", "7day_wins",
            "7day_places", "7day_win_strike", "7day_place_strike", "7day_sp_profitloss",
            "14day_runs", "14day_wins", "14day_places", "14day_win_strike",
            "14day_place_strike", "14day_sp_profitloss", "1yr_runs", "1yr_wins",
            "1yr_places", "1yr_win_strike", "1yr_place_strike", "1yr_sp_profitloss"
        ];

        const trainerColumns = [
            "trainer", "3day_runs", "3day_wins", "3day_places", "3day_win_strike",
            "3day_place_strike", "3day_sp_profitloss", "7day_runs", "7day_wins",
            "7day_places", "7day_win_strike", "7day_place_strike", "7day_sp_profitloss",
            "14day_runs", "14day_wins", "14day_places", "14day_win_strike",
            "14day_place_strike", "14day_sp_profitloss", "1yr_runs", "1yr_wins",
            "1yr_places", "1yr_win_strike", "1yr_place_strike", "1yr_sp_profitloss"
        ];

        const comboColumns = [
            "track", "jockey", "trainer", "allcombineruns", "allcombinewins",
            "allcombinestrike", "combinetrackruns", "combinetrackwins", "combinetrackstrike"
        ];

        // Create indices map for the current data type
        const indices = {};
        const currentColumns = isJockey ? jockeyColumns : trainerColumns;
        currentColumns.forEach(columnName => {
            const index = headers.findIndex(header => header === columnName.toLowerCase());
            indices[columnName] = index;
            if (index === -1) {
                console.error(`Column not found: ${columnName}`);
            }
        });

        console.log("Found column indices:", indices);

        // Check if there are any rows to process
        if (rows.length <= 1) {
            console.error("No data rows found in the CSV.");
            return;
        }

        const filteredRows = rows.slice(1).filter(row => {
            const name = isJockey ? row[indices['jockey']] : row[indices['trainer']];
            return name && name.trim() !== ""; // Ensure we have a valid name
        });

        console.log("Filtered Rows:", filteredRows); // Log filtered rows

        if (filteredRows.length === 0) {
            console.error("No valid data rows found");
            return;
        }

        // Add rows to the table
        filteredRows.forEach(row => {
            const newRow = document.createElement('tr');
            const cells = currentColumns.map(columnName => {
                const index = indices[columnName];
                const value = index !== -1 && index < row.length ? row[index] : 'N/A';
                return `<td>${value.replace(/^"|"$/g, '') || 'N/A'}</td>`;
            });
            newRow.innerHTML = cells.join('');
            tableBody.appendChild(newRow);
        });

        // Handle Combo Data separately
        if (!isJockey) {
            const comboIndices = {};
            const comboHeaders = headers; // Use already normalized headers

            comboColumns.forEach(columnName => {
                const index = comboHeaders.findIndex(header => header === columnName.toLowerCase());
                comboIndices[columnName] = index;
                if (index === -1) {
                    console.error(`Combo Column not found: ${columnName}`);
                }
            });

            console.log("Combo Found column indices:", comboIndices);

            // Directly add all rows from the combo data without filtering
            rows.slice(1).forEach(row => {
                const newRow = document.createElement('tr');
                const cells = comboColumns.map(columnName => {
                    const index = comboIndices[columnName];
                    const value = index !== -1 && index < row.length ? row[index] : 'N/A';
                    return `<td>${value.replace(/^"|"$/g, '') || 'N/A'}</td>`;
                });
                newRow.innerHTML = cells.join('');
                tableBody.appendChild(newRow);
            });
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fetch Jockey Data
const jockeyUrl = "https://docs.google.com/spreadsheets/d/1o404gnNxauWQjXDnMDHng3fUGe3U0HTx750AKPH8PXc/export?format=csv";
fetchData(jockeyUrl, "jockeyData", true);

// Fetch Trainer Data
const trainerUrl = "https://docs.google.com/spreadsheets/d/1CWFzSzLL6dN76SchoxaC94K5DZNskQZR08ikxhxpUW0/export?format=csv";
fetchData(trainerUrl, "trainerData", false);

// Fetch Trainer Jockey Combo Data
const comboUrl = "https://docs.google.com/spreadsheets/d/14T8vC9U5-S9x_EedGSe_FRq3Wh6xdssdCVp7dxI1nC4/export?format=csv"; // Ensure this URL is correct
fetchData(comboUrl, "comboData", false); // Use the correct table ID
