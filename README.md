# Continuations

## Summary
Website that demonstrates the steps to SAT solving (or boolean formula solving.) The input intakes one boolean formula, and outputs the answer that satisfies the formula, along with the steps that the SAT solver takes to come to the solution.

## Syntax
BF stands for BooleanFormula

BF := (&& BF_1, ..., BF_n)

   |  (|| BF_1, ..., BF_n)
   
   |  !BF
   
   |  symvalue
   
