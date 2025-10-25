/**
 * prerequisites: Typescript 5.9.3 & Nodejs globally installed on the machine.
 * To run the code, use the following command at problem4/:
 * 
 * tsc math.utils.ts --target es2020 --module commonjs --outDir . && node math.utils.js && rm math.utils.js
 */

// Complexity of the approach: O(1)
function sum_to_n_a(n: number): number {
	return n * (n + 1) / 2;
}

// Complexity of the approach: O(n)
// Take extra memory to store the array
function sum_to_n_b(n: number): number {
	return new Array<number>(n + 1).fill(0).reduce((acc, cur, i) => acc + i, 0);
}

// Complexity of the approach: O(1)
// Bitwise operation, no extra memory
function sum_to_n_c(n: number): number {
    return n * (n + 1) >> 1;
}

const n = 10;
console.log(`With N = ${n}, these are the sums to N`);
console.log("Approach A: ", sum_to_n_a(n));
console.log("Approach B: ", sum_to_n_b(n));
console.log("Approach C: ", sum_to_n_c(n));