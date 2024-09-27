// Define fetchData function
async function fetchData(sheetName) {
    const range = `${sheetName}!A1:Z`; // Fetch all rows in the range
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    try {
        const response = await axios.get(url);
        console.log(`Fetched ${response.data.values.length} rows from ${sheetName}`);
        return response.data.values; // Return the rows of your sheet
    } catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array on error
    }
}

// Search/Filter Feature
const searchBox = document.getElementById('searchBox');
searchBox.addEventListener('input', function() {
    const searchTerm = searchBox.value.toLowerCase();
    const rows = document.querySelectorAll('#raceList tr');
    rows.forEach(row => {
        const track = row.querySelector('td:first-child').textContent.toLowerCase();
        const time = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        if (track.includes(searchTerm) || time.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});

// Load races with live status
async function loadRaceList() {
    const flatData = await fetchData('FLAT');
    const nhData = await fetchData('NH');
    const raceList = {};

    flatData.forEach((row, index) => {
        if (index === 0) return;
        const time = row[0];
        const track = row[1];
        if (!raceList[track]) {
            raceList[track] = new Set();
        }
        raceList[track].add(time);
    });

    nhData.forEach((row, index) => {
        if (index === 0) return;
        const time = row[0];
        const track = row[1];
        if (!raceList[track]) {
            raceList[track] = new Set();
        }
        raceList[track].add(time);
    });

    const raceListTable = document.getElementById('raceList');
    let alternate = false;
    for (const track in raceList) {
        const times = Array.from(raceList[track]).sort();
        const row = document.createElement('tr');
        row.style.backgroundColor = alternate ? '#f0f0f0' : '#ffffff';
        alternate = !alternate;

        const trackCell = document.createElement('td');
        trackCell.innerHTML = `<img src="track-icon.png" alt="track-icon" style="width:20px;"> ${track}`;
        row.appendChild(trackCell);

        times.forEach(time => {
            const timeCell = document.createElement('td');
            const statusIcon = determineRaceStatus(time); // Function to show live/completed status
            timeCell.innerHTML = `<a href="ratings.html?track=${encodeURIComponent(track)}&time=${encodeURIComponent(time)}">${time} ${statusIcon}</a>`;
            row.appendChild(timeCell);
        });

        raceListTable.appendChild(row);
    }
}

function determineRaceStatus(time) {
    const currentTime = new Date();
    const raceTime = new Date();
    raceTime.setHours(...time.split(':').map(Number));
    
    if (currentTime > raceTime) {
        return '<span style="color:red;">(Completed)</span>';
    } else if (currentTime.toLocaleTimeString() === raceTime.toLocaleTimeString()) {
        return '<span style="color:green;">(Live)</span>';
    } else {
        return '<span style="color:orange;">(Upcoming)</span>';
    }
}

loadRaceList();
