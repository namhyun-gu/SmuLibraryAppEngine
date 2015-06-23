/// <reference path="../../typings/jquery/jquery.d.ts" />
var SeatNumbering = (function () {
    function SeatNumbering(initNumber, increase) {
        this.initNumber = initNumber;
        this.increase = increase;
    }
    SeatNumbering.prototype.counting = function () {
        if (this.increase) {
            this.initNumber++;
        }
        else {
            this.initNumber--;
        }
    };
    return SeatNumbering;
})();
var RowFactory = (function () {
    function RowFactory(initNumbers, increaseValues) {
        this.initNumbers = initNumbers;
        this.increaseValues = increaseValues;
        this.itemSize = initNumbers.length;
    }
    RowFactory.prototype.build = function () {
        var row = [];
        for (var index = 0; index < this.itemSize; index++) {
            row.push(new SeatNumbering(this.initNumbers[index], this.increaseValues[index]));
        }
        return row;
    };
    return RowFactory;
})();
var ColFactory = (function () {
    function ColFactory(initNumber, itemSize) {
        this.initNumber = initNumber;
        this.itemSize = itemSize;
    }
    ColFactory.prototype.build = function () {
        var col = [];
        for (var index = 0; index < this.itemSize; index++) {
            col.push(this.initNumber + index);
        }
        return col;
    };
    return ColFactory;
})();
var SeatController = (function () {
    function SeatController() {
    }
    SeatController.calcRow = function (row) {
        for (var index in row) {
            row[index].counting();
        }
        return row;
    };
    SeatController.alignRow = function (row, index) {
        for (var seat_index in row) {
            $('#Seat' + row[seat_index].initNumber).addClass('row_' + index);
        }
    };
    SeatController.alignCol = function (col, index) {
        for (var seat_index in col) {
            $('#Seat' + col[seat_index]).addClass('col_' + index);
        }
    };
    SeatController.repeatAlign = function (factory, defaultIndex, loopSize) {
        if (loopSize === void 0) { loopSize = null; }
        if (factory instanceof RowFactory) {
            var row = factory.build();
            for (var index = 0; index < loopSize; index++) {
                SeatController.alignRow(row, index + defaultIndex);
                row = SeatController.calcRow(row);
            }
        }
        else if (factory instanceof ColFactory) {
            var col = factory.build();
            SeatController.alignCol(col, defaultIndex);
        }
    };
    return SeatController;
})();
