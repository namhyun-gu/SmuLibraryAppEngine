/// <reference path="./seat-controller.ts" />

/**
 * Created by namhyun on 2015-06-22.
 */
interface RoomModelInterface {
	rowFactories: Array<RowFactory>;
	colFactories: Array<ColFactory>;
	rowIndexes: Array<number>;
	rowSizes: Array<number>;
	colIndexes: Array<number>;
}

class Room1 implements RoomModelInterface {
	rowFactories: Array<RowFactory>;
	colFactories: Array<ColFactory>;
	rowIndexes: Array<number>;
	rowSizes: Array<number>;
	colIndexes: Array<number>;

	constructor() {
		var row_numbers : Array<Array<number>> = [];
		row_numbers.push([1, 16, 17, 32]);
		row_numbers.push([33, 46]);
		row_numbers.push([6, 11, 22, 27, 37, 42, 47, 52]);

		var row_increases: Array<Array<boolean>> = [];
		row_increases.push([true, false, true, false]);
		row_increases.push([true, false]);
		row_increases.push([true, false, true, false, true, false, true, false]);

		this.rowFactories = [];
		for (var index = 0; index < row_numbers.length; index++) {
			this.rowFactories.push = new RowFactory(row_numbers[index], row_increases[index]);
		}
		this.rowIndexes = [0, 0, 6];
		this.rowSizes = [5, 4, 3];

		var col_numbers: Array<number> = [1, 9, 17, 25, 33, 40, 47, 50];
		var col_sizes: Array<number> = [8, 8, 8, 8, 8, 8, 3, 3];

		this.colFactories = [];
		for (var index = 0; index < col_numbers.length; index++) {
			this.colFactories.push = new ColFactory(col_numbers[index], col_sizes[index]);
		}
		this.colIndexes = [0, 1, 3, 4, 6, 7, 9, 10];
	}	
}

class Room2 implements RoomModelInterface {
	rowFactories: Array<RowFactory>;
	colFactories: Array<ColFactory>;
	rowIndexes: Array<number>;
	rowSizes: Array<number>;
	colIndexes: Array<number>;

	constructor() {
		var row_numbers : Array<Array<number>> = [];
		row_numbers.push([37, 70, 71, 104, 105, 140, 141, 176, 177, 208]);
		row_numbers.push([42, 65, 76, 99, 110, 135, 146, 171, 182, 203]);
		row_numbers.push([46, 61, 80, 95, 114, 131, 150, 167, 186, 199]);
		row_numbers.push([50, 57, 84, 91, 118, 127, 154, 163, 190, 195]);
		row_numbers.push([53, 54, 87, 88]);
		row_numbers.push([121, 124, 157, 160]);
		row_numbers.push([1, 18, 19, 36]);

		var row_increases: Array<Array<boolean>> = [];
		row_increases.push([true, false, true, false, true, false, true, false, true, false]);
		row_increases.push([true, false, true, false, true, false, true, false, true, false]);
		row_increases.push([true, false, true, false, true, false, true, false, true, false]);
		row_increases.push([true, false, true, false, true, false, true, false, true, false]);
		row_increases.push([false, false, false, false]);
		row_increases.push([true, false, true, false]);
		row_increases.push([true, false, true, false]);

		this.rowFactories = [];
		for (var index = 0; index < row_numbers.length; index++) {
			this.rowFactories.push = new RowFactory(row_numbers[index], row_increases[index]);
		}
		this.rowIndexes = [0, 6, 11, 16, 19, 19, 12];
		this.rowSizes = [5, 4, 4, 3, 1, 2, 9];

		var col_numbers: Array<number> = [1, 9, 17, 25, 33, 40, 47, 50];
		var col_sizes: Array<number> = [8, 8, 8, 8, 8, 8, 3, 3];

		this.colFactories = [];
		for (var index = 0; index < col_numbers.length; index++) {
			this.colFactories.push = new ColFactory(col_numbers[index], col_sizes[index]);
		}
		this.colIndexes = [0, 1, 3, 4, 6, 7, 9, 10];
	}
}