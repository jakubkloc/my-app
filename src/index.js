import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// SQUIARE
function Square(props) {
  return (
    <button
      className={props.isWinningSquare ? "yellow square" : "square"}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

//BOARD
class Board extends React.Component {
  renderSquare(i, isWinningSquare) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  }

  render() {
    let board = [];
    for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
      let row = [];

      for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
        let index = rowIndex + 3 * columnIndex;
        let isWinningSquare = false;
        if (
          this.props.winningSquares &&
          this.props.winningSquares.includes(index)
        ) {
          isWinningSquare = true;
        }
        row.push(this.renderSquare(index, isWinningSquare));
      }
      board.push(
        <div className="board-row" key={columnIndex}>
          {row}
        </div>
      );
    }

    return <div>{board}</div>;
  }
}

// GAME
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      upToDown: true,
      winningSquares: [],
    };
  }

  handleClick(i) {
    console.log(this.state.stepNumber);

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)) {
      const winnerData = calculateWinner(squares);
      this.setState({ winningSquares: winnerData[1] });
    }
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          fieldIndex: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    if (calculateWinner(squares)) {
      const winnerData = calculateWinner(squares);
      this.setState({ winningSquares: winnerData[1] });
    }
  }

  jumpTo(step, currentSquares) {
    if (calculateWinner(currentSquares)) {
      console.log("false");
      const winnerData = calculateWinner(currentSquares);
      this.setState({ winningSquares: winnerData[1] });
    } else {
      console.log("true");
      this.setState({ winningSquares: [] });
    }
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  newGame() {
    this.setState({
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      upToDown: true,
      winningSquares: [],
    });
  }
  sort() {
    this.setState((prevState) => ({
      upToDown: !prevState.upToDown,
    }));
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move, actualHistory) => {
      let actualSquares = actualHistory[move].squares;
      let column = (step.fieldIndex + 1) % 3;
      if (column === 0) column = 3;

      let row = Math.ceil((step.fieldIndex + 1) / 3);

      let coordinates = move > 0 ? column + " : " + row : "0 : 0";
      if (move === this.state.stepNumber && move > 0) {
        coordinates = <b>{coordinates}</b>;
      }

      const description = move
        ? "Przejdź do ruchu #" + move
        : "Przejdź na początek gry";

      return (
        <li key={move + this.state.upToDown.toString()}>
          <button onClick={() => this.jumpTo(move, actualSquares)}>
            {description}
          </button>
          <p>{coordinates}</p>
        </li>
      );
    });

    if (!this.state.upToDown) moves.reverse();

    let status;
    if (winner) {
      status = "Wygrywa: " + winner[0];
    } else {
      status =
        this.state.stepNumber === 9
          ? "remis"
          : "Następny gracz: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={this.state.winningSquares}
          />
        </div>
        <div className="game-info">
          <div className="notation-container">
            <div>{status}</div>
            <p>{"Historia ruchów"}</p>
            <ol reversed={this.state.upToDown ? false : true}>{moves}</ol>
          </div>
        </div>
        <div className="button-container">
          <button className="button" onClick={() => this.sort()}>
            Rosnąco/malejąco
          </button>
          {(this.state.winningSquares.length !== 0 ||
            this.state.stepNumber === 9) && (
            <button className="button" onClick={() => this.newGame()}>
              Nowa gra
            </button>
          )}
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], [a, b, c]];
    }
  }
  return null;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
