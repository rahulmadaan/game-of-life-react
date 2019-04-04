import React, { Component } from "react";
import "./App.css";
import nextGeneration from "./gameOfLife.js";

class GameOfLife extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGeneration: [],
      bounds: { topLeft: [0, 0], bottomRight: [9, 9] },
      previousGen: [],
      nextGen: nextGeneration.bind(this),
      grid: [],
      interval: ""
    };
  }
  updateCurrentGeneration(currentCell) {
    let cell = JSON.parse(currentCell);
    if (!this.state.currentGeneration.includes(cell)) {
      this.state.currentGeneration.push(cell);
      return;
    }
    const position = this.state.currentGeneration.indexOf(cell);
    this.state.currentGeneration.splice(position);
  }

  makeCellAlive(e) {
    const cell = e.target.id;
    let color = "green";
    const cellStyle = document.getElementById(cell).style;
    if (cellStyle.backgroundColor === color) {
      color = "white";
    }
    cellStyle.backgroundColor = color;
    this.updateCurrentGeneration(cell);
  }

  createRow(row) {
    let currentRow = [];
    for (let column = 0; column < this.state.bounds.bottomRight[1]; column++) {
      let ids = "[" + row + "," + column + "]";
      currentRow.push(<td id={ids} onClick={this.makeCellAlive.bind(this)} />);
    }
    return currentRow;
  }

  createTable(row) {
    let table = [];
    for (let row = 0; row < this.state.bounds.bottomRight[0]; row++) {
      table.push(<tr>{this.createRow(row)}</tr>);
    }
    return table;
  }

  clearPreviousCellsStyling() {
    this.state.previousGen.forEach(cell => {
      let ele = document.getElementById(JSON.stringify(cell));
      if (ele !== null) ele.style.backgroundColor = "white";
    });
  }
  clearCurrentCellsStyling() {
    this.state.currentGeneration.forEach(cell => {
      let ele = document.getElementById(JSON.stringify(cell));
      if (ele !== null) ele.style.backgroundColor = "white";
    });
  }

  updateCellsOnBoard() {
    this.clearPreviousCellsStyling();
    const cells = this.state.currentGeneration;
    cells.forEach(cell => {
      let ele = document.getElementById(JSON.stringify(cell));
      console.log("cell is", cell);
      if (ele !== null) ele.style.backgroundColor = "green";
    });
  }

  startGame() {
    if (this.state.interval !== "") {
      return null;
    }
    const interval = setInterval(() => {
      this.setState(state => {
        let result = [];
        result = this.state.nextGen(state.currentGeneration, state.bounds);
        state.previousGen = state.currentGeneration;
        state.currentGeneration = result;
      });
      this.updateCellsOnBoard();
    }, 1000);
    this.setState(state => {
      state.interval = interval;
    });
  }
  resetGame() {
    clearInterval(this.state.interval);
    this.setState(state => {
      state.interval = "";
    });
    this.setState(state => {
      state.currentGeneration = [];
      state.previousGen = [];
    });
    this.clearPreviousCellsStyling();
    this.clearCurrentCellsStyling();
  }

  aboutGame() {
    window.location = "https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life";
  }

  render() {
    return (
      <div className="board">
        <table className="table">
          <tbody>{this.createTable()}</tbody>
        </table>
        <button className="game-btn" onClick={this.startGame.bind(this)}>
          Start Game
        </button>
        <button className="game-btn" onClick={this.resetGame.bind(this)}>
          Reset Game
        </button>
        <button className="game-btn" onClick={this.aboutGame}>
          About Game
        </button>
      </div>
    );
  }
}

export default GameOfLife;
