/**
 * Matrix class which handles Matrix creation
 * and path computations
 * @type {module.Matrix}
 */
module.exports = class Matrix {
	constructor (string) {
		/**
		 * Keeps the length of the longest path
		 * @type {number}
		 */
		this.maxLength = 0;

		/**
		 * Keeps the string with the current path,
		 * concatenated with dots e.g. 9.5.3.2.1
		 * @type {string}
		 */
		this.path = '';

		/**
		 * Current matrix structure
		 * @type {Array[][]}
		 */
		this.matrix = Matrix.getMatrix(string);

		/**
		 * Iterate thought each element of the array
		 */
		this.mapEachElem(this.checkNeibours.bind(this));

		/**
		 * Object with the result of max path computations
		 * @type {{maxLength: Number, maxDrop: number, finalPath: string}}
		 */
		this.result = this.getResult();
	}

	/**
	 * Returns matrix out of the string
	 * @param {String} string row string
	 * @returns {Array[][]} matrix
	 */
	static getMatrix (string) {
		const lines = string.split('\n').filter(i => i);
		return lines.map((x) => x.split(' '));
	}

	/**
	 * Map thought each element of the matrix
	 * @param {Function} fn function to apply to each element
	 */
	mapEachElem(fn) {
		this.matrix.forEach((arr, x) => arr.forEach((number, y) => fn(x, y)));
	}

	/**
	 * Get value by coordinates
	 * @param {Number} x x-axis coords
	 * @param {Number} y y-axis coords
	 * @returns {?Number}
	 */
	getCurrentVal (x, y) {
		return this.matrix[x] && this.matrix[x][y]
	}

	/**
	 * Get value of upper element by coordinates
	 * @param {Number} x x-axis coords
	 * @param {Number} y y-axis coords
	 * @returns {?Number}
	 */
	getUpVal (x, y) {
		return this.matrix[x - 1] && this.matrix[x - 1][y]
	}

	/**
	 * Get value of down element by coordinates
	 * @param {Number} x x-axis coords
	 * @param {Number} y y-axis coords
	 * @returns {?Number}
	 */
	getDownVal (x, y) {
		return this.matrix[x + 1] && this.matrix[x + 1][y]
	}

	/**
	 * Get value of left element by coordinates
	 * @param {Number} x x-axis coords
	 * @param {Number} y y-axis coords
	 * @returns {?Number}
	 */
	getLeftVal (x, y) {
		return this.matrix[x] && this.matrix[x][y - 1]
	}

	/**
	 * Get value of right element by coordinates
	 * @param {Number} x x-axis coords
	 * @param {Number} y y-axis coords
	 * @returns {?Number}
	 */
	getRightVal (x, y) {
		return this.matrix[x] && this.matrix[x][y + 1]
	}

	/**
	 * Returns array with neibour values
	 * if they are smaller then currentValue and Infinity if not
	 * @param {Number} x x-axis coords
	 * @param {Number} y y-axis coords
	 * @param {Number} currentValue
	 * @returns {[Number, Number, Number, Number]}
	 */
	getNeibourValues (x, y, currentValue) {
		const leftVal = this.getLeftVal(x, y)
		const rightVal = this.getRightVal(x, y)
		const upVal = this.getUpVal(x, y)
		const downVal = this.getDownVal(x, y)

		const left = leftVal < currentValue ? leftVal : Infinity
		const right = rightVal < currentValue ? rightVal : Infinity
		const up = upVal < currentValue ? upVal : Infinity
		const down = downVal < currentValue ? downVal : Infinity

		return [left, right, up, down]
	}

	/**
	 * Gets neibour values and check each of them by order
	 * from the smallest to the biggest
	 * @param {Number} x x-axis coords of the cell from which to start checking
	 * @param {Number} y y-axis coords of the cell from which to start checking
	 * @param {string} chainString string which keep the reference to the previous path
	 */
	checkNeibours(x, y, chainString) {
		const currentValue = parseInt(this.getCurrentVal(x, y))
		const id = chainString ? `${chainString}.${currentValue}` : currentValue.toString()

		let neiboursValArr = this.getNeibourValues(x, y, currentValue)
		let minIndex = this._getLowestArrElemIndex(neiboursValArr)

		while (minIndex !== null) {
			this.checkNextNeibour(minIndex, x, y, id)
			neiboursValArr[minIndex] = Infinity;
			minIndex = this._getLowestArrElemIndex(neiboursValArr)
		}
		this.checkLength(id);
	}

	/**
	 * Checks the length by the path string
	 * and saves the result to this.maxLength and this.path
	 * if it it has better performance
	 * @param {String} id current path,
	 * concatenated with dots e.g. 9.5.3.2.1
	 */
	checkLength(id) {
		const arr = id.split('.');
		const pathLength = arr.length;
		const isLongest = pathLength >= this.maxLength;


		if(isLongest) {
			const currentDrop = arr[0] - arr[arr.length - 1];
			const currentPathArr = this.path.split('.')
			const currentLength = currentPathArr.length;
			const isSavedOutdated = currentLength < pathLength;
			const savedDrop = isSavedOutdated? 0 : currentPathArr[0] -  currentPathArr[currentPathArr.length - 1];
			const isDropBigger = currentDrop > savedDrop;

			if ( isDropBigger) {
				this.maxLength = pathLength;
				this.path = id;
			}
		}
	}

	/**
	 * Checks if there are neibours left to check
	 * @param minIndex minimum index of the neibour elements
	 * @param {Number} x x-axis coords of the cell from which to start checking
	 * @param {Number} y y-axis coords of the cell from which to start checking
	 * @param {string} id string which keep the reference to the previous path
	 */
	checkNextNeibour(minIndex, x, y, id) {
		const [newX, newY] = this._getNewCoords(minIndex, x, y)
		if (newX !== undefined && newY !== undefined) {
			this.checkNeibours(newX, newY, id)
		}
	}

	/**
	 * Returns a tuple with the next coords to check
	 * @param {Number} index which way to go next
	 * 0 - left, 1 - right, 2 - up, 3 - down
	 * @param {Number} currentX x-axis coords
	 * @param {Number} currenY y-axis coords
	 * @returns {number[]}
	 */
	_getNewCoords (index, currentX, currenY) {
		switch (index) {
			case 0:
				return [currentX, currenY - 1] // 'left';
			case 1:
				return [currentX, currenY + 1] // 'right';
			case 2:
				return [currentX - 1, currenY] // 'up';
			case 3:
				return [currentX + 1, currenY] // 'down';
			default:
				return []
		}
	}

	/**
	 * Gives the index of the array
	 * @param {string[]} arr array with 4 elemements
	 * @returns {Number|null}
	 */
	_getLowestArrElemIndex (arr) {
		const min = Math.min(...arr)

		return min === Infinity ? null : arr.indexOf(min.toString())
	}

	/**
	 * Return result object of all computations
	 * @returns {{maxLength: Number, maxDrop: number, finalPath: string}}
	 */
	getResult() {
		const pathArr = this.path.split('.');
		const finalPath = pathArr.join(' -> ');
		const maxDrop = pathArr[0] - pathArr[pathArr.length - 1];
		const maxLength = pathArr.length;

		return {
			maxLength,
			maxDrop,
			finalPath
		};
	}
}