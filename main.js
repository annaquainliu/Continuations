import {SolveSat, Not, And, Or, Symbol} from "./scripts/continuations.js";
// const {SolveSat, Not, And, Or, Symbol} = require("./scripts/continuations");

window.onload = () => {
    const body = document.getElementById("solution")
    const steps = document.getElementById("steps");
    const SatSolver = new SolveSat();
    const button = document.querySelector("button");
    const input = document.getElementById("formula");

    button.addEventListener("click", () => {
        SatSolver.reset();
        steps.innerHTML = "";
        let formula = parseInput(input.value);
        console.log(formula);
        let answer = SatSolver.solve(formula, () => "Fail! No Solution.", (curr, resume) => JSON.stringify(curr));
        body.innerText = answer;
        for (let step of SatSolver.steps) {
            let child = document.createElement("p");
            child.innerHTML = step;
            steps.appendChild(child);
        }
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
// console.log(parseInput("(&& x !(|| z !(|| b x c)))").toString());

function tokenize(queue) {
    if (queue.length == 0) {
        throw new Error("Ill-typed");
    }
    let front = queue.pop();
    if (front == "(") {
        return tokenize(queue);
    }
    if (front == "!") {
        return new Not(tokenize(queue));
    }
    if (front == "&&") {
       let symbols = listTokenize(queue);
       return new And(symbols);
    }
    if (front == "||") {
        let symbols = listTokenize(queue);
        return new Or(symbols);
    }
    return new Symbol(front);
} 

function listTokenize(queue) {
    if (queue.length == 0) {
        throw new Error("Ill typed!!!!");
    }
    let symbols = [];
    let front = queue[queue.length - 1];
    while (queue.length != 0 && front != ")") {
        symbols.push(tokenize(queue));
        front = queue[queue.length - 1];
    }
    if (front == ")") {
        queue.pop();
    }
    return symbols;
}