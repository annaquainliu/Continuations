import {SolveSat, Not, And, Or, Symbol} from "./scripts/continuations.js";

// window.onload = () => {
//     const body = document.getElementById("solution")
//     const SatSolver = new SolveSat();
//     const button = document.querySelector("button");
//     const input = document.getElementById("formula");

//     button.addEventListener("click", () => {
//         let formula = parseInput(input.value);
//     });
// }

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
        if (input[i] == "(" || input[i] == ")" || input[i] == " ") {
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
    queue = queue.reverse();
    return tokenize(queue);
}

console.log(parseInput("(&& x y z (|| y b))"));
// (&& x y z (|| y b))
// [), ), b, y, ||, (, z, y, x, &&, (]

function tokenize(queue) {
    if (queue.length == 0) {
        throw new Error("Ill-typed");
    }
    let front = queue.pop();
    if (front == "(") {
        return tokenize(queue);
    }

    let symbols = listTokenize(queue);
    if (front == "&&") {
       return new And(symbols);
    }
    if (front == "||") {
        return new Or(symbols);
    }
} 

function listTokenize(queue) {
    if (queue.length == 0) {
        return [];
    }
    let front = queue.pop();
    if (front ==  "(") {
        return tokenize(queue);
    }
    if (front == ")") {
        return [];
    }
    let symbols = listTokenize(queue);
    symbols.push(new Symbol(front));
    return symbols;
}

