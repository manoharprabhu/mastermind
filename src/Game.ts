import chalk from 'chalk'
import readline from 'readline'
import Board from './Board'

export default class Game {
    private totalGuesses: number
    private readInterface: readline.Interface
    constructor(totalGuesses: number) {
        this.totalGuesses = totalGuesses
        this.readInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    public start() {
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
        console.log("\n")
        console.log(chalk.greenBright("\tI have locked your phone with a 4 digit PIN"))
        console.log(chalk.greenBright("\tAll the digits of the PIN are unique digits from 0 to 9"))
        console.log(chalk.redBright("\n\t\t\t\tXXXX"))
        console.log("\n")
        this.readInterface.question(chalk.greenBright(`\nYou have ${this.totalGuesses} tries to guess the correct PIN. Press enter to start.`), () => {
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

            if (!Number.isInteger(Number(guess))) {
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
        console.log(chalk.greenBright(
            `
    =================================================================
            You guessed the PIN correctly in ${this.totalGuesses - remainingGuesses} guesses
    =================================================================
    `
        ))
        this.exitGame()
    }

    private gameOver(pin: string) {
        console.log(chalk.red(
            `
    
    ==========================================================================================================
            The correct PIN was ${chalk.green(pin)} 
            You failed to guess the correct PIN in 10 guesses. Your phone shall remain locked forever.
    ==========================================================================================================
    
            `
        )
        )

        this.exitGame()
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