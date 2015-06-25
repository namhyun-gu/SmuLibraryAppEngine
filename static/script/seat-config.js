/// <reference path="./seat-controller.ts" />
/**
 * Created by namhyun on 2015-06-22.
 */
var Room1 = (function () {
    function Room1() {
        this.seatSize = 52;
        var row_numbers = [];
        row_numbers.push([1, 16, 17, 32]);
        row_numbers.push([33, 46]);
        row_numbers.push([6, 11, 22, 27, 37, 42, 47, 52]);
        var row_increases = [];
        row_increases.push([true, false, true, false]);
        row_increases.push([true, false]);
        row_increases.push([true, false, true, false, true, false, true, false]);
        var rowIndexes = [0, 0, 6];
        var rowSizes = [5, 4, 3];
        this.rowProperty = new RowProperty(rowIndexes, rowSizes);
        this.rowProperty.appendRow(row_numbers, row_increases);
        var col_numbers = [1, 9, 17, 25, 33, 40, 47, 50];
        var col_sizes = [8, 8, 8, 8, 8, 8, 3, 3];
        var colIndexes = [0, 1, 3, 4, 6, 7, 9, 10];
        this.colProperty = new ColProperty(colIndexes);
        this.colProperty.appendCol(col_numbers, col_sizes);
        this.entryMark = new EntryMark(1, 9, false);
    }
    return Room1;
})();
var Room2 = (function () {
    function Room2() {
        this.seatSize = 208;
        var row_numbers = [];
        row_numbers.push([37, 70, 71, 104, 105, 140, 141, 176, 177, 208]);
        row_numbers.push([42, 65, 76, 99, 110, 135, 146, 171, 182, 203]);
        row_numbers.push([46, 61, 80, 95, 114, 131, 150, 167, 186, 199]);
        row_numbers.push([50, 57, 84, 91, 118, 127, 154, 163, 190, 195]);
        row_numbers.push([53, 54, 87, 88]);
        row_numbers.push([121, 124, 157, 160]);
        row_numbers.push([1, 18, 19, 36]);
        var row_increases = [];
        row_increases.push([true, false, true, false, true, false, true, false, true, false]);
        row_increases.push([true, false, true, false, true, false, true, false, true, false]);
        row_increases.push([true, false, true, false, true, false, true, false, true, false]);
        row_increases.push([true, false, true, false, true, false, true, false, true, false]);
        row_increases.push([false, false, false, false]);
        row_increases.push([true, false, true, false]);
        row_increases.push([true, false, true, false]);
        var rowIndexes = [0, 6, 11, 16, 19, 19, 12];
        var rowSizes = [5, 4, 4, 3, 1, 2, 9];
        this.rowProperty = new RowProperty(rowIndexes, rowSizes);
        this.rowProperty.appendRow(row_numbers, row_increases);
        var col_numbers = [1, 10, 19, 28, 37, 54, 71, 88, 105, 123, 141, 159, 177, 193];
        var col_sizes = [9, 9, 9, 9, 17, 17, 17, 17, 18, 18, 18, 18, 16, 16];
        var colIndexes = [0, 1, 3, 4, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20];
        this.colProperty = new ColProperty(colIndexes);
        this.colProperty.appendCol(col_numbers, col_sizes);
        this.entryMark = new EntryMark(2, 5, false);
    }
    return Room2;
})();
var Room6 = (function () {
    function Room6() {
        this.seatSize = 84;
        var row_numbers = [];
        row_numbers.push([81, 80, 65, 64, 49, 48, 33, 32, 17, 16]);
        row_numbers.push([7, 6]);
        row_numbers.push([76, 69, 60, 53, 44, 37, 28, 21]);
        var row_increases = [];
        row_increases.push([true, false, true, false, true, false, true, false, true, false]);
        row_increases.push([true, false]);
        row_increases.push([false, true, false, true, false, true, false, true]);
        var rowIndexes = [0, 0, 7];
        var rowSizes = [4, 6, 4];
        this.rowProperty = new RowProperty(rowIndexes, rowSizes);
        this.rowProperty.appendRow(row_numbers, row_increases);
        var col_numbers = [81, 77, 65, 61, 49, 45, 33, 29, 17, 13, 7, 1, 73, 69, 57, 53, 41, 37, 25, 21];
        var col_sizes = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 6, 4, 4, 4, 4, 4, 4, 4, 4];
        var colIndexes = [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 1, 2, 4, 5, 7, 8, 10, 11];
        this.colProperty = new ColProperty(colIndexes);
        this.colProperty.appendCol(col_numbers, col_sizes);
        this.entryMark = new EntryMark(11, 14, true);
    }
    return Room6;
})();
//# sourceMappingURL=seat-config.js.map