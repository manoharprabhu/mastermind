#!/usr/bin/env node
import chalk from 'chalk'
import readline from 'readline'
const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

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
readInterface.question(`${chalk.greenBright("You have 10 tries to guess the correct PIN. Are you ready?")} ${chalk.yellowBright("[Y / N]")} `, (answer) => {
    if (answer && answer.toLocaleLowerCase() === 'y' || answer.toLocaleLowerCase() === '') {
        setPINAndStartGame()
    } else {
        exitGame()
    }
})

async function setPINAndStartGame() {
    const pin = generateRandomPIN()
    console.log(pin)
    let remainingGuesses = 10
    while (true) {
        if(remainingGuesses === 0) {
            console.log(chalk.redBright("You failed to guess the correct PIN in 10 guesses. Your phone shall remain locked forever."))
            break
        }
        console.log(chalk.greenBright(`${10 - remainingGuesses + 1}. What's your next guess? : `))
        const guess = await readGuess()
        if (guess.length !== 4) {
            console.log(chalk.red("Your guess has to be 4 digits"))
            continue
        }

        if (!Number(guess)) {
            console.log(chalk.red("Your guess has to be a 4 digit number"))
            continue
        }

        remainingGuesses--
        if(guess === pin) {
            console.log(chalk.greenBright(`You guessed the PIN correctly in ${10 - remainingGuesses} guesses`))
            // Redirect to game repeat menu
            break
        }

        const hint = match(pin, guess)
        console.log(`
            ${chalk.yellow(
                `${hint.correctPosition} of the numbers are in the correct position`
            )}\n
            ${chalk.yellow(
                `${hint.correctColor} of the numbers are in wrong order`
            )}
        `)
    }
}

function match(actual: String, guess: String): { correctPosition: number, correctColor: number } {
    let correctPosition = 0, correctColor = 0
    for (let i = 0; i < 4; i++) {
        if (actual.charAt(i) === guess.charAt(i)) {
            correctPosition++
        } else if (actual.indexOf(guess.charAt(i)) !== -1) {
            correctColor++
        }
    }

    return { correctPosition, correctColor }
}

function readGuess(): Promise<String> {
    return new Promise<String>((resolve) => {
        readInterface.question(chalk.green(""), (guess) => {
            resolve(guess.trim())
        })
    })
}

function exitGame() {
    readInterface.close()
}

function generateRandomPIN(): String {
    let pin = ""
    while(true) {
        if(pin.length === 4) {
            break
        }
        const digit = Math.ceil(Math.random() * 9)
        if(pin.indexOf(digit.toString()) === -1) {
            pin += digit
        }
    }
    return pin
}