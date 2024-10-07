async function fetchData(url, tableId) {
    try {
        const response = await fetch(url);
        const data = await response.text();

        // Log the raw data to see what is being fetched
        console.log("Raw data:", data);

        const rows = data.split('\n').map(row => 
            row.split(',').map(cell => cell.trim())
        );

        // Log the first row (headers) and first few data rows to debug
        console.log("Headers:", rows[0]);
        console.log("First few rows:", rows.slice(1, 5));

        const tableBody = document.querySelector(`#${tableId} tbody`);
        tableBody.innerHTML = ''; // Clear existing data

        const headers = rows[0]; // This is the header row

        // Create a function to safely get column index
        const getColumnIndex = (columnName) => {
            const index = headers.findIndex(header => 
                header.toLowerCase().replace(/\s+/g, '') === columnName.toLowerCase().replace(/\s+/g, '')
            );
            if (index === -1) {
                console.warn(`Column ${columnName} not found`);
            }
            return index;
        };

        // Define column mappings
        const columnMappings = {
            jockey: getColumnIndex('Jockey'),
            periods: ['3Day', '7Day', '14Day', '1YR'],
            metrics: {
                'Runs': 'runs',
                'Wins': 'wins',
                'Places': 'places',
                'Win%': 'winStrike',
                'Place%': 'placeStrike',
                'P/L': 'profitLoss'
            }
        };

        // Create indices object dynamically
        const indices = {
            Jockey: columnMappings.jockey
        };

        // Populate indices for all time periods and metrics
        columnMappings.periods.forEach(period => {
            Object.entries(columnMappings.metrics).forEach(([sheetHeader, codeKey]) => {
                const fullColumnName = `${period}_${codeKey}`;
                indices[fullColumnName] = getColumnIndex(`${period} ${sheetHeader}`);
            });
        });

        // Log found indices for debugging
        console.log("Found column indices:", indices);

        // Filter and sort rows
        const filteredRows = rows.slice(1)
            .filter(row => row[indices.Jockey] && row[indices.Jockey].trim() !== "");

        filteredRows.sort((a, b) => {
            const aRuns = parseInt(a[indices['3Day_runs']]) || 0;
            const bRuns = parseInt(b[indices['3Day_runs']]) || 0;
            const runsDiff = bRuns - aRuns;
            if (runsDiff !== 0) return runsDiff;
            
            const aStrike = parseFloat(a[indices['3Day_placeStrike']]) || 0;
            const bStrike = parseFloat(b[indices['3Day_placeStrike']]) || 0;
            return bStrike - aStrike;
        });

        filteredRows.forEach(row => {
            const newRow = document.createElement('tr');
            
            // Create table cells
            let cells = [`<td>${row[indices.Jockey]}</td>`];
            
            columnMappings.periods.forEach(period => {
                Object.values(columnMappings.metrics).forEach(metric => {
                    const index = indices[`${period}_${metric}`];
                    cells.push(`<td>${index !== -1 && row[index] ? row[index] : 'N/A'}</td>`);
                });
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
