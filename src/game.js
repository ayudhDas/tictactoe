const baseState = {
    currentPlayer: 'X',
    board: [
        null, null, null,
        null, null, null,
        null, null, null,
    ],
    gameRunning: false,
    winner: null,
};

; window.GameState = window.GameState || (function(){
    let callBacks = [];
    let state = baseState;

    function getState() {
        return state;
    }

    function addSubscription(callback) {
        callBacks.push(callback);
        return callback.length - 1;
    };

    function updateState(newState) {
        state = {...newState};
        notify();
    };

    function removeSubscription(subscriptionRef) {
        callBacks = callBacks.filter((e, idx) => idx !== subscriptionRef);
    }

    function notify(){
        callBacks.map(cb => cb({...state}));
    }

    return {
        getState: getState,
        subscribe: (callback) => addSubscription(callback),
        setState: (newState) => updateState(newState),
        unSubscribe: (subscriptionRef) => removeSubscription(subscriptionRef),
    };
})();

// Logic as functions of state
const startGame = () => {
    GameState.setState({
        ...baseState,
        gameRunning: true,
    });
};

function updateBoard(iBoard, x, y, curr) {
    const newBoard = [...iBoard];
    newBoard[3*x+y] = curr;
    return newBoard;
};

function evaluateGameStatus(board, curr) {
    const toprow = board[0] !== null && board[0] === board[1] && board[1] === board[2];
    const midRow = board[3] !== null && board[3] === board[4] && board[4] === board[5];
    const bottomRow = board[6] !== null && board[6] === board[7] && board[7] === board[8];

    const firstColumn = board[0] !== null && board[0] === board[3] && board[3] === board[6];
    const midColumn = board[1] !== null && board[1] === board[4] && board[4] === board[7];
    const lastColumn = board[2] !== null && board[2] === board[5] && board[5] === board[8];

    const leftDiagonal = board[0] !== null && board[0] === board[4] && board[4] === board[8];
    const rightDiagonal = board[2] !== null && board[2] === board[4] && board[4] === board[6];

    const gameEnded = toprow || midRow || bottomRow || firstColumn || midColumn || lastColumn || leftDiagonal || rightDiagonal;
    const noMovesLeft = board.filter(c => c==null).length === 0;

    return {
        winner: gameEnded ? curr : null,
        hasGameEnded: gameEnded || noMovesLeft,
    }
};

function nextPlayer(curr) {
    return curr === 'X' ? '0' : 'X';
} 

const playChance = (x, y) => {
    const currentState = GameState.getState();
    const newBoard = updateBoard(currentState.board, x,y, currentState.currentPlayer);
    const gameStatus = evaluateGameStatus(newBoard, currentState.currentPlayer);
    const newState = {
        currentPlayer: nextPlayer(currentState.currentPlayer),
        board: newBoard,
        gameRunning: !gameStatus.hasGameEnded,
        winner: gameStatus.winner,
    };
    GameState.setState(newState);
};