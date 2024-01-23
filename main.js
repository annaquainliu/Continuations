// import {SolveSat, Not, And, Or, Symbol} from "./scripts/continuations.js";

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
    input = input.replaceAll("(", "");
    input = input.replaceAll(")", "");
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
    return queue;
}

function tokenize(queue) {
    
}


