async function fetchData(url, tableId) {
    const response = await fetch(url);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.split(','));

    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = ''; // Clear existing data

    // Define the indices for the required columns
    const headers = rows[0];

    // Specify the required columns based on the new sheet structure
    const indices = {
        Jockey: headers.indexOf("Jockey"),
        '3Day_Runs': headers.indexOf("3Day_Runs"),
        '3Day_Wins': headers.indexOf("3Day_Wins"),
        '3Day_Places': headers.indexOf("3Day_Places"),
        '3Day_Win_Strike': headers.indexOf("3Day_Win_Strike"),
        '3Day_Place_Strike': headers.indexOf("3Day_Place_Strike"),
        '3Day_SP_ProfitLoss': headers.indexOf("3Day_SP_ProfitLoss"),
        '7Day_Runs': headers.indexOf("7Day_Runs"),
        '7Day_Wins': headers.indexOf("7Day_Wins"),
        '7Day_Places': headers.indexOf("7Day_Places"),
        '7Day_Win_Strike': headers.indexOf("7Day_Win_Strike"),
        '7Day_Place_Strike': headers.indexOf("7Day_Place_Strike"),
        '7Day_SP_ProfitLoss': headers.indexOf("7Day_SP_ProfitLoss"),
        '14Day_Runs': headers.indexOf("14Day_Runs"),
        '14Day_Wins': headers.indexOf("14Day_Wins"),
        '14Day_Places': headers.indexOf("14Day_Places"),
        '14Day_Win_Strike': headers.indexOf("14Day_Win_Strike"),
        '14Day_Place_Strike': headers.indexOf("14Day_Place_Strike"),
        '14Day_SP_ProfitLoss': headers.indexOf("14Day_SP_ProfitLoss"),
        '1YR_Runs': headers.indexOf("1YR_Runs"),
        '1YR_Wins': headers.indexOf("1YR_Wins"),
        '1YR_Places': headers.indexOf("1YR_Places"),
        '1YR_Win_Strike': headers.indexOf("1YR_Win_Strike"),
        '1YR_Place_Strike': headers.indexOf("1YR_Place_Strike"),
        '1YR_SP_ProfitLoss': headers.indexOf("1YR_SP_ProfitLoss")
    };

    // Filter and sort rows, then populate the table
    const filteredRows = rows.slice(1).filter(row => row[indices.Jockey] !== ""); // Ensure rows are not empty

    // Sort rows by 3Day_Runs and 3Day_Place_Strike descending
    filteredRows.sort((a, b) => {
        const runsDiff = parseInt(b[indices['3Day_Runs']]) - parseInt(a[indices['3Day_Runs']]);
        if (runsDiff !== 0) return runsDiff; // Sort by 3Day_Runs
        return parseFloat(b[indices['3Day_Place_Strike']]) - parseFloat(a[indices['3Day_Place_Strike']]); // Sort by 3Day_Place_Strike
    });

    filteredRows.forEach(row => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${row[indices.Jockey]}</td>
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
            <td>${row[indices['1YR_Runs']] || 'N/A'}</td>
            <td>${row[indices['1YR_Wins']] || 'N/A'}</td>
            <td>${row[indices['1YR_Places']] || 'N/A'}</td>
            <td>${row[indices['1YR_Win_Strike']] || 'N/A'}</td>
            <td>${row[indices['1YR_Place_Strike']] || 'N/A'}</td>
            <td>${row[indices['1YR_SP_ProfitLoss']] || 'N/A'}</td>
        `;
        tableBody.appendChild(newRow);
    });
}

// Fetch Jockey Data
const jockeyUrl = "https://docs.google.com/spreadsheets/d/1o404gnNxauWQjXDnMDHng3fUGe3U0HTx750AKPH8PXc/gviz/tq?tqx=out:csv&sheet=Sheet1"; // Update to your sheet URL
fetchData(jockeyUrl, "jockeyData");
