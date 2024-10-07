async function fetchData(url, tableId, isJockey = true) {
    try {
        const response = await fetch(url);
        const data = await response.text();

        console.log("Raw data:", data);

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

        console.log("Headers:", rows[0]);
        console.log("First few rows:", rows.slice(1, 5));

        const tableBody = document.querySelector(`#${tableId} tbody`);
        if (!tableBody) {
            console.error(`Table body with id ${tableId} not found`);
            return;
        }
        tableBody.innerHTML = '';

        const headers = rows[0].map(header => header.trim().toLowerCase()); // Normalize headers

        // Define the exact column names and the order we want to display them
        const displayColumns = isJockey 
            ? [
                "jockey",
                "3day_runs",
                "3day_wins",
                "3day_places",
                "3day_win_strike",
                "3day_place_strike",
                "3day_sp_profitloss",
                "7day_runs",
                "7day_wins",
                "7day_places",
                "7day_win_strike",
                "7day_place_strike",
                "7day_sp_profitloss",
                "14day_runs",
                "14day_wins",
                "14day_places",
                "14day_win_strike",
                "14day_place_strike",
                "14day_sp_profitloss",
                "1yr_runs",
                "1yr_wins",
                "1yr_places",
                "1yr_win_strike",
                "1yr_place_strike",
                "1yr_sp_profitloss"
            ]
            : [
                "trainer",
                "3day_runs",
                "3day_wins",
                "3day_places",
                "3day_win_strike",
                "3day_place_strike",
                "3day_sp_profitloss",
                "7day_runs",
                "7day_wins",
                "7day_places",
                "7day_win_strike",
                "7day_place_strike",
                "7day_sp_profitloss",
                "14day_runs",
                "14day_wins",
                "14day_places",
                "14day_win_strike",
                "14day_place_strike",
                "14day_sp_profitloss",
                "1yr_runs",
                "1yr_wins",
                "1yr_places",
                "1yr_win_strike",
                "1yr_place_strike",
                "1yr_sp_profitloss",
                "2yr_runs",
                "2yr_wins",
                "2yr_places",
                "2yr_win_strike",
                "2yr_place_strike",
                "2yr_sp_profitloss"
            ];

        // Create indices map
        const indices = {};
        displayColumns.forEach(columnName => {
            const index = headers.findIndex(header => header === columnName.toLowerCase());
            indices[columnName] = index;
            if (index === -1) {
                console.error(`Column not found: ${columnName}`);
            }
        });

        console.log("Found column indices:", indices);

        const filteredRows = rows.slice(1)
            .filter(row => row.length > indices.jockey && row[indices.jockey] && row[indices.jockey].trim() !== "");

        if (filteredRows.length === 0) {
            console.error("No valid data rows found");
            return;
        }

        filteredRows.sort((a, b) => {
            const aRuns = parseInt(a[indices['3day_runs']]) || 0;
            const bRuns = parseInt(b[indices['3day_runs']]) || 0;
            const runsDiff = bRuns - aRuns;
            if (runsDiff !== 0) return runsDiff;
            
            const aStrike = parseFloat(a[indices['3day_place_strike']]) || 0;
            const bStrike = parseFloat(b[indices['3day_place_strike']]) || 0;
            return bStrike - aStrike;
        });

        filteredRows.forEach(row => {
            const newRow = document.createElement('tr');
            const cells = displayColumns.map(columnName => {
                const index = indices[columnName];
                const value = index !== -1 && index < row.length ? row[index] : 'N/A';
                return `<td>${value.replace(/^"|"$/g, '') || 'N/A'}</td>`;
            });
            newRow.innerHTML = cells.join('');
            tableBody.appendChild(newRow);
        });

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
