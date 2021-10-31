#!/usr/bin/env node
import chalk from 'chalk'
import readline from 'readline'
import { table } from 'table'

const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

printIntroduction()

readInterface.question(`${chalk.greenBright("You have 20 tries to guess the correct PIN. Are you ready?")} ${chalk.yellowBright("[Y / N]")} `, (answer) => {
    if (answer && answer.toLocaleLowerCase() === 'y' || answer.toLocaleLowerCase() === '') {
        clearScreen()
        setPINAndStartGame()
    } else {
        exitGame()
    }
})

function printIntroduction() {
    console.log(chalk.green(`
 _____ _____ _____ _____ _____ _____ _____ _____ _____ ____  
|     |  _  |   __|_   _|   __| __  |     |     |   | |    \ 
| | | |     |__   | | | |   __|    -| | | |-   -| | | |  |  |
|_|_|_|__|__|_____| |_| |_____|__|__|_|_|_|_____|_|___|____/ 
==============================================================
`))
    console.log("\n")
    console.log(chalk.greenBright("I have locked your phone with a 4 digit PIN"))
    console.log(chalk.greenBright("All the digits of the PIN are unique digits from 0 to 9"))
    console.log(chalk.redBright("\t\tXXXX"))
    console.log("\n")
}

async function setPINAndStartGame() {
    const pin = generateRandomPIN()
    const board = new Board(pin)
    let remainingGuesses = 20
    while (true) {
        clearScreen()
        console.log(board.getBoard())

        if (remainingGuesses === 0) {
            gameOver(pin)
            break
        }

        console.log(chalk.greenBright(`${20 - remainingGuesses + 1}. Guess the PIN: `))
        const guess = await readGuess()
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
            guessSuccess()
            break
        }

        board.addGuess(guess)
    }

    function guessSuccess() {
        console.log(chalk.greenBright(`You guessed the PIN correctly in ${20 - remainingGuesses} guesses`))
        exitGame()
    }

    function gameOver(pin: string) {
        console.log(chalk.red(
            `
The correct PIN was ${chalk.green(pin)} 
You failed to guess the correct PIN in 10 guesses. Your phone shall remain locked forever.
        `
        )
        )

        exitGame()
    }
}

function match(actual: string, guess: string): { correctPosition: number, correctColor: number } {
    let correctPosition = 0, correctColor = 0
    const matchedSet: Set<string> = new Set<string>()
    for (let i = 0; i < 4; i++) {
        // match red
        if(guess.charAt(i) === actual.charAt(i)) {
            correctPosition++
            matchedSet.add(guess.charAt(i))
        }
    }

    for (let i = 0; i < 4; i++) {
        // match white
        if(guess.charAt(i) !== actual.charAt(i)) {
            if(!matchedSet.has(guess.charAt(i)) && actual.indexOf(guess.charAt(i)) !== -1)
            correctColor++
        }
    }


    return { correctPosition, correctColor }
}

function readGuess(): Promise<string> {
    return new Promise<string>((resolve) => {
        readInterface.question(chalk.green(""), (guess) => {
            resolve(guess.trim())
        })
    })
}

function exitGame() {
    readInterface.close()
}

function clearScreen() {
    console.clear()
}

function generateRandomPIN(): string {
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

class Board {
    private pin: string
    private readonly rightDigitWrongPosition = chalk.green("●") // right digit wrong position

    private readonly rightDigitRightPosition = chalk.red("●") // right position

    private readonly wrongPosition = chalk.white("●") // no match

    constructor(pin: string) {
        this.pin = pin
    }
    private header: string =
        `
    ${this.rightDigitWrongPosition} - Correct guess, wrong position
    ${this.rightDigitRightPosition} - Correct guess, correct position
    ${this.wrongPosition} - Wrong guess
    `

    private guesses: string[] = []
    private errors: string[] = []

    public addGuess(guess: string) {
        this.guesses.push(guess)
    }

    public addError(error: string) {
        this.errors.push(error)
    }

    public getBoard(): string {
        const result: string[][] = []
        this.guesses.forEach((guess) => {
            const row: string[] = []
            const digits = guess.split('')
            row.push(...digits)

            const guessResult = match(this.pin, guess)
            let dots: string = ""
            for (let i = 0; i < guessResult.correctColor; i++) {
                dots += this.rightDigitWrongPosition + " "
            }
            for (let i = 0; i < guessResult.correctPosition; i++) {
                dots += this.rightDigitRightPosition + " "
            }

            for (let i = 0; i < 4 - guessResult.correctPosition - guessResult.correctColor; i++) {
                dots += this.wrongPosition + " "
            }

            row.push(dots.slice(0, 24) + "\n" + dots.slice(24))

            result.push(row)
        })

        if (result.length === 0) {
            return ""
        }
        let data = table(result, {
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
        })
        data += '\n'
        data += this.errors.join('\n')

        return data
    }

}