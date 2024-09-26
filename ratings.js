const spreadsheetId = "1ydvb4lhemogHl50TYHS2gHwf_Ki3-YfOQhG15QcsIXA";
const apiKey = "AIzaSyBfoy9gpe6UHjolsmoi9kAx-iapdYs1-_U";
const flatRange = "FLAT!A2:O600"; // Adjust range if needed
const nhRange = "NH!A2:O600"; 
const flatOddsRange = "FLAT Odds!A2:D600"; // FLAT Odds tab range
const nhOddsRange = "NH Odds!A2:D600";     // NH Odds tab range

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

async function loadRatings(track, time) {
    try {
        // Fetch all relevant data
        const flatData = await fetchData(flatRange);
        const nhData = await fetchData(nhRange);
        const flatOddsData = await fetchData(flatOddsRange);
        const nhOddsData = await fetchData(nhOddsRange);

        console.log(`Fetched ${flatData.length} rows from FLAT`);
        console.log(`Fetched ${nhData.length} rows from NH`);
        console.log(`Fetched ${flatOddsData.length} rows from FLAT Odds`);
        console.log(`Fetched ${nhOddsData.length} rows from NH Odds`);

        // Filter ratings based on track and time
        const filteredRatings = flatData.concat(nhData).filter(row => {
            return row[0] === time && row[1] === track;
        });

        // Combine odds data into one array
        const combinedOdds = flatOddsData.concat(nhOddsData);

        // Filter odds based on track and time
        const getHorseOdds = (horseName) => {
            const oddsRow = combinedOdds.find(row => row[0] === time && row[1] === track && row[2] === horseName);
            return oddsRow ? oddsRow[3] : "N/A"; // Return odds or "N/A" if not found
        };

        console.log("Filtered Ratings:", filteredRatings);

        const ratingsBody = document.getElementById("ratingsBody");
        ratingsBody.innerHTML = ""; // Clear existing data

        if (filteredRatings.length > 0) {
            filteredRatings.forEach(row => {
                const newRow = document.createElement("tr");

                // Add ratings data
                row.forEach(value => {
                    const newCell = document.createElement("td");
                    newCell.textContent = value === undefined ? "" : value; // Leave blank if undefined
                    newRow.appendChild(newCell);
                });

                // Add My Odds column
                const horseName = row[2]; // Assuming the horse name is in the 3rd column (index 2)
                const myOddsCell = document.createElement("td");
                myOddsCell.textContent = getHorseOdds(horseName);
                newRow.appendChild(myOddsCell);

                ratingsBody.appendChild(newRow);
            });
        } else {
            const noDataRow = document.createElement("tr");
            const noDataCell = document.createElement("td");
            noDataCell.colSpan = 16; // Adjust according to your number of columns + My Odds column
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
