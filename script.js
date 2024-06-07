const players = [
    { name: "ANNABELLE", score: 0, graphic: "assets/img/maths.jpg" },
    { name: "DAVE", score: 0, graphic: "assets/img/athletics.jpg" },
    { name: "HELGA", score: 0, graphic: "assets/img/lotr.jpg" },
    { name: "JULZEY", score: 0, graphic: "assets/img/matilda.jpg" },
    { name: "MATT", score: 0, graphic: "assets/img/collingwood.png" },
    { name: "MEG", score: 0, graphic: "assets/img/henry.png" },
    { name: "RICHARD", score: 0, graphic: "assets/img/fleetwood.jpg" },
    { name: "ROB", score: 0, graphic: "assets/img/ufc.jpg" },
];


let selectedPlayers = [];
let currentHighlightIndex = 0;

document.querySelectorAll('.player').forEach(player => {
    player.addEventListener('click', function() {
        const playerId = parseInt(this.getAttribute('data-id'));
        if (selectedPlayers.includes(playerId)) {
            selectedPlayers = selectedPlayers.filter(id => id !== playerId);
            this.classList.remove('selected');
        } else if (selectedPlayers.length < 4) {
            selectedPlayers.push(playerId);
            this.classList.add('selected');
        }
    });
});

document.getElementById('startGame').addEventListener('click', function() {
    if (selectedPlayers.length >= 2 && selectedPlayers.length <= 4) {
        startGame();
    } else {
        alert('Please select between 2 to 4 players');
    }
});

function startGame() {
    document.getElementById('playerSelection').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    selectedPlayers.forEach((playerId, index) => {
        const player = players[playerId];
        document.querySelector(`#player${index + 1} .name`).textContent = player.name;
        document.querySelector(`#player${index + 1} .score`).textContent = player.score;
        document.querySelector(`#player${index + 1} .graphic`).innerHTML = `<img src="${player.graphic}" alt="${player.name} Graphic">`;
    });

    document.querySelectorAll('.column').forEach((column, index) => {
        if (index >= selectedPlayers.length) {
            column.classList.add('hidden');
        } else {
            column.classList.remove('hidden');
        }
    });

    if (document.getElementById('expertRound').checked) {
        document.querySelectorAll('.column')[currentHighlightIndex].classList.add('highlight');
    }
}

document.addEventListener('keydown', function(event) {
    const scoreElements = selectedPlayers.map((playerId, index) => document.querySelector(`#player${index + 1} .score`));
    const expertRound = document.getElementById('expertRound').checked;

    function updateScore(scoreElement, index, increment) {
        let currentScore = parseInt(scoreElement.textContent);
        if (expertRound) {
            if (index === currentHighlightIndex) {
                currentScore += increment;
            } else {
                currentScore += (increment > 0 ? increment * 2 : increment);
            }
        } else {
            currentScore += increment;
        }
        scoreElement.textContent = currentScore;
    }

    if (event.shiftKey) {
        switch(event.key.toLowerCase()) {
            case 'q':
                updateScore(scoreElements[0], 0, -5);
                break;
            case 'w':
                updateScore(scoreElements[1], 1, -5);
                break;
            case 'e':
                updateScore(scoreElements[2], 2, -5);
                break;
            case 'r':
                updateScore(scoreElements[3], 3, -5);
                break;
        }
    } else {
        switch(event.key.toLowerCase()) {
            case 'q':
                updateScore(scoreElements[0], 0, 5);
                break;
            case 'w':
                updateScore(scoreElements[1], 1, 5);
                break;
            case 'e':
                updateScore(scoreElements[2], 2, 5);
                break;
            case 'r':
                updateScore(scoreElements[3], 3, 5);
                break;
        }
    }

    if (expertRound) {
        switch(event.key) {
            case 'ArrowRight':
                if (currentHighlightIndex < selectedPlayers.length - 1) {
                    document.querySelectorAll('.column')[currentHighlightIndex].classList.remove('highlight');
                    currentHighlightIndex++;
                    document.querySelectorAll('.column')[currentHighlightIndex].classList.add('highlight');
                }
                break;
            case 'ArrowLeft':
                if (currentHighlightIndex > 0) {
                    document.querySelectorAll('.column')[currentHighlightIndex].classList.remove('highlight');
                    currentHighlightIndex--;
                    document.querySelectorAll('.column')[currentHighlightIndex].classList.add('highlight');
                }
                break;
        }
    } else {
        document.querySelectorAll('.column').forEach(column => column.classList.remove('highlight'));
    }

    // Remove players functionality
    switch(event.key.toLowerCase()) {
        case 'z':
            removePlayer(0);
            break;
        case 'x':
            removePlayer(1);
            break;
        case 'c':
            removePlayer(2);
            break;
        case 'v':
            removePlayer(3);
            break;
    }
});

function removePlayer(index) {
    if (index < selectedPlayers.length) {
        const playerColumn = document.querySelector(`#player${index + 1}`);
        playerColumn.classList.add('hidden');
        selectedPlayers.splice(index, 1);

        // Update the remaining columns
        selectedPlayers.forEach((playerId, newIndex) => {
            const player = players[playerId];
            const column = document.querySelector(`#player${newIndex + 1}`);
            column.querySelector('.name').textContent = player.name;
            column.querySelector('.score').textContent = player.score;
            column.querySelector('.graphic').innerHTML = `<img src="${player.graphic}" alt="${player.name} Graphic">`;
            column.classList.remove('hidden');
        });

        // Hide unused columns
        for (let i = selectedPlayers.length; i < 4; i++) {
            document.querySelector(`#player${i + 1}`).classList.add('hidden');
        }

        // Adjust highlight index if necessary
        if (currentHighlightIndex >= selectedPlayers.length) {
            currentHighlightIndex = selectedPlayers.length - 1;
        }
        document.querySelectorAll('.column').forEach((column, idx) => {
            column.classList.toggle('highlight', idx === currentHighlightIndex);
        });
    }
}

// Add highlight to the first column on load if Expert Round is checked
document.addEventListener('DOMContentLoaded', function() {
    const expertRound = document.getElementById('expertRound').checked;
    if (expertRound) {
        document.querySelectorAll('.column')[currentHighlightIndex].classList.add('highlight');
    }
});

// Listen for changes on the Expert Round checkbox
document.getElementById('expertRound').addEventListener('change', function() {
    const columns = document.querySelectorAll('.column');
    if (this.checked) {
        columns[currentHighlightIndex].classList.add('highlight');
    } else {
        columns.forEach(column => column.classList.remove('highlight'));
    }
});