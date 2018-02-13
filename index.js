const cl = console.log
const string = `
	4 8 7 3 
	2 5 9 3 
	6 3 2 5 
	4 4 1 6`

const lines = string.split('\n\t').filter(i => i)
const matrix = lines.map(i => i.split(' ').filter(i => i))

class Matrix {
	constructor (matrix) {
		this.matrix = matrix
		cl(matrix)
		//cl(this.matrix[2][3])
		this.checkSides(3, 3)
	}

	findHighestNumber () {

	}

	current (x, y) {
		return this.matrix[x] && this.matrix[x][y]
	}

	up (x, y) {
		return this.matrix[x - 1] && this.matrix[x - 1][y]
	}

	down (x, y) {
		return this.matrix[x + 1] && this.matrix[x + 1][y]
	}

	left (x, y) {
		return this.matrix[x] && this.matrix[x][y - 1]
	}

	right (x, y) {
		return this.matrix[x] && this.matrix[x][y + 1];
	}

	checkSides (x, y) {
		const minIndex = this.getLowestArrElemIndex(this.left(x, y), this.right(x, y), this.up(x, y), this.down(x, y));
		const nextDir = this.getDirToGo(minIndex);
		cl(this[nextDir]);
	}

	getDirToGo(index) {
		switch (index) {
			case 0: return 'left';
			case 1: return 'right';
			case 3: return 'up';
			case 4: return 'down';
		}
	}

	getLowestArrElemIndex (...args) {
		const onlyTruthyValues = args.map(i => i || Infinity);
		const min = Math.min(...onlyTruthyValues);

		return args.indexOf(min.toString())
	}
}

new Matrix(matrix)