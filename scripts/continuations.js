// abstract class
class BooleanFormula {

    /**
     * 
     * @param {List<BooleanFormula>} args 
     */
    constructor(args) {
        this.args = args;
    }

    toString(symbol) {
        let str = symbol + "(";
        if (this.args.length == 0) {
            str += ")";
            return str;
        }
        for (let arg of this.args) {
            str += arg + ", ";
        } 
        str = str.substring(0, str.length - 2) + ")";
        return str;
    }
}

class Not extends BooleanFormula {
    /**
     * 
     * @param {BooleanFormula} formula 
     */
    constructor(formula) {
        super([formula]);
    }

    toString() {
        return super.toString("Not");
    }
}

class And extends BooleanFormula {

    /**
     * 
     * @param {BooleanFormula []} formulas 
     */
    constructor(formulas) {
        super(formulas);
    }

    toString() {
        return super.toString("And");
    }
}

class Or extends BooleanFormula {

    /**
     * 
     * @param {BooleanFormula []} formulas 
     */
    constructor(formulas) {
        super(formulas);
    }

    toString() {
        return super.toString("Or");
    }
}

class Symbol extends BooleanFormula {

    /**
     * 
     * @param {String} string : Name of symbol
     */
    constructor(string) {
        super([string]);
    }

    toString() {
        return "'" + this.args[0];
    }
}

function boolToString(bool) {
    return bool ? "#t" : "#f";
}

/**
 * @param {List<BooleanFormula>} formulas 
 * @returns {String}
 */
function formulasToString(formulas) {
    if (formulas.length == 0) {
        return "[]";
    }
    let str = "[";
    for (let f of formulas) {
        str += f.toString() + ", ";
    }
    str = str.substring(0, str.length - 2);
    str += "]";
    return str;
}

/**
 * Makes a function call into a string
 * @param {String} name 
 * @param {List<BooleanFormula> | BooleanFormula} fs 
 * @param {Boolean} bool 
 * @param {Map<String, Boolean>} curr 
 * @param {FunctionObject} fail 
 * @param {FunctionObject} succ 
 * @returns {String}
 */
function funCallToString(name, fs, bool, curr, fail, succ) {
    let str = "(" + name + " ";
    if (fs instanceof BooleanFormula) {
        str += fs.toString();
    }
    else {
        str += formulasToString(fs);
    }
    str += " ";
    str += boolToString(bool) + " ";
    str += JSON.stringify(curr) + " ";
    str += fail.toString() + " ";
    str += succ.toString() + ")";
    return str;
}



/**
 * 
 * @param {Object []} list 
 * @returns first element of list
 */
function car(list) {
    return list[0];
}

/**
 * Deep copy cdr
 * @param {Object []} list 
 * @returns entire list except first element
 */
function cdr(list) {
    //deep copy
    let array = []
    for (let i = 1; i < list.length; i++) {
        array.push(list[i]); 
    }
    return array;
}

class SolveSat {

    steps = [];
    // tree;

    reset() {
        this.steps = [];
    }

    /**
     * 
     * @param {BooleanFormula []} fs 
     * @param {Boolean} bool 
     * @param {JSON} cur 
     * @param {FunctionObject} fail 
     * @param {FunctionObject} succ 
     * @returns {Map<String, Boolean>}
     */
    solveAny(fs, bool, cur, fail, succ) {
        this.steps.push(funCallToString("solveAny", fs, bool, cur, fail, succ));
        cur = JSON.parse(JSON.stringify(cur));
        if (fs.length == 0) {
            this.steps.push("(" + fail.toString() + ")");
            return fail.fun();
        }
        return this.solveFormula(car(fs), bool, cur, 
        new FailCont("(lambda () " + funCallToString("solveAny", cdr(fs), bool, cur, fail, succ) + ")",
            () => {
                return this.solveAny(cdr(fs), bool, cur, fail, succ)
            }), succ);
    }

    /**
     * 
     * @param {BooleanFormula []} fs 
     * @param {Boolean} bool 
     * @param {JSON} cur 
     * @param {FunctionObject} fail 
     * @param {FunctionObject} succ 
     * @returns {Map<String, Boolean>}
     */
    solveAll(fs, bool, cur, fail, succ) {
        this.steps.push(funCallToString("solveAll", fs, bool, cur, fail, succ));
        cur = JSON.parse(JSON.stringify(cur));
        if (fs.length == 0) {
            this.steps.push("(" + succ.toString() + " " + JSON.stringify(cur) + " " + fail.toString() + ")");
            return succ.fun(cur, fail);
        }
        return this.solveFormula(car(fs), bool, cur, fail, 
        new SuccessCont("(lambda (env resume) " + "(solveAll " + formulasToString(cdr(fs)) + " " + boolToString(bool) + " env resume " + succ.string + ")", 
            (env, resume) => {
                return this.solveAll(cdr(fs), bool, env, resume, succ);
            }));
    }

    /**
     * 
     * @param {Symbol} f
     * @param {Boolean} bool 
     * @param {JSON} cur 
     * @param {FunctionObject} fail 
     * @param {FunctionObject} succ 
     * @returns {Map<String, Boolean>}
     */
    solveSymbol(fSym, bool, cur, fail, succ) {
        this.steps.push(funCallToString("solveSymbol", fSym, bool, cur, fail, succ));
        cur = JSON.parse(JSON.stringify(cur));
        let f = fSym.args[0];
        if (cur[f] == null) {
            cur[f] = bool;
            this.steps.push("(" + succ.toString() + " " + JSON.stringify(cur) + " " + fail.toString() + ")")
            console.log(succ.toString());
            return succ.fun(cur, fail);
        } 
        else {
            if (cur[f] == bool) {
                this.steps.push("(" + succ.toString() + " " + JSON.stringify(cur) + " " + fail.toString() + ")")
                return succ.fun(cur, fail);
            }
            else {
                this.steps.push("(" + fail.toString() + ")");
                return fail.fun();
            }
        }
    }

    /**
     * 
     * @param {BooleanFormula} f 
     * @param {Boolean} bool 
     * @param {JSON} cur 
     * @param {FunctionObject} fail 
     * @param {FunctionObject} succ 
     * @returns {Map<String, Boolean>}
     */
    solveFormula(f, bool, cur, fail, succ) {
        this.steps.push(funCallToString("solveFormula", f, bool, cur, fail, succ))
        cur = JSON.parse(JSON.stringify(cur));
        if (f instanceof Symbol) {
            return this.solveSymbol(f, bool, cur, fail, succ)
        }
        else if (f instanceof Not) {
            return this.solveFormula(f.args[0], !bool, cur, fail, succ)
        }
        else if (f instanceof Or) {
            if (bool) {
                return this.solveAny(f.args, bool, cur, fail, succ);
            } 
            else {
                return this.solveAll(f.args, bool, cur, fail, succ);
            }
        }
        else {
            if (bool) {
                return this.solveAll(f.args, bool, cur, fail, succ);
            }
            else {
                return this.solveAny(f.args, bool, cur, fail, succ);
            }
        }
    }

    /**
     * SolveSat(f, fail, succ) 
     * 
     * @param {BooleanFormula} f : Boolean formula SolveSat will try to solve
     * @param {Function} fail : 0 parameters, called when no solution is found
     * @param {Function} succ : 2 parameters, called when solution is found
     * @returns {Map<String, Boolean>} Value of the appropriate continuation call
     */
    solve(f, fail, succ) {
        return this.solveFormula(f, true, {}, new FailCont("(lambda () 'Fail!-NoSolution.)", fail), new SuccessCont("(lambda (curr resume) curr)", succ))
    }
}

class FunctionObject {
    
    string;
    fun;
    color;

    /**
     * Creates a FunctionObject that contains a 
     * stringified version of a lambda.
     * 
     * @param {String} string 
     * @param {Function} fun 
     */
    constructor(string, fun) {
        this.string = string;
        this.fun = fun;
        this.color = "";
    }
}

class SuccessCont extends FunctionObject {

    constructor(string, fun) {
        super(string, fun);
        this.color = "green";
    }

    toString() {
        return `<span class='succCont'> ${this.string} </span>`;
    }
}

class FailCont extends FunctionObject {

    constructor(string, fun) {
        super(string, fun);
        this.color = "red";
    }

    toString() {
        return `<span class='failCont'> ${this.string} </span>`;
    }
}

export {SolveSat, Not, And, Or, Symbol}
// module.exports = {SolveSat : SolveSat, Not : Not, And : And, Or : Or, Symbol : Symbol}