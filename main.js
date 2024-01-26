import {SolveSat, Not, And, Or, Symbol} from "./scripts/continuations.js";
// const {SolveSat, Not, And, Or, Symbol} = require("./scripts/continuations");

window.onload = () => {
    const body = document.getElementById("solution")
    const SatSolver = new SolveSat();
    const button = document.querySelector("button");
    const input = document.getElementById("formula");

    button.addEventListener("click", () => {
        let formula = parseInput(input.value);
        console.log(formula);
        body.innerText = formula.toString();
    });
}

/**
 * 
 * @param {String} input 
 * @returns {BooleanFormula}
 */
function parseInput(input) {
    input = input.toLowerCase();
    let queue = [];
    let str = "";
    for (let i = 0; i < input.length; i++) {
        if (input[i] == "(" || input[i] == ")" || input[i] == " " || input[i] == "!") {
            if (str != "") {
                queue.push(str);
            }
            if (input[i] != " ") {
                queue.push(input[i]);
            }
            str = ""
        }
        else {
            str += input[i];
        }
    }
    if (queue.length == 0 && input.length != 0) {
        queue.push(input);
    }
    queue = queue.reverse();
    console.log(queue);
    return tokenize(queue);
}

// console.log(parseInput("(&& x y z (|| y b))").toString());
// console.log(parseInput("(|| x (&& y !h))").toString());
// console.log(parseInput("(&& !y z !a)").toString());

function tokenize(queue) {
    if (queue.length == 0) {
        throw new Error("Ill-typed");
    }
    let front = queue.pop();
    if (front == "(") {
        return tokenize(queue);
    }
    if (front == "!" && queue[1] == "(") {
        return new Not(tokenize(queue));
    }
    let symbols = listTokenize(queue);
    if (front == "&&") {
       return new And(symbols);
    }
    if (front == "||") {
        return new Or(symbols);
    }
    return new Symbol(front);
} 

function listTokenize(queue) {
    if (queue.length == 0) {
        return [];
    }
    let front = queue.pop();
    if (front ==  "(") {
        return [tokenize(queue)];
    }
    if (front == ")") {
        return [];
    }
    if (front == "!") {
        front = queue.pop();
        let symbols = listTokenize(queue);
        symbols.push(new Not(new Symbol(front)));
        return symbols;
    }
    let symbols = listTokenize(queue)
    symbols.push(new Symbol(front));
    return symbols;
}


