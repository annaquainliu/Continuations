import {SolveSat, Not, And, Or, Symbol} from "./scripts/continuations.js";

window.onload = () => {
    const body = document.getElementById("solution")
    const SatSolver = new SolveSat();
    const button = document.querySelector("button");
    const input = document.getElementById("formula");

    button.addEventListener("click", () => {
        let formula = parseInput(input.value);
    })
}
/**
 * 
 * @param {String} input 
 * @returns {BooleanFormula}
 */
function parseInput(input) {
    let fields = input.split(" ");
    let queue = [];
    let stack = [];
    for (let field in fields) {
        if (field == "" || field == null) {
            continue;
        }
        queue.push(field);
    }
    queue.reverse();
    // x && y && x && t || z
    while (queue.length != 0) {
        let front = queue.pop();
        if (front == "!") {
            let bool = queue.pop();
            stack.push(new Not())
        } 
        else if (front == "&&") {

        }  
        else if (front == "||") {

        } 
        else {

        }
    }
}
