#!/usr/bin/env node
import chalk from 'chalk'
import readline from 'readline'
import Board from './Board'

const totalGuesses = 20

const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

printIntroduction()

readInterface.question(chalk.greenBright(`\nYou have ${totalGuesses} tries to guess the correct PIN. Press enter to start.`), () => {
    clearScreen()
    setPINAndStartGame()
})

function printIntroduction() {
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
}

async function setPINAndStartGame() {
    const pin = generateRandomPIN()
    const board = new Board(pin)
    let remainingGuesses = totalGuesses
    while (true) {
        clearScreen()
        console.log(board.getBoard())

        if (remainingGuesses === 0) {
            gameOver(pin)
            break
        }

        console.log(chalk.greenBright(`${totalGuesses - remainingGuesses + 1}. Guess the PIN: `))
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
        board.clearErrors()
    }

    function guessSuccess() {
        console.log(chalk.greenBright(
`
=================================================================
        You guessed the PIN correctly in ${totalGuesses - remainingGuesses} guesses
=================================================================
`
        ))
        exitGame()
    }

    function gameOver(pin: string) {
        console.log(chalk.red(
            `

==========================================================================================================
        The correct PIN was ${chalk.green(pin)} 
        You failed to guess the correct PIN in 10 guesses. Your phone shall remain locked forever.
==========================================================================================================

        `
        )
        )

        exitGame()
    }
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