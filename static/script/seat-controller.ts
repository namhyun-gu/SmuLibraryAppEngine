/// <reference path="../typings/jquery/jquery.d.ts" />

/**
 * Created by Namhyun, Gu on 2015-06-23.
 */
interface Factory<T> {
    build(): Array<T>;
}

class SeatNumbering {
    initNumber:number;
    increase:boolean;

    constructor(initNumber:number, increase:boolean) {
        this.initNumber = initNumber;
        this.increase = increase;
    }

    public counting():void {
        if (this.increase) {
            this.initNumber++;
        } else {
            this.initNumber--;
        }
    }
}

class RowFactory implements Factory<SeatNumbering> {
    initNumbers:Array<number>;
    increaseValues:Array<boolean>;
    itemSize:number;

    constructor(initNumbers:Array<number>, increaseValues:Array<boolean>) {
        this.initNumbers = initNumbers;
        this.increaseValues = increaseValues;
        this.itemSize = initNumbers.length;
    }

    public build():Array<SeatNumbering> {
        var row = [];
        for (var index = 0; index < this.itemSize; index++) {
            row.push(new SeatNumbering(this.initNumbers[index], this.increaseValues[index]));
        }
        return row;
    }
}

class ColFactory implements Factory<number> {
    initNumber:number;
    itemSize:number;

    constructor(initNumber:number, itemSize:number) {
        this.initNumber = initNumber;
        this.itemSize = itemSize;
    }

    public build():Array<number> {
        var col = [];
        for (var index = 0; index < this.itemSize; index++) {
            col.push(this.initNumber + index);
        }
        return col;
    }
}

class SeatController {
    public static calcRow(row:Array<SeatNumbering>):Array<SeatNumbering> {
        for (var index in row) {
            row[index].counting();
        }
        return row;
    }

    public static alignSeat(seatNumber:number, rowIndex:number, colIndex:number):void {
        $('#Seat' + seatNumber).addClass('row_' + rowIndex);
        $('#Seat' + seatNumber).addClass('col_' + colIndex);
    }

    public static alignRow(row:Array<SeatNumbering>, index:number):void {
        for (var seat_index in row) {
            $('#Seat' + row[seat_index].initNumber).addClass('row_' + index);
        }
    }

    public static alignCol(col:Array<number>, index:number):void {
        for (var seat_index in col) {
            $('#Seat' + col[seat_index]).addClass('col_' + index);
        }
    }

    public static repeatAlign(factory:Factory<Object>, defaultIndex:number, loopSize:number = null):void {
        if (factory instanceof RowFactory) {
            var row:Array<SeatNumbering> = factory.build();
            for (var index = 0; index < loopSize; index++) {
                SeatController.alignRow(row, index + defaultIndex);
                row = SeatController.calcRow(row);
            }
        } else if (factory instanceof ColFactory) {
            var col:Array<number> = factory.build();
            SeatController.alignCol(col, defaultIndex)
        }
    }
}

class Room {
    seatSize:number;
    seats:Array<Seat>;
    entryMark:EntryMark;
}

class Seat {
    seatNumber:number;
    rowIndex:number;
    colIndex:number;

    constructor(seatNumber:number, rowIndex:number, colIndex:number) {
        this.seatNumber = seatNumber;
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
    }
}

class Util {
    /**
     * Generate json data from seats property (for Developer)
     */
    public static generateJson():void {
        var room:Room = new Room();
        var seats:Array<Seat> = [];
        $("#container").find("seat-element").each(function () {
            var elementClassName:Array<String> = this.className.split(" ");
            var rowIndex:number = Number(elementClassName[0].substring(4, elementClassName[0].length));
            var colIndex:number = Number(elementClassName[1].substring(4, elementClassName[1].length));
            seats.push(new Seat(this.number, rowIndex, colIndex));
        });
        var entryMark:EntryMark;
        $('#container').find('#entry-mark').each(function () {
            var elementClassName:Array<String> = this.className.split(" ");
            var rowIndex:number = Number(elementClassName[0].substring(4, elementClassName[0].length));
            var colIndex:number = Number(elementClassName[1].substring(4, elementClassName[1].length));

            var arrowRotate:boolean = false;
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

        var jsonData:String = JSON.stringify(room);
        console.log(jsonData);
    }
}

class EntryMark {
    rowIndex:number;
    colIndex:number;
    arrowRotate:boolean;

    constructor(rowIndex:number, colIndex:number, arrayRotate:boolean) {
        this.rowIndex = rowIndex;
        this.colIndex = colIndex;
        this.arrowRotate = arrayRotate;
    }
}

class RowProperty {
    rowFactories:Array<RowFactory>;
    rowIndexes:Array<number>;
    rowSizes:Array<number>;

    constructor(rowIndexes:Array<number>, rowSizes:Array<number>) {
        this.rowIndexes = rowIndexes;
        this.rowSizes = rowSizes;
    }

    appendRow(row_numbers:Array<Array<number>>, row_increases:Array<Array<boolean>>) {
        this.rowFactories = [];
        for (var index = 0; index < row_numbers.length; index++) {
            this.rowFactories.push(new RowFactory(row_numbers[index], row_increases[index]));
        }
    }
}

class ColProperty {
    colFactories:Array<ColFactory>;
    colIndexes:Array<number>;

    constructor(colIndexes:Array<number>) {
        this.colIndexes = colIndexes;
    }

    appendCol(col_numbers:Array<number>, col_sizes:Array<number>) {
        this.colFactories = [];
        for (var index = 0; index < col_numbers.length; index++) {
            this.colFactories.push(new ColFactory(col_numbers[index], col_sizes[index]));
        }
    }
}

interface RoomModel {
    rowProperty:RowProperty;
    colProperty:ColProperty;
    seatSize:number;
    entryMark:EntryMark;
}