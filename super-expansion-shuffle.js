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
    0,0
];

const adjacencyList = {
        0: [1, 2, 4],
        1: [0, 3, 4, 7],
        2: [0, 4, 5, 8],
        3: [1, 6, 7, 10],
        4: [0, 1, 2, 7, 8, 11],
        5: [2, 8, 9, 12],
        6: [3, 10, 13],
        7: [1, 3, 4, 10, 11, 14],
        8: [2, 4, 5, 11, 12, 15],
        9: [5, 12, 16],
        10: [3, 6, 7, 13, 14, 17],
        11: [4, 7, 8, 14, 15, 18],
        12: [5, 8, 9, 15, 16, 19],
        13: [6, 10, 17, 20],
        14: [7, 10, 11, 17, 18, 21],
        15: [8, 11, 12, 18, 19, 22],
        16: [9, 12, 19, 23],
        17: [10, 13, 14, 20, 21, 24],
        18: [11, 14, 15, 21, 22, 25],
        19: [12, 15, 16, 22, 23, 26],
        20: [13, 17, 24, 27],
        21: [14, 17, 18, 24, 25, 28],
        22: [15, 18, 19, 25, 26, 29],
        23: [16, 19, 26, 30],
        24: [17, 20, 21, 27, 28, 31],
        25: [18, 21, 22, 28, 29, 32],
        26: [19, 22, 23, 29, 30, 33],
        27: [20, 24, 31],
        28: [21, 24, 25, 31, 32, 34],
        29: [22, 25, 26, 32, 33, 35],
        30: [23, 26, 33],
        31: [24, 27, 28, 34],
        32: [25, 28, 29, 34, 35, 36],
        33: [26, 29, 30, 35],
        34: [28, 31, 32, 36],
        35: [29, 32, 33, 36],
        36: [32, 34, 35]
    }

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
    let shuffledResources = buildResourcesArray();
    if (!shuffledResources) return;

    // Use user-selected chits if available
    let allNumbers;
    if (window.customChitCounts) {
        allNumbers = [];
        for (let n of [2,3,4,5,6,8,9,10,11,12]) {
            for (let i = 0; i < window.customChitCounts[n]; ++i) allNumbers.push(n);
        }
    } else {
        // fallback to default logic
        const allowedNumbers = [3, 4, 5, 9, 10, 11];
        // add 5 more random numbers from 3 to 11
        const additionalNumbers = Array.from({ length: 5 }, () => allowedNumbers[Math.floor(Math.random() * allowedNumbers.length)]);
        allNumbers = numbers.concat(additionalNumbers);
    }

    shuffleArray(shuffledResources);

    // Find desert tile indexes
    const desertIndexes = [];
    for (let i = 0; i < shuffledResources.length; i++) {
        if (shuffledResources[i] === "desert") {
            desertIndexes.push(i);
        }
    }

    // Prepare number chits: assign 0 to deserts, non-zero chits to others
    let nonZeroChits = allNumbers.filter(n => n !== 0);
    shuffleArray(nonZeroChits);

    let numberChits = [];
    let nonZeroIndex = 0;
    for (let i = 0; i < shuffledResources.length; i++) {
        if (shuffledResources[i] === "desert") {
            numberChits[i] = 0;
        } else {
            numberChits[i] = nonZeroChits[nonZeroIndex++];
        }
    }

    // Shuffle until valid if needed
    const prevent68 = !document.getElementById('adjacent_6_8_input').checked;
    if (prevent68) {
        while (!isValid68Placement(shuffledResources, numberChits, adjacencyList)) {
            shuffleArray(nonZeroChits);
            nonZeroIndex = 0;
            for (let i = 0; i < shuffledResources.length; i++) {
                if (shuffledResources[i] === "desert") {
                    numberChits[i] = 0;
                } else {
                    numberChits[i] = nonZeroChits[nonZeroIndex++];
                }
            }
        }
    }

    for (let i = 0; i < shuffledResources.length; i++) {
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
                const chitValue = numberChits[i];
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
            }
        }
    }
};


function isValid68Placement(tiles, chitValues, adjacencyList) {
    // adjacencyList: array of arrays, where each index contains the indices of adjacent tiles
    for (let i = 0; i < tiles.length; i++) {
        const chit = chitValues[i];
        const tileType = tiles[i];
        // Desert tiles must have chit 0
        if (tileType === "desert" && chit !== 0) {
            return false;
        }
        if (chit == 6 || chit == 8) {
            for (const neighbor of adjacencyList[i]) {
                const neighborChit = chitValues[neighbor];
                if (neighborChit == 6 || neighborChit == 8) {
                    return false; // Found adjacent 6 and 8
                }
            }
        }
    }
    return true;
}

function getResourceCountsFromInputs() {
    return {
        sheep: parseInt(document.getElementById('num_sheep').value, 10),
        wood: parseInt(document.getElementById('num_wood').value, 10),
        brick: parseInt(document.getElementById('num_brick').value, 10),
        wheat: parseInt(document.getElementById('num_wheat').value, 10),
        ore: parseInt(document.getElementById('num_ore').value, 10),
        desert: parseInt(document.getElementById('num_desert').value, 10)
    };
}

function buildResourcesArray() {
    const counts = getResourceCountsFromInputs();
    let arr = [];
    for (let i = 0; i < counts.sheep; i++) arr.push("sheep");
    for (let i = 0; i < counts.wood; i++) arr.push("wood");
    for (let i = 0; i < counts.brick; i++) arr.push("brick");
    for (let i = 0; i < counts.wheat; i++) arr.push("wheat");
    for (let i = 0; i < counts.ore; i++) arr.push("ore");
    for (let i = 0; i < counts.desert; i++) arr.push("desert");
    if (arr.length !== 37) {
        alert("The total number of tiles must be 37. You have " + arr.length + ".");
        return null;
    }
    return arr;
}

function closeOptions() {
    var menu = document.getElementById('popmenu');
    var overlay = document.getElementById('overlay');
    if (menu) menu.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
}

function toggleNumberOptions() {
    var menu = document.getElementById('numberMenu');
    var overlay = document.getElementById('overlay');
    if (menu) menu.classList.toggle('hidden');
    if (overlay) overlay.classList.toggle('hidden');
}

function closeNumberOptions() {
    var menu = document.getElementById('numberMenu');
    var overlay = document.getElementById('overlay');
    if (menu) menu.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
}

function saveChitCounts() {
    // Collect chit counts from form
    var chitCounts = {};
    var total = 0;
    for (var n of [2,3,4,5,6,8,9,10,11,12]) {
        var val = parseInt(document.getElementById('num_' + n).value, 10) || 0;
        chitCounts[n] = val;
        total += val;
    }
    // Get number of non-desert resources (not just tiles)
    var num_wood = parseInt(document.getElementById('num_wood').value, 10) || 0;
    var num_brick = parseInt(document.getElementById('num_brick').value, 10) || 0;
    var num_sheep = parseInt(document.getElementById('num_sheep').value, 10) || 0;
    var num_wheat = parseInt(document.getElementById('num_wheat').value, 10) || 0;
    var num_ore = parseInt(document.getElementById('num_ore').value, 10) || 0;
    var numTiles = num_wood + num_brick + num_sheep + num_wheat + num_ore;
    if (total !== numTiles) {
        alert('Total chit count (' + total + ') must equal number of non-desert resources (' + numTiles + ').');
        return;
    }
    // Save to global (or window) for use in board generation
    window.customChitCounts = chitCounts;
    closeNumberOptions();
    if (typeof generateBoard === 'function') generateBoard();
}

// Patch generateBoard to use custom chit counts if set
var originalBuildChitsArray = window.buildChitsArray;
window.buildChitsArray = function() {
    if (window.customChitCounts) {
        var arr = [];
        for (var n of [2,3,4,5,6,8,9,10,11,12]) {
            for (var i = 0; i < window.customChitCounts[n]; ++i) arr.push(n);
        }
        return arr;
    }
    if (typeof originalBuildChitsArray === 'function') {
        return originalBuildChitsArray();
    }
    return [];
};

function saveResourceCounts() {
    const counts = getResourceCountsFromInputs();
    let total = 0;
    for (let key of Object.keys(counts)) {
        let val = parseInt(counts[key], 10) || 0;
        if (val < 0) {
            alert('Resource counts cannot be negative.');
            return;
        }
        total += val;
    }
    if (total !== 37) {
        alert('The total number of tiles must be 37. You have ' + total + '.');
        return;
    }
    // Optionally, save to window/global if needed for board generation
    window.customResourceCounts = counts;
    // Close modal using Bootstrap API
    var modal = bootstrap.Modal.getInstance(document.getElementById('resourceModal'));
    if (modal) modal.hide();
    if (typeof generateBoard === 'function') generateBoard();
}