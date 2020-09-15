// dom interactions here

const startButton = document.querySelector('#newGame');
const overlay = document.querySelector('.overlay');

const allCells = document.querySelectorAll('.cell');

const currentPlayer = document.querySelector('#current-player');
const winner = document.querySelector('#winner');

const announcementBanner = document.querySelector('.announce');

function updateDom(state, reset) {
    overlay.style.display = state.gameRunning ? 'none' : 'flex';
    allCells.forEach(ele => {
        const id = ele.id;
        const [_, x, y] = id.split('-').map(k => parseInt(k));
        ele.innerText = state.board[3*x + y] || '';
    });
    currentPlayer.innerText = state.currentPlayer;

    if(reset || state.gameRunning) {
        announcementBanner.style.display = 'none';
    } else if(!state.gameRunning) {
        announcementBanner.style.display = 'flex';
        winner.innerText = state.winner ? state.winner : 'nobody';
    }

}

updateDom(baseState, true);

GameState.subscribe((state) => {
    updateDom(state, false);
})

// event handling

startButton.addEventListener('click', function(){
    startGame();
});

// bind cells

allCells.forEach(ele => {
    const id = ele.id;
    const [_, x, y] = id.split('-').map(k => parseInt(k));
    ele.addEventListener('click', function() {
        playChance(x, y);
    })
})