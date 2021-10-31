"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const table_1 = require("table");
class Board {
    constructor(pin) {
        this.rightDigitWrongPosition = chalk_1.default.green("●"); // right digit wrong position
        this.rightDigitRightPosition = chalk_1.default.red("●"); // right position
        this.wrongPosition = chalk_1.default.white("●"); // no match
        this.header = `
    ${this.rightDigitWrongPosition} - Correct guess, wrong position
    ${this.rightDigitRightPosition} - Correct guess, correct position
    ${this.wrongPosition} - Wrong guess
    `;
        this.guesses = [];
        this.errors = [];
        this.pin = pin;
    }
    addGuess(guess) {
        this.guesses.push(guess);
    }
    addError(error) {
        this.errors.push(error);
    }
    getBoard() {
        const result = [];
        this.guesses.forEach((guess) => {
            const row = [];
            const digits = guess.split('');
            row.push(...digits);
            const guessResult = this.match(this.pin, guess);
            let dots = "";
            for (let i = 0; i < guessResult.correctColor; i++) {
                dots += this.rightDigitWrongPosition + " ";
            }
            for (let i = 0; i < guessResult.correctPosition; i++) {
                dots += this.rightDigitRightPosition + " ";
            }
            for (let i = 0; i < 4 - guessResult.correctPosition - guessResult.correctColor; i++) {
                dots += this.wrongPosition + " ";
            }
            row.push(dots.slice(0, 24) + "\n" + dots.slice(24));
            result.push(row);
        });
        if (result.length === 0) {
            return "";
        }
        let data = (0, table_1.table)(result, {
            header: {
                content: this.header,
                alignment: "left",
            },
            columnDefault: {
                width: 2,
                alignment: "center",
                verticalAlignment: "middle"
            },
            columns: {
                4: {
                    width: 20,
                }
            }
        });
        data += '\n';
        data += this.errors.join('\n');
        return data;
    }
    match(actual, guess) {
        let correctPosition = 0, correctColor = 0;
        const matchedSet = new Set();
        for (let i = 0; i < 4; i++) {
            // match red
            if (guess.charAt(i) === actual.charAt(i)) {
                correctPosition++;
                matchedSet.add(guess.charAt(i));
            }
        }
        for (let i = 0; i < 4; i++) {
            // match white
            if (guess.charAt(i) !== actual.charAt(i)) {
                if (!matchedSet.has(guess.charAt(i)) && actual.indexOf(guess.charAt(i)) !== -1)
                    correctColor++;
            }
        }
        return { correctPosition, correctColor };
    }
}
exports.default = Board;
