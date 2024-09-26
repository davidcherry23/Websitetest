const spreadsheetId = "1ydvb4lhemogHl50TYHS2gHwf_Ki3-YfOQhG15QcsIXA";
const apiKey = "AIzaSyBfoy9gpe6UHjolsmoi9kAx-iapdYs1-_U";
const flatRange = "FLAT!A2:O600"; // Adjusted range to include more rows
const nhRange = "NH!A2:O600"; // Adjusted range to include more rows

async function fetchData(range) {
    try {
        const url = "https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}";
        const response = await axios.get(url);
        return response.data.values || [];
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

async function loadRatings(track, time) {
    try {
        const flatData = await fetchData(flatRange);
        const nhData = await fetchData(nhRange);

        console.log(Fetched ${flatData.length} rows from FLAT);
        console.log(Fetched ${nhData.length} rows from NH);

        // Filter data based on track and time
        const filteredRatings = flatData.concat(nhData).filter(row => {
            return row[0] === time && row[1] === track;
        });

        console.log("Filtered Ratings:", filteredRatings);

        const ratingsBody = document.getElementById("ratingsBody");
        ratingsBody.innerHTML = ""; // Clear existing data

        if (filteredRatings.length > 0) {
            filteredRatings.forEach(row => {
                const newRow = document.createElement("tr");
                row.forEach(value => {
                    const newCell = document.createElement("td");
                    newCell.textContent = value === undefined ? "" : value; // Leave blank if undefined
                    newRow.appendChild(newCell);
                });
                ratingsBody.appendChild(newRow);
            });
        } else {
            const noDataRow = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.colSpan = 15; // Adjust according to your number of columns
            noDataCell.textContent = "No ratings available.";
            noDataRow.appendChild(noDataCell);
            ratingsBody.appendChild(noDataRow);
        }
    } catch (error) {
        console.error("Error loading ratings:", error);
    }
}

// Ensure loadRatings is called with appropriate arguments when the page loads
window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const track = urlParams.get('track');
    const time = urlParams.get('time');
    
    if (track && time) {
        loadRatings(track, time);
    } else {
        console.error("Track or Time parameter is missing in the URL.");
    }
};
