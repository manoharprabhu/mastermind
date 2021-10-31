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
const Board_1 = __importDefault(require("./Board"));
const totalGuesses = 20;
const readInterface = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
printIntroduction();
readInterface.question(chalk_1.default.greenBright(`\nYou have ${totalGuesses} tries to guess the correct PIN. Press enter to start.`), () => {
    clearScreen();
    setPINAndStartGame();
});
function printIntroduction() {
    console.log(chalk_1.default.green(`
    ██████  ██████  ██████  ███████  ██████ ██████   █████   ██████ ██   ██ ███████ ██████  
    ██      ██    ██ ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██      ██   ██ 
    ██      ██    ██ ██   ██ █████   ██      ██████  ███████ ██      █████   █████   ██████  
    ██      ██    ██ ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██      ██   ██ 
     ██████  ██████  ██████  ███████  ██████ ██   ██ ██   ██  ██████ ██   ██ ███████ ██   ██ 
                                                                                                                                                               
    =========================================================================================
`));
    console.log("\n");
    console.log(chalk_1.default.greenBright("\tI have locked your phone with a 4 digit PIN"));
    console.log(chalk_1.default.greenBright("\tAll the digits of the PIN are unique digits from 0 to 9"));
    console.log(chalk_1.default.redBright("\n\t\t\t\tXXXX"));
    console.log("\n");
}
function setPINAndStartGame() {
    return __awaiter(this, void 0, void 0, function* () {
        const pin = generateRandomPIN();
        const board = new Board_1.default(pin);
        let remainingGuesses = totalGuesses;
        while (true) {
            clearScreen();
            console.log(board.getBoard());
            if (remainingGuesses === 0) {
                gameOver(pin);
                break;
            }
            console.log(chalk_1.default.greenBright(`${totalGuesses - remainingGuesses + 1}. Guess the PIN: `));
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
            console.log(chalk_1.default.greenBright(`
=================================================================
        You guessed the PIN correctly in ${totalGuesses - remainingGuesses} guesses
=================================================================
`));
            exitGame();
        }
        function gameOver(pin) {
            console.log(chalk_1.default.red(`

==========================================================================================================
        The correct PIN was ${chalk_1.default.green(pin)} 
        You failed to guess the correct PIN in 10 guesses. Your phone shall remain locked forever.
==========================================================================================================

        `));
            exitGame();
        }
    });
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
