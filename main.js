import {SolveSat, Not, And, Or, Symbol} from "./scripts/continuations.js";

window.onload = () => {
    const body = document.getElementById("solution")
    const SatSolver = new SolveSat();
    body.innerText = JSON.stringify(SatSolver.solve(new Symbol("x"), () => "FAIL", (cur, resume) => cur));
}
