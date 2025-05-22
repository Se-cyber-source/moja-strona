let driverNames = [
    "Mclaren", "Ferrari", "Lamborghini", "Fiat", "Toyota", "Audi",
    "Porsche", "Koenigsegg", "Opel", "Peugeot", "Nissan", "Mazda",
    "Bugatti", "Maserati", "Volkswagen", "Alfa Romeo", "Aston Martin",
    "Mercedes", "Seat", "Subaru", "Ford", "Mitsubishi", "BMW",
    "Citroen", "Hyundai", "Volvo", "Tesla", "Melex", "Trabant", "Acura"
];

let driverColors = [
    "#FFA000", "#FF0000", "#FFFF00", "#A61C2E", "#0000ff",
    "#00FF00", "#87CEEB", "#FF7F50", "#FF00FF", "#FFE4C4",
    "#FF4500", "#008080", "#800080", "#808080", "#FFD700",
    "#A0522D", "#D2691E", "#8B4513", "#2E8B57", "#5F9EA0",
    "#4682B4", "#B22222", "#DAA520", "#ADFF2F", "#F08080",
    "#FF6347", "#40E0D0", "#EE82EE", "#9370DB", "#7FFF00",
];

let driverImages = [
    "car/car1.png", "car/car2.png", "car/car3.png", 
    "car/car4.png", "car/car5.png", "car/car6.png", 
    "car/car7.png", "car/car8.png", "car/car9.png", 
    "car/car10.png", "car/car11.png", "car/car12.png", 
    "car/car13.png", "car/car14.png", "car/car15.png", 
    "car/car16.png", "car/car17.png", "car/car18.png", 
    "car/car19.png", "car/car20.png", "car/car21.png", 
    "car/car22.png", "car/car23.png", "car/car24.png", 
    "car/car25.png", "car/car26.png", "car/car27.png", 
    "car/car28.png", "car/car29.png", "car/car30.png"
];

let raceInterval;
let speedMultiplier = 1;
let positions;
let timeElapsed = 0;
let timerInterval = null;
let colorInterval = null;

let selectedDrivers = []; // Array to hold selected drivers
let selectedDriverColors = []; // Array to hold colors for selected drivers
let selectedDriverImages = []; // Array to hold images for selected drivers

let raceLaps = 8; // Liczba okr¹¿eñ w wyœcigu
let lapTimes = []; // Przechowywanie czasów okr¹¿eñ dla ka¿dego kierowcy
let fastestLapTime = Infinity; // Najszybszy czas okr¹¿enia w wyœcigu
let fastestLapDriver = ""; // Kierowca z najszybszym czasem okr¹¿enia
let currentLap = []; // Przechowywanie bie¿¹cego okr¹¿enia dla ka¿dego kierowcy

function startRace() {
    clearInterval(raceInterval);
    clearInterval(timerInterval);

    const startButton = document.getElementById('startButton');
    startButton.style.display = 'none';

    const cars = Array.from(document.querySelectorAll('.car'));

    selectRandomDrivers();
    positions = Array(selectedDrivers.length).fill(0);
    lapTimes = Array(selectedDrivers.length).fill(0);
    currentLap = Array(selectedDrivers.length).fill(1);

    let speeds = cars.map(getRandomSpeed);
    const trackLength = 5.0;
    timeElapsed = 0;
    document.getElementById('timerDisplay').innerText = `Czas Wyscigu: ${timeElapsed} s`;

    setCarStartPositions();

    timerInterval = setInterval(() => {
        timeElapsed += 100 * speedMultiplier;
        document.getElementById('timerDisplay').innerText = `Czas Wyscigu: ${(timeElapsed / 500).toFixed(3)} s`;
    }, 100);

    raceInterval = setInterval(() => {
        cars.forEach((car, index) => {
            positions[index] += speeds[index] * speedMultiplier;
            moveCar(car, positions[index]);

            // Sprawdzanie, czy kierowca ukoñczy³ okr¹¿enie
                if (positions[index] >= trackLength * 500 * currentLap[index]) {
                const lapTime = timeElapsed  - lapTimes[index];
                lapTimes[index] = timeElapsed ;
                currentLap[index]++;
				
              // Aktualizacja najszybszego okr¹¿enia
                if (lapTime < fastestLapTime) {
                    fastestLapTime = lapTime;
                    fastestLapDriver = selectedDrivers[index];

                    // Dodanie nowego wiersza w tabeli najszybszych okr¹¿eñ
                    const fastestLapsBody =   document.getElementById('fastestLapsBody');
                    const newRow = document.createElement('tr');

                    // Dodaj komórkê z imieniem kierowcy
                    const driverCell = document.createElement('td');
                    driverCell.innerText = fastestLapDriver;
                    newRow.appendChild(driverCell);
					
					// ZnajdŸ indeks najszybszego kierowcy w liœcie wybranych kierowców
                    const driverIndex = selectedDrivers.indexOf(fastestLapDriver);

                    // Ustaw kolor t³a komórki na kolor kierowcy
                    driverCell.style.backgroundColor = selectedDriverColors[driverIndex];

                    // Dodaj komórkê do wiersza
                    newRow.appendChild(driverCell);

                    // Dodaj komórkê z czasem okr¹¿enia
                    const lapTimeCell = document.createElement('td');
                    lapTimeCell.innerText = (fastestLapTime / 500).toFixed(3) + ' s';
                    newRow.appendChild(lapTimeCell);

                    // Dodaj nowy wiersz do tabeli
                    fastestLapsBody.appendChild(newRow);
                }
            }
        });

        updateLeaderboard();

        // Sprawdzanie, czy któryœ z kierowców ukoñczy³ wszystkie okr¹¿enia
        if (currentLap.some(lap => lap > raceLaps)) {
            clearInterval(raceInterval);
            clearInterval(timerInterval);
            const winnerIndex = positions.findIndex((pos, idx) => currentLap[idx] > raceLaps);
            if (winnerIndex >= 0) {
                document.getElementById('winnerDisplay').innerText = `${selectedDrivers[winnerIndex]} WYGRAL!`;
            }
        }
    }, 100);

    // Losowa aktualizacja prêdkoœci co 2 sekundy
    setInterval(() => {
        speeds = speeds.map(getRandomSpeed);
    }, 2000);
	
    startColorChange();
}

function selectRandomDrivers() {
    // Create an array of indices for the drivers
    const indices = Array.from({ length: driverNames.length }, (_, i) => i);
    const shuffledIndices = indices.sort(() => 0.5 - Math.random()); // Shuffle the indices
    const selectedIndices = shuffledIndices.slice(0, 10); // Get the first 10 indices

    selectedDrivers = selectedIndices.map(index => driverNames[index]);
    selectedDriverColors = selectedIndices.map(index => driverColors[index]);
    selectedDriverImages = selectedIndices.map(index => driverImages[index]); // Select images
}

function setCarStartPositions() {
    const carPositions = [
        { left: '90px', top: '70px' }, { left: '135px', top: '70px' }, { left: '180px', top: '70px' },
        { left: '225px', top: '70px' }, { left: '270px', top: '70px' }, { left: '315px', top: '70px' },
        { left: '360px', top: '70px' }, { left: '405px', top: '70px' }, { left: '450px', top: '70px' },
        { left: '495px', top: '70px' },
		
		{ left: '90px', top: '115px' }, { left: '135px', top: '115px' }, { left: '180px', top: '115px' },
        { left: '225px', top: '115px' }, { left: '270px', top: '115px' }, { left: '315px', top: '115px' },
        { left: '360px', top: '115px' }, { left: '405px', top: '115px' }, { left: '450px', top: '115px' },
        { left: '495px', top: '115px' },
		
		{ left: '90px', top: '160px' }, { left: '135px', top: '160px' }, { left: '180px', top: '160px' },
        { left: '225px', top: '160px' }, { left: '270px', top: '160px' }, { left: '315px', top: '160px' },
        { left: '360px', top: '160px' }, { left: '405px', top: '160px' }, { left: '450px', top: '160px' },
        { left: '495px', top: '160px' }
		
    ];

    // Hide all cars initially
    const cars = document.querySelectorAll('.car');
    cars.forEach(car => {
        car.style.display = 'none';
    });

    // Set positions and images for only selected drivers
    selectedDrivers.forEach((driver, index) => {
        const carElement = document.getElementById(`car${index + 1}`);
        if (carElement) {
            carElement.style.display = 'block'; // Show the selected car
            carElement.style.left = carPositions[index].left;
            carElement.style.top = carPositions[index].top;
            carElement.src = selectedDriverImages[index]; // Set the car image based on selected driver
        }
    });
}

function resetRace() {
    clearInterval(raceInterval);
    clearInterval(timerInterval);

    const cars = document.querySelectorAll('.car');
    positions = Array(cars.length).fill(0);
    timeElapsed = 0;
	realTimeElapsed = 0;
    speedMultiplier = 1;
    fastestLapTime = Infinity;
    fastestLapDriver = "";
    currentLap = Array(selectedDrivers.length).fill(1);
	lapTimes = Array(selectedDrivers.length).fill(0); // Resetuj czasy okr¹¿eñ

    document.getElementById('winnerDisplay').innerText = '';
    document.getElementById('timerDisplay').innerText = `Czas Wyscigu: ${timeElapsed.toFixed(3)} s`;
    updateLeaderboard();
	
	// Wyczyœæ tabelê najszybszych okr¹¿eñ
    const fastestLapsBody = document.getElementById('fastestLapsBody');
    fastestLapsBody.innerHTML = ''; // Usuniêcie zawartoœci tabeli
	
	// Wyczyœæ tabelê wyników
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = ''; // Usuniêcie zawartoœci tabeli

    clearInterval(colorInterval);
    colorInterval = null;
    document.getElementById('timerDisplay').style.color = "black";

    const startButton = document.getElementById('startButton');
    startButton.style.display = 'inline-block';

    const defaultCarPositions = [
        { left: '90px', top: '70px' }, { left: '135px', top: '70px' }, { left: '180px', top: '70px' },
        { left: '225px', top: '70px' }, { left: '270px', top: '70px' }, { left: '315px', top: '70px' },
        { left: '360px', top: '70px' }, { left: '405px', top: '70px' }, { left: '450px', top: '70px' },
        { left: '495px', top: '70px' },
		
		{ left: '90px', top: '115px' }, { left: '135px', top: '115px' }, { left: '180px', top: '115px' },
        { left: '225px', top: '115px' }, { left: '270px', top: '115px' }, { left: '315px', top: '115px' },
        { left: '360px', top: '115px' }, { left: '405px', top: '115px' }, { left: '450px', top: '115px' },
        { left: '495px', top: '115px' },
		
		{ left: '90px', top: '160px' }, { left: '135px', top: '160px' }, { left: '180px', top: '160px' },
        { left: '225px', top: '160px' }, { left: '270px', top: '160px' }, { left: '315px', top: '160px' },
        { left: '360px', top: '160px' }, { left: '405px', top: '160px' }, { left: '450px', top: '160px' },
        { left: '495px', top: '160px' }
    ];

    cars.forEach((car, index) => {
        car.style.display = 'block';
        if (defaultCarPositions[index]) {
            car.style.left = defaultCarPositions[index].left;
            car.style.top = defaultCarPositions[index].top;
            car.src = driverImages[index];
        }
    });
}

function moveCar(car, position) {
    const trackWidth = 600;
    const trackHeight = 400;
    const carWidth = 50;
    const carHeight = 30;

    const perimeter = 2 * (trackWidth + trackHeight);
    const normalizedPosition = position % perimeter;

    let x, y;

    if (normalizedPosition < trackWidth) {
        x = normalizedPosition;
        y = -carHeight;
    } else if (normalizedPosition < trackWidth + trackHeight) {
        const edgePosition = normalizedPosition - trackWidth;
        x = trackWidth;
        y = edgePosition;
    } else if (normalizedPosition < 2 * trackWidth + trackHeight) {
        const edgePosition = normalizedPosition - (trackWidth + trackHeight);
        x = trackWidth - edgePosition;
        y = trackHeight;
    } else {
        const edgePosition = normalizedPosition - (2 * trackWidth + trackHeight);
        x = -carWidth;
        y = trackHeight - edgePosition;
    }

    car.style.left = `${x}px`;
    car.style.top = `${y}px`;
}

function getRandomSpeed() {
    return Math.random() * 5 + 1;
}

function updateLeaderboard() {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    const sortedPositions = [...positions]
        .map((position, index) => ({ position, index }))
        .sort((a, b) => b.position - a.position)
        .slice(0, 10);

    sortedPositions.forEach((pos, rank) => {
        const row = document.createElement('tr');
        const placeCell = document.createElement('td');
        placeCell.innerText = rank + 1;

        if (rank === 0) placeCell.classList.add('first-place');
        else if (rank === 1) placeCell.classList.add('second-place');
        else if (rank === 2) placeCell.classList.add('third-place');
        else placeCell.classList.add('default-place');

        row.appendChild(placeCell);

        const nameCell = document.createElement('td');
        nameCell.innerText = selectedDrivers[pos.index];
        nameCell.style.backgroundColor = selectedDriverColors[pos.index];
        row.appendChild(nameCell);

        const gapCell = document.createElement('td');
        const gap = (rank > 0) ? ((sortedPositions[rank - 1].position - pos.position) / 1000).toFixed(2) : '-';
        gapCell.innerText = gap;
        row.appendChild(gapCell);

        const distanceCell = document.createElement('td');
        distanceCell.innerText = (pos.position / 1000).toFixed(2);
        row.appendChild(distanceCell);

        const lapCell = document.createElement('td');
        lapCell.innerText = currentLap[pos.index]; // Wyœwietl licznik okr¹¿eñ
        row.appendChild(lapCell);

        leaderboardBody.appendChild(row);
    });
}

function changeSpeed(newSpeed) {
    speedMultiplier = newSpeed;
}

let timerColorInterval = null;
let winnerColorInterval = null;

function changeTimerColor() {
    const timerDisplay = document.getElementById('timerDisplay');
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
    timerDisplay.style.color = randomColor;
}

function changeWinnerColor() {
    const winnerDisplay = document.getElementById('winnerDisplay');
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
    winnerDisplay.style.color = randomColor;
}

function startColorChange() {
    if (!timerColorInterval) {
        timerColorInterval = setInterval(changeTimerColor, 500);
    }
    if (!winnerColorInterval) {
        winnerColorInterval = setInterval(changeWinnerColor, 500);
    }
}

const backgrounds = [
    'tlo/background1.jpg',
    'tlo/background2.jpg',
    'tlo/background3.jpg',
    'tlo/background4.jpg',
    'tlo/background5.jpg',
    'tlo/background6.jpg',
    'tlo/background7.jpg',
    'tlo/background8.jpg',
    'tlo/background9.jpg',
    'tlo/background10.jpg'
];

const usedBackgrounds = [];

function changeBackground() {
    if (usedBackgrounds.length === backgrounds.length) {
        usedBackgrounds.length = 0;
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * backgrounds.length);
    } while (usedBackgrounds.includes(randomIndex));

    const selectedBackground = backgrounds[randomIndex];
    document.body.style.backgroundImage = `url(${selectedBackground})`;
    usedBackgrounds.push(randomIndex);
}

window.onload = changeBackground;








