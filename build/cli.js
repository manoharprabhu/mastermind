#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const readline_1 = __importDefault(require("readline"));
const table_1 = require("table");
const readInterface = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
printIntroduction();
readInterface.question(`${chalk_1.default.greenBright("You have 20 tries to guess the correct PIN. Are you ready?")} ${chalk_1.default.yellowBright("[Y / N]")} `, (answer) => {
    if (answer && answer.toLocaleLowerCase() === 'y' || answer.toLocaleLowerCase() === '') {
        clearScreen();
        setPINAndStartGame();
    }
    else {
        exitGame();
    }
});
function printIntroduction() {
    console.log(chalk_1.default.green(`
 _____ _____ _____ _____ _____ _____ _____ _____ _____ ____  
|     |  _  |   __|_   _|   __| __  |     |     |   | |    \ 
| | | |     |__   | | | |   __|    -| | | |-   -| | | |  |  |
|_|_|_|__|__|_____| |_| |_____|__|__|_|_|_|_____|_|___|____/ 
==============================================================
`));
    console.log("\n");
    console.log(chalk_1.default.greenBright("I have locked your phone with a 4 digit PIN"));
    console.log(chalk_1.default.greenBright("All the digits of the PIN are unique digits from 0 to 9"));
    console.log(chalk_1.default.redBright("\t\tXXXX"));
    console.log("\n");
}
function setPINAndStartGame() {
    return __awaiter(this, void 0, void 0, function* () {
        const pin = generateRandomPIN();
        const board = new Board(pin);
        let remainingGuesses = 20;
        while (true) {
            clearScreen();
            console.log(board.getBoard());
            if (remainingGuesses === 0) {
                gameOver(pin);
                break;
            }
            console.log(chalk_1.default.greenBright(`${20 - remainingGuesses + 1}. Guess the PIN: `));
            const guess = yield readGuess();
            if (guess.length !== 4) {
                board.addError(chalk_1.default.red(`Your guess has to be 4 digits: ${guess}`));
                continue;
            }
            if (!Number.isInteger(Number(guess))) {
                board.addError(chalk_1.default.red(`Your guess has to be 4 digits: ${guess}`));
                continue;
            }
            remainingGuesses--;
            if (guess === pin) {
                guessSuccess();
                break;
            }
            board.addGuess(guess);
        }
        function guessSuccess() {
            console.log(chalk_1.default.greenBright(`You guessed the PIN correctly in ${20 - remainingGuesses} guesses`));
            exitGame();
        }
        function gameOver(pin) {
            console.log(chalk_1.default.red(`
The correct PIN was ${chalk_1.default.green(pin)} 
You failed to guess the correct PIN in 10 guesses. Your phone shall remain locked forever.
        `));
            exitGame();
        }
    });
}
function match(actual, guess) {
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
function readGuess() {
    return new Promise((resolve) => {
        readInterface.question(chalk_1.default.green(""), (guess) => {
            resolve(guess.trim());
        });
    });
}
function exitGame() {
    readInterface.close();
}
function clearScreen() {
    console.clear();
}
function generateRandomPIN() {
    let pin = "";
    while (true) {
        if (pin.length === 4) {
            break;
        }
        const digit = Math.ceil(Math.random() * 9);
        if (pin.indexOf(digit.toString()) === -1) {
            pin += digit;
        }
    }
    return pin;
}
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
            const guessResult = match(this.pin, guess);
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
}
