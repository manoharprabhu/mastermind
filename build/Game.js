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
class Game {
    constructor(totalGuesses) {
        this.fourDigitRegex = new RegExp("^[0-9]{4}$");
        this.totalGuesses = totalGuesses;
        this.readInterface = readline_1.default.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.flashScreen();
            this.clearScreen();
            this.printIntroduction();
        });
    }
    printIntroduction() {
        console.log(chalk_1.default.green(`
 ██████  ██████  ██████  ███████  ██████ ██████   █████   ██████ ██   ██ ███████ ██████  
██      ██    ██ ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██      ██   ██ 
██      ██    ██ ██   ██ █████   ██      ██████  ███████ ██      █████   █████   ██████  
██      ██    ██ ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██      ██   ██ 
 ██████  ██████  ██████  ███████  ██████ ██   ██ ██   ██  ██████ ██   ██ ███████ ██   ██ 
                                                                                                                                                                   
=========================================================================================
    `));
        console.log(chalk_1.default.greenBright(`I have locked your phone with a ${chalk_1.default.redBright("4 digit PIN")}`));
        console.log(chalk_1.default.greenBright(`All the digits of the PIN are unique digits from ${chalk_1.default.redBright("0 to 9")}\n`));
        this.readInterface.question(chalk_1.default.greenBright(`You have ${chalk_1.default.redBright(this.totalGuesses)} tries to guess the correct PIN. Press enter to start.\n`), () => {
            this.clearScreen();
            this.setPINAndStartGame();
        });
    }
    setPINAndStartGame() {
        return __awaiter(this, void 0, void 0, function* () {
            const pin = this.generateRandomPIN();
            const board = new Board_1.default(pin);
            let remainingGuesses = this.totalGuesses;
            while (true) {
                this.clearScreen();
                console.log(board.getBoard());
                if (remainingGuesses === 0) {
                    this.gameOver(pin);
                    break;
                }
                console.log(chalk_1.default.greenBright(`${this.totalGuesses - remainingGuesses + 1}. Guess the PIN: `));
                const guess = yield this.readGuess();
                if (guess.length !== 4) {
                    board.addError(chalk_1.default.red(`Your guess has to be 4 digits: ${guess}`));
                    continue;
                }
                if (!this.fourDigitRegex.test(guess)) {
                    board.addError(chalk_1.default.red(`Your guess has to be 4 digits: ${guess}`));
                    continue;
                }
                remainingGuesses--;
                if (guess === pin) {
                    this.guessSuccess(remainingGuesses);
                    break;
                }
                board.addGuess(guess);
                board.clearErrors();
            }
        });
    }
    guessSuccess(remainingGuesses) {
        console.log(chalk_1.default.greenBright(`
=================================================================
        You guessed the PIN correctly in ${this.totalGuesses - remainingGuesses} guesses
=================================================================
    `));
        this.exitGame();
    }
    gameOver(pin) {
        console.log(chalk_1.default.red(`    
==========================================================================================================
        The correct PIN was ${chalk_1.default.green(pin)} 
        You failed to guess the correct PIN in 10 guesses. Your phone shall remain locked forever.
==========================================================================================================
    
            `));
        this.exitGame();
    }
    flashScreen() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.flashColor(chalk_1.default.green.bgGreen, 80);
            yield this.flashColor(chalk_1.default.black.bgBlack, 80);
        });
    }
    flashColor(color, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const rows = process.stdout.rows || 24;
                const cols = process.stdout.columns || 80;
                for (let i = 0; i < rows * cols; i++) {
                    process.stdout.write(color(' '));
                }
                setTimeout(() => { resolve(); }, duration);
            });
        });
    }
    readGuess() {
        return new Promise((resolve) => {
            this.readInterface.question(chalk_1.default.green(""), (guess) => {
                resolve(guess.trim());
            });
        });
    }
    exitGame() {
        this.readInterface.close();
    }
    clearScreen() {
        console.clear();
    }
    generateRandomPIN() {
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
}
exports.default = Game;
