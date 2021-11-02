import chalk from 'chalk'
import readline from 'readline'
import Board from './Board'

export default class Game {
    private totalGuesses: number
    private readInterface: readline.Interface
    private fourDigitRegex = new RegExp("^[0-9]{4}$")
    constructor(totalGuesses: number) {
        this.totalGuesses = totalGuesses
        this.readInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    public async start() {
        await this.flashScreen()
        this.clearScreen()
        this.printIntroduction()
    }

    private printIntroduction() {
        console.log(chalk.green(`
 ██████  ██████  ██████  ███████  ██████ ██████   █████   ██████ ██   ██ ███████ ██████  
██      ██    ██ ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██      ██   ██ 
██      ██    ██ ██   ██ █████   ██      ██████  ███████ ██      █████   █████   ██████  
██      ██    ██ ██   ██ ██      ██      ██   ██ ██   ██ ██      ██  ██  ██      ██   ██ 
 ██████  ██████  ██████  ███████  ██████ ██   ██ ██   ██  ██████ ██   ██ ███████ ██   ██ 
                                                                                                                                                                   
=========================================================================================
    `))
        console.log(chalk.greenBright(`I have locked your phone with a ${chalk.redBright("4 digit PIN")}`))
        console.log(chalk.greenBright(`All the digits of the PIN are unique digits from ${chalk.redBright("0 to 9")}\n`))
        this.readInterface.question(chalk.greenBright(`You have ${chalk.redBright(this.totalGuesses)} tries to guess the correct PIN. Press enter to start.\n`), () => {
            this.clearScreen()
            this.setPINAndStartGame()
        })
    }

    private async setPINAndStartGame() {
        const pin = this.generateRandomPIN()
        const board = new Board(pin)
        let remainingGuesses = this.totalGuesses
        while (true) {
            this.clearScreen()
            console.log(board.getBoard())

            if (remainingGuesses === 0) {
                this.gameOver(pin)
                break
            }

            console.log(chalk.greenBright(`${this.totalGuesses - remainingGuesses + 1}. Guess the PIN: `))
            const guess = await this.readGuess()
            if (guess.length !== 4) {
                board.addError(chalk.red(`Your guess has to be 4 digits: ${guess}`))
                continue
            }

            if (!this.fourDigitRegex.test(guess)) {
                board.addError(chalk.red(`Your guess has to be 4 digits: ${guess}`))
                continue
            }

            remainingGuesses--
            if (guess === pin) {
                this.guessSuccess(remainingGuesses)
                break
            }

            board.addGuess(guess)
            board.clearErrors()
        }
    }

    private guessSuccess(remainingGuesses: number) {
        this.printInBox(chalk.black.bgGreenBright, `You guessed the PIN correctly in ${this.totalGuesses - remainingGuesses} guesses`)
        this.exitGame()
    }

    private gameOver(pin: string) {
        this.printInBox(chalk.black.bgRedBright, `You failed. The correct PIN was ${chalk.black.bold(pin)}`, -28)
        this.exitGame()
    }

    private printInBox(color: chalk.Chalk, text: string, boxSizeAdjustment: number = 0) {
        console.log()
        const padding = 5
        const boxWidth = text.length + padding + padding + boxSizeAdjustment
        const boxHeight = 2
        for(let i = 0; i < boxHeight / 2; i++) {
            for(let k = 0; k < boxWidth; k++) {
                process.stdout.write(color(' '))
            }
            console.log()
        }
        for(let i = 0; i < padding; i++) {
            process.stdout.write(color(' '))
        }

        process.stdout.write(color(text))
        
        for(let i = 0; i < padding; i++) {
            process.stdout.write(color(' '))
        }
        
        console.log()

        for(let i = 0; i < boxHeight / 2; i++) {
            for(let k = 0; k < boxWidth; k++) {
                process.stdout.write(color(' '))
            }
            console.log()
        }
        console.log()
    }

    private async flashScreen() {
        await this.flashColor(chalk.green.bgGreen, 80)
        await this.flashColor(chalk.black.bgBlack, 80)
    }

    private async flashColor(color: chalk.Chalk, duration: number): Promise<void> {
        return new Promise((resolve) => {
            const rows = process.stdout.rows || 24
            const cols = process.stdout.columns || 80
            for (let i = 0; i < rows * cols; i++) {
                process.stdout.write(color(' '))
            }
            setTimeout(() => { resolve() }, duration)
        })
    }

    private readGuess(): Promise<string> {
        return new Promise<string>((resolve) => {
            this.readInterface.question(chalk.green(""), (guess) => {
                resolve(guess.trim())
            })
        })
    }

    private exitGame() {
        this.readInterface.close()
    }

    private clearScreen() {
        console.clear()
    }


    private generateRandomPIN(): string {
        let pin = ""
        while (true) {
            if (pin.length === 4) {
                break
            }
            const digit = Math.ceil(Math.random() * 9)
            if (pin.indexOf(digit.toString()) === -1) {
                pin += digit
            }
        }
        return pin
    }
}