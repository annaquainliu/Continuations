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
        if (this.args.length == 1) {
            return symbol + " " + this.args[0].toString();
        }
        let str = "";
        for (let i in this.args) {
            if (i == this.args.length - 1) {
                str += this.args[i].toString();
            }
            else {
                str += this.args[i].toString() + " " + symbol + " ";
            }
        }
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
        return "¬" + this.args[0].toString();
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
        return "(" + super.toString("&&") + ")";
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
        return "(" + super.toString("||") + ")";
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
        return this.args[0];
    }
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
 * 
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

    /**
     * 
     * @param {BooleanFormula []} fs 
     * @param {Boolean} bool 
     * @param {JSON} cur 
     * @param {Function} fail 
     * @param {Function} succ 
     * @returns 
     */
    solveAny(fs, bool, cur, fail, succ) {
        cur = JSON.parse(JSON.stringify(cur));
        if (fs.length == 0) {
            return fail();
        }
        return this.solveFormula(car(fs), bool, cur, 
        () => {
            return this.solveAny(cdr(fs), bool, cur, fail, succ)
        }, succ);
    }

    /**
     * 
     * @param {BooleanFormula []} fs 
     * @param {Boolean} bool 
     * @param {JSON} cur 
     * @param {Function} fail 
     * @param {Function} succ 
     * @returns 
     */
    solveAll(fs, bool, cur, fail, succ) {
        cur = JSON.parse(JSON.stringify(cur));
        if (fs.length == 0) {
            return succ(cur, fail);
        }
        return this.solveFormula(car(fs), bool, cur, fail, (env, resume) => {
            return this.solveAll(cdr(fs), bool, env, resume, succ);
        });
    }

    /**
     * 
     * @param {BooleanFormula} f
     * @param {Boolean} bool 
     * @param {JSON} cur 
     * @param {Function} fail 
     * @param {Function} succ 
     * @returns 
     */
    solveSymbol(f, bool, cur, fail, succ) {
        cur = JSON.parse(JSON.stringify(cur));
        if (cur[f] == null) {
            cur[f] = bool;
            return succ(cur, fail);
        } 
        else {
            if (cur[f] == bool) {
                return succ(cur, fail);
            }
            else {
                return fail();
            }
        }
    }

    /**
     * 
     * @param {BooleanFormula} f 
     * @param {Boolean} bool 
     * @param {JSON} cur 
     * @param {Function} fail 
     * @param {Function} succ 
     * @returns 
     */
    solveFormula(f, bool, cur, fail, succ) {
        cur = JSON.parse(JSON.stringify(cur));
        if (f instanceof Symbol) {
            return this.solveSymbol(f.args[0], bool, cur, fail, succ)
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
     * @returns Value of the appropriate continuation call
     */
    solve(f, fail, succ) {
        return this.solveFormula(f, true, {}, fail, succ)
    }
}

export {SolveSat, Not, And, Or, Symbol}
// module.exports = {SolveSat : SolveSat, Not : Not, And : And, Or : Or, Symbol : Symbol}