async function fetchData(url, tableId) {
    try {
        const response = await fetch(url);
        const data = await response.text();

        // Log the raw data to see what is being fetched
        console.log("Raw data:", data);

        // Split the CSV data into rows and clean up each cell
        const rows = data.split('\n').map(row => 
            row.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''))
        );

        // Log the first row (headers) and first few data rows to debug
        console.log("Headers:", rows[0]);
        console.log("First few rows:", rows.slice(1, 5));

        const tableBody = document.querySelector(`#${tableId} tbody`);
        if (!tableBody) {
            console.error(`Table body with id ${tableId} not found`);
            return;
        }
        tableBody.innerHTML = ''; // Clear existing data

        const headers = rows[0]; // This is the header row

        // Function to find column index, case insensitive and ignoring extra spaces
        const findColumnIndex = (columnName) => {
            const normalizedName = columnName.toLowerCase().replace(/\s+/g, ' ').trim();
            const index = headers.findIndex(header => 
                header.toLowerCase().replace(/\s+/g, ' ').trim() === normalizedName
            );
            if (index === -1) {
                console.error(`Column not found: ${columnName}`);
            }
            return index;
        };

        // Specify the required columns based on the sheet structure
        const columnNames = {
            Jockey: "Jockey",
            '3Day_Runs': "3-Day Runs",
            '3Day_Wins': "3-Day Wins",
            '3Day_Places': "3-Day Places",
            '3Day_Win_Strike': "3-Day Win Strike",
            '3Day_Place_Strike': "3-Day Place Strike",
            '3Day_SP_ProfitLoss': "3-Day SP Profit/Loss",
            '7Day_Runs': "7-Day Runs",
            '7Day_Wins': "7-Day Wins",
            '7Day_Places': "7-Day Places",
            '7Day_Win_Strike': "7-Day Win Strike",
            '7Day_Place_Strike': "7-Day Place Strike",
            '7Day_SP_ProfitLoss': "7-Day SP Profit/Loss",
            '14Day_Runs': "14-Day Runs",
            '14Day_Wins': "14-Day Wins",
            '14Day_Places': "14-Day Places",
            '14Day_Win_Strike': "14-Day Win Strike",
            '14Day_Place_Strike': "14-Day Place Strike",
            '14Day_SP_ProfitLoss': "14-Day SP Profit/Loss",
            '1Year_Runs': "1-Year Runs",
            '1Year_Wins': "1-Year Wins",
            '1Year_Places': "1-Year Places",
            '1Year_Win_Strike': "1-Year Win Strike",
            '1Year_Place_Strike': "1-Year Place Strike",
            '1Year_SP_ProfitLoss': "1-Year SP Profit/Loss"
        };

        const indices = {};
        for (const [key, columnName] of Object.entries(columnNames)) {
            indices[key] = findColumnIndex(columnName);
        }

        // Log found indices for debugging
        console.log("Found column indices:", indices);

        // Filter and sort rows
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
            const cells = Object.entries(indices).map(([key, index]) => {
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
