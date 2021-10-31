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
const readInterface = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
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
readInterface.question(`${chalk_1.default.greenBright("You have 10 tries to guess the correct PIN. Are you ready?")} ${chalk_1.default.yellowBright("[Y / N]")} `, (answer) => {
    if (answer && answer.toLocaleLowerCase() === 'y' || answer.toLocaleLowerCase() === '') {
        setPINAndStartGame();
    }
    else {
        exitGame();
    }
});
function setPINAndStartGame() {
    return __awaiter(this, void 0, void 0, function* () {
        const pin = generateRandomPIN();
        console.log(pin);
        let remainingGuesses = 10;
        while (true) {
            if (remainingGuesses === 0) {
                console.log(chalk_1.default.redBright("You failed to guess the correct PIN in 10 guesses. Your phone shall remain locked forever."));
                break;
            }
            console.log(chalk_1.default.greenBright(`${10 - remainingGuesses + 1}. What's your next guess? : `));
            const guess = yield readGuess();
            if (guess.length !== 4) {
                console.log(chalk_1.default.red("Your guess has to be 4 digits"));
                continue;
            }
            if (!Number(guess)) {
                console.log(chalk_1.default.red("Your guess has to be a 4 digit number"));
                continue;
            }
            remainingGuesses--;
            if (guess === pin) {
                console.log(chalk_1.default.greenBright(`You guessed the PIN correctly in ${10 - remainingGuesses} guesses`));
                // Redirect to game repeat menu
                break;
            }
            const hint = match(pin, guess);
            console.log(`
            ${chalk_1.default.yellow(`${hint.correctPosition} of the numbers are in the correct position`)}\n
            ${chalk_1.default.yellow(`${hint.correctColor} of the numbers are in wrong order`)}
        `);
        }
    });
}
function match(actual, guess) {
    let correctPosition = 0, correctColor = 0;
    for (let i = 0; i < 4; i++) {
        if (actual.charAt(i) === guess.charAt(i)) {
            correctPosition++;
        }
        else if (actual.indexOf(guess.charAt(i)) !== -1) {
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
