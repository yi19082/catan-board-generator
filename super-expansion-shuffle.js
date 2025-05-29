function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

const resources = [
    "wood", "wood", "wood", "wood", "wood", "wood", "wood", 
    "brick", "brick", "brick", "brick", "brick", "brick", "brick", 
    "wheat", "wheat", "wheat", "wheat", "wheat", "wheat", "wheat",
    "sheep", "sheep", "sheep", "sheep", "sheep", "sheep", "sheep", 
    "ore", "ore", "ore", "ore", "ore", "ore", "ore", 
    "desert", "desert"
];
const numbers = [
    2, 
    3, 3, 
    4, 4, 4, 
    5, 5, 5, 5,
    6, 6, 6, 6, 6,
    8, 8, 8, 8, 8,
    9, 9, 9, 9,
    10, 10, 10,
    11, 11,
    12,
    '',''
];

// Helper to get dots for a number
function getDots(num) {
    switch (parseInt(num, 10)) {
        case 2: case 12: return ".";
        case 3: case 11: return "..";
        case 4: case 10: return "...";
        case 5: case 9:  return "....";
        case 6: case 8:  return ".....";
        default: return ""; // for desert or blank
    }
}

window.generateBoard = function() {
    let shuffledResources = resources.slice();
    const allowedNumbers = [3, 4, 5, 9, 10, 11];
    // add 5 more random numbers from 3 to 11
    const additionalNumbers = Array.from({ length: 5 }, () => allowedNumbers[Math.floor(Math.random() * allowedNumbers.length)]);
    let allNumbers = numbers.concat(additionalNumbers);
    shuffleArray(shuffledResources);
    let numberChits = allNumbers.filter(n => n !== "");
    shuffleArray(numberChits);

    let chitIndex = 0;

    for (let i = 0; i < 37; i++) {
        const tile = document.getElementById(`tile-${i}`);
        const circle = document.getElementById(`circle-${i}`);
        if (tile && circle) {
            tile.className = `hex-expanded hex-base ${shuffledResources[i]}`;
            tile.setAttribute("alt", shuffledResources[i]);
            // Add or remove desert-chit class on circle
            if (shuffledResources[i] === "desert") {
                circle.classList.add("desert-chit");
            } else {
                circle.classList.remove("desert-chit");
            }
            // Update chit number and dots for all tiles
            const chit = circle.querySelector('.tile-chit-expanded');
            const dots = circle.querySelector('.prob-dots-base');
            if (shuffledResources[i] === "desert") {
                if (chit) {
                    chit.textContent = "";
                    chit.classList.remove("high-prob");
                }
                if (dots) {
                    dots.textContent = "";
                    dots.classList.remove("high-prob");
                }
            } else {
                const chitValue = numberChits[chitIndex];
                if (chit) {
                    chit.textContent = chitValue;
                    if (chitValue == 6 || chitValue == 8) {
                        chit.classList.add("high-prob");
                    } else {
                        chit.classList.remove("high-prob");
                    }
                }
                if (dots) {
                    dots.textContent = getDots(chitValue);
                    if (chitValue == 6 || chitValue == 8) {
                        dots.classList.add("high-prob");
                    } else {
                        dots.classList.remove("high-prob");
                    }
                } else {
                    // Create the dots container if missing
                    const newDots = document.createElement('div');
                    newDots.className = 'prob-dots-base small-font-size-wrap';
                    newDots.textContent = getDots(chitValue);
                    if (chitValue == 6 || chitValue == 8) {
                        newDots.classList.add("high-prob");
                    }
                    circle.appendChild(newDots);
                }
                chitIndex++;
            }
        }
    }
};