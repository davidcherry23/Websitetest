async function fetchData(url, tableId) {
    try {
        const response = await fetch(url);
        const data = await response.text();

        console.log("Raw data:", data);

        const rows = data.split('\n').map(row => 
            row.split('\t').map(cell => cell.trim().replace(/^["']|["']$/g, ''))
        );

        console.log("Headers:", rows[0]);
        console.log("First few rows:", rows.slice(1, 5));

        const tableBody = document.querySelector(`#${tableId} tbody`);
        if (!tableBody) {
            console.error(`Table body with id ${tableId} not found`);
            return;
        }
        tableBody.innerHTML = '';

        const headers = rows[0];

        // Define the exact column names and the order we want to display them
        const displayColumns = [
            "Jockey",
            "3Day_Runs",
            "3Day_Wins",
            "3Day_Places",
            "3Day_Win_Strike",
            "3Day_Place_Strike",
            "3Day_SP_ProfitLoss",
            "7Day_Runs",
            "7Day_Wins",
            "7Day_Places",
            "7Day_Win_Strike",
            "7Day_Place_Strike",
            "7Day_SP_ProfitLoss",
            "14Day_Runs",
            "14Day_Wins",
            "14Day_Places",
            "14Day_Win_Strike",
            "14Day_Place_Strike",
            "14Day_SP_ProfitLoss",
            "1YR_Runs",
            "1YR_Wins",
            "1YR_Places",
            "1YR_Win_Strike",
            "1YR_Place_Strike",
            "1YR_SP_ProfitLoss"
        ];

        // Create indices map
        const indices = {};
        displayColumns.forEach(columnName => {
            const index = headers.indexOf(columnName);
            indices[columnName] = index;
            if (index === -1) {
                console.error(`Column not found: ${columnName}`);
            }
        });

        console.log("Found column indices:", indices);

        const filteredRows = rows.slice(1)
            .filter(row => row.length > indices.Jockey && row[indices.Jockey] && row[indices.Jockey].trim() !== "");

        if (filteredRows.length === 0) {
            console.error("No valid data rows found");
            return;
        }

        filteredRows.sort((a, b) => {
            const aRuns = parseInt(a[indices['3Day_Runs']]) || 0;
            const bRuns = parseInt(b[indices['3Day_Runs']]) || 0;
            const runsDiff = bRuns - aRuns;
            if (runsDiff !== 0) return runsDiff;
            
            const aStrike = parseFloat(a[indices['3Day_Place_Strike']]) || 0;
            const bStrike = parseFloat(b[indices['3Day_Place_Strike']]) || 0;
            return bStrike - aStrike;
        });

        filteredRows.forEach(row => {
            const newRow = document.createElement('tr');
            const cells = displayColumns.map(columnName => {
                const index = indices[columnName];
                const value = index !== -1 && index < row.length ? row[index] : 'N/A';
                return `<td>${value || 'N/A'}</td>`;
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
fetchData(jockeyUrl, "jockeyData");
