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
    SeatController.alignSeat = function (seatNumber, rowIndex, colIndex) {
        $('#Seat' + seatNumber).addClass('row_' + rowIndex);
        $('#Seat' + seatNumber).addClass('col_' + colIndex);
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
var Room = (function () {
    function Room() {
    }
    return Room;
})();
var Seat = (function () {
    function Seat(seatNumber, rowIndex, colIndex) {
        this.seatNumber = seatNumber;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
    }
    return Seat;
})();
var Util = (function () {
    function Util() {
    }
    /**
     * Generate json data from seats property (for Developer)
     */
    Util.generateJson = function () {
        var room = new Room();
        var seats = [];
        $("#container").find("seat-element").each(function () {
            var elementClassName = this.className.split(" ");
            var rowIndex = Number(elementClassName[0].substring(4, elementClassName[0].length));
            var colIndex = Number(elementClassName[1].substring(4, elementClassName[1].length));
            seats.push(new Seat(this.number, rowIndex, colIndex));
        });
        var entryMark;
        $('#container').find('#entry-mark').each(function () {
            var elementClassName = this.className.split(" ");
            var rowIndex = Number(elementClassName[0].substring(4, elementClassName[0].length));
            var colIndex = Number(elementClassName[1].substring(4, elementClassName[1].length));
            var arrowRotate = false;
            $('#entry-mark').find('iron-icon').each(function () {
                var iconName = this.icon;
                if (iconName == "arrow-drop-up") {
                    arrowRotate = true;
                }
            });
            entryMark = new EntryMark(rowIndex, colIndex, arrowRotate);
        });
        room.seats = seats;
        room.entryMark = entryMark;
        room.seatSize = seats.length;
        var jsonData = JSON.stringify(room);
        console.log(jsonData);
    };
    return Util;
})();
var EntryMark = (function () {
    function EntryMark(rowIndex, colIndex, arrayRotate) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.arrowRotate = arrayRotate;
    }
    return EntryMark;
})();
var RowProperty = (function () {
    function RowProperty(rowIndexes, rowSizes) {
        this.rowIndexes = rowIndexes;
        this.rowSizes = rowSizes;
    }
    RowProperty.prototype.appendRow = function (row_numbers, row_increases) {
        this.rowFactories = [];
        for (var index = 0; index < row_numbers.length; index++) {
            this.rowFactories.push(new RowFactory(row_numbers[index], row_increases[index]));
        }
    };
    return RowProperty;
})();
var ColProperty = (function () {
    function ColProperty(colIndexes) {
        this.colIndexes = colIndexes;
    }
    ColProperty.prototype.appendCol = function (col_numbers, col_sizes) {
        this.colFactories = [];
        for (var index = 0; index < col_numbers.length; index++) {
            this.colFactories.push(new ColFactory(col_numbers[index], col_sizes[index]));
        }
    };
    return ColProperty;
})();
//# sourceMappingURL=seat-controller.js.map