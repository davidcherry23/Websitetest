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

        // Specify the required columns based on the sheet structure
        const indices = {
            Jockey: headers.indexOf("Jockey"),
            '3Day_Runs': headers.indexOf("3-Day Runs"),
            '3Day_Wins': headers.indexOf("3-Day Wins"),
            '3Day_Places': headers.indexOf("3-Day Places"),
            '3Day_Win_Strike': headers.indexOf("3-Day Win Strike"),
            '3Day_Place_Strike': headers.indexOf("3-Day Place Strike"),
            '3Day_SP_ProfitLoss': headers.indexOf("3-Day SP Profit/Loss"),
            '7Day_Runs': headers.indexOf("7-Day Runs"),
            '7Day_Wins': headers.indexOf("7-Day Wins"),
            '7Day_Places': headers.indexOf("7-Day Places"),
            '7Day_Win_Strike': headers.indexOf("7-Day Win Strike"),
            '7Day_Place_Strike': headers.indexOf("7-Day Place Strike"),
            '7Day_SP_ProfitLoss': headers.indexOf("7-Day SP Profit/Loss"),
            '14Day_Runs': headers.indexOf("14-Day Runs"),
            '14Day_Wins': headers.indexOf("14-Day Wins"),
            '14Day_Places': headers.indexOf("14-Day Places"),
            '14Day_Win_Strike': headers.indexOf("14-Day Win Strike"),
            '14Day_Place_Strike': headers.indexOf("14-Day Place Strike"),
            '14Day_SP_ProfitLoss': headers.indexOf("14-Day SP Profit/Loss"),
            '1Year_Runs': headers.indexOf("1-Year Runs"),
            '1Year_Wins': headers.indexOf("1-Year Wins"),
            '1Year_Places': headers.indexOf("1-Year Places"),
            '1Year_Win_Strike': headers.indexOf("1-Year Win Strike"),
            '1Year_Place_Strike': headers.indexOf("1-Year Place Strike"),
            '1Year_SP_ProfitLoss': headers.indexOf("1-Year SP Profit/Loss")
        };

        // Check if indices are correctly found
        console.log("Column indices:", indices);

        // Filter and sort rows
        const filteredRows = rows.slice(1).filter(row => row[indices.Jockey] && row[indices.Jockey].trim() !== "");

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
            newRow.innerHTML = `
                <td>${row[indices.Jockey] || 'N/A'}</td>
                <td>${row[indices['3Day_Runs']] || 'N/A'}</td>
                <td>${row[indices['3Day_Wins']] || 'N/A'}</td>
                <td>${row[indices['3Day_Places']] || 'N/A'}</td>
                <td>${row[indices['3Day_Win_Strike']] || 'N/A'}</td>
                <td>${row[indices['3Day_Place_Strike']] || 'N/A'}</td>
                <td>${row[indices['3Day_SP_ProfitLoss']] || 'N/A'}</td>
                <td>${row[indices['7Day_Runs']] || 'N/A'}</td>
                <td>${row[indices['7Day_Wins']] || 'N/A'}</td>
                <td>${row[indices['7Day_Places']] || 'N/A'}</td>
                <td>${row[indices['7Day_Win_Strike']] || 'N/A'}</td>
                <td>${row[indices['7Day_Place_Strike']] || 'N/A'}</td>
                <td>${row[indices['7Day_SP_ProfitLoss']] || 'N/A'}</td>
                <td>${row[indices['14Day_Runs']] || 'N/A'}</td>
                <td>${row[indices['14Day_Wins']] || 'N/A'}</td>
                <td>${row[indices['14Day_Places']] || 'N/A'}</td>
                <td>${row[indices['14Day_Win_Strike']] || 'N/A'}</td>
                <td>${row[indices['14Day_Place_Strike']] || 'N/A'}</td>
                <td>${row[indices['14Day_SP_ProfitLoss']] || 'N/A'}</td>
                <td>${row[indices['1Year_Runs']] || 'N/A'}</td>
                <td>${row[indices['1Year_Wins']] || 'N/A'}</td>
                <td>${row[indices['1Year_Places']] || 'N/A'}</td>
                <td>${row[indices['1Year_Win_Strike']] || 'N/A'}</td>
                <td>${row[indices['1Year_Place_Strike']] || 'N/A'}</td>
                <td>${row[indices['1Year_SP_ProfitLoss']] || 'N/A'}</td>
            `;
            tableBody.appendChild(newRow);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Fetch Jockey Data
const jockeyUrl = "https://docs.google.com/spreadsheets/d/1o404gnNxauWQjXDnMDHng3fUGe3U0HTx750AKPH8PXc/export?format=csv";
fetchData(jockeyUrl, "jockeyData");
