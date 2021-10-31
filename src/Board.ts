import chalk from 'chalk'
import { table } from 'table'

export default class Board {
    private pin: string
    private readonly rightDigitWrongPosition = chalk.blueBright("●") // right digit wrong position

    private readonly rightDigitRightPosition = chalk.greenBright("●") // right position

    private readonly wrongPosition = chalk.grey("●") // no match

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

    public clearErrors() {
        this.errors = []
    }

    public getBoard(): string {
        const result: string[][] = []
        this.guesses.forEach((guess) => {
            const row: string[] = []
            const digits = guess.split('')
            row.push(...digits)

            const guessResult = this.match(this.pin, guess)
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

    private match(actual: string, guess: string): { correctPosition: number, correctColor: number } {
        let correctPosition = 0, correctColor = 0
        const matchedSet: Set<string> = new Set<string>()
        for (let i = 0; i < 4; i++) {
            // match red
            if (guess.charAt(i) === actual.charAt(i)) {
                correctPosition++
                matchedSet.add(guess.charAt(i))
            }
        }

        for (let i = 0; i < 4; i++) {
            // match white
            if (guess.charAt(i) !== actual.charAt(i)) {
                if (!matchedSet.has(guess.charAt(i)) && actual.indexOf(guess.charAt(i)) !== -1) {
                    correctColor++
                    matchedSet.add(guess.charAt(i))
                }
            }
        }


        return { correctPosition, correctColor }
    }
}