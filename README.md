# Continuations

## Summary
This [website](https://annaquainliu.github.io/Continuations/) that demonstrates the steps to SAT solving (or boolean formula solving.) The input takes one boolean formula, and outputs the answer that satisfies the formula, along with the steps that the SAT solver takes to come to the solution.

Anything highlighted in green is the success continuation, while anything highlighted in red is the failure continuation.

## Syntax
*BF* stands for BooleanFormula

*BF* := (&& *BF*<sub>1</sub>, ..., *BF*<sub>n</sub>)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  (|| *BF*<sub>1</sub>, ..., *BF*<sub>n</sub>)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  !*BF*

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  *sym*

### Examples
- (&& x y z) *(This is equivalent to x && y && z)*
- (|| x y z)
- (|| x (&& y z)) *(This is equivalent to (x || (y && z)))*
- (|| !x !y) *(This is equivalent to (!x || !y))*
- !(|| z y) *(This is equivalent to !(z || y))*
