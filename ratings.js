const spreadsheetId = "1ydvb4lhemogHl50TYHS2gHwf_Ki3-YfOQhG15QcsIXA";
const apiKey = "AIzaSyBfoy9gpe6UHjolsmoi9kAx-iapdYs1-_U";
const flatRange = "FLAT!A2:O600"; // Adjusted range to include more rows
const nhRange = "NH!A2:O600"; // Adjusted range to include more rows
const flatOddsRange = "FLAT Odds!A2:D600"; // Adjusted range for odds
const nhOddsRange = "NH Odds!A2:D600"; // Adjusted range for odds

async function fetchData(range) {
    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get(url);
        return response.data.values || [];
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

function findOdds(oddsData, time, track, horseName) {
    // Look for matching odds for the time, track, and horse
    const oddsRow = oddsData.find(row => {
        return row[0] === time && row[1] === track && row[2] === horseName;
    });
    return oddsRow ? oddsRow[3] : "N/A"; // Return the odds, or "N/A" if not found
}

async function loadRatings(track, time) {
    try {
        const flatData = await fetchData(flatRange);
        const nhData = await fetchData(nhRange);
        const flatOddsData = await fetchData(flatOddsRange);
        const nhOddsData = await fetchData(nhOddsRange);

        console.log(`Fetched ${flatData.length} rows from FLAT`);
        console.log(`Fetched ${nhData.length} rows from NH`);
        console.log(`Fetched ${flatOddsData.length} rows from FLAT Odds`);
        console.log(`Fetched ${nhOddsData.length} rows from NH Odds`);

        // Combine odds data from both sheets
        const combinedOddsData = flatOddsData.concat(nhOddsData);

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

                // Add each data field
                row.forEach((value, index) => {
                    const newCell = document.createElement("td");
                    newCell.textContent = value === undefined ? "" : value; // Leave blank if undefined
                    newRow.appendChild(newCell);

                    // After the horse name (index 3), add "My Odds"
                    if (index === 3) { // Horse Name is the 4th column (index 3)
                        const oddsCell = document.createElement("td");
                        const myOdds = findOdds(combinedOddsData, time, track, value); // Get odds based on time, track, and horse name
                        oddsCell.textContent = myOdds;
                        newRow.appendChild(oddsCell); // Add "My Odds" column
                    }
                });

                ratingsBody.appendChild(newRow);
            });
        } else {
            const noDataRow = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.colSpan = 16; // Adjust according to your number of columns
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
