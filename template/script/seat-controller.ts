/// <reference path="../../typings/jquery/jquery.d.ts" />

/**
 * Created by Namhyun, Gu on 2015-06-23.
 */
interface Factory<T> {
	build(): Array<T>;
}

class SeatNumbering {
    initNumber: number;
    increase: boolean;

	constructor(initNumber: number, increase: boolean) {
        this.initNumber = initNumber;
        this.increase = increase;
    }

    public counting(): void {
    	if(this.increase) {
			this.initNumber++;
    	} else {
			this.initNumber--;
    	}
    }
}

class RowFactory implements Factory<SeatNumbering> {
    initNumbers: Array<number>;
    increaseValues: Array<boolean>;
    itemSize: number;

    constructor(initNumbers: Array<number>, increaseValues: Array<boolean>) {
		this.initNumbers = initNumbers;
        this.increaseValues = increaseValues;
        this.itemSize = initNumbers.length;
    }

	public build() : Array<SeatNumbering> {
		var row = [];
		for (var index = 0; index < this.itemSize; index++) {
			row.push(new SeatNumbering(this.initNumbers[index], this.increaseValues[index]));
		}
		return row;
    }
}

class ColFactory implements Factory<number> {
	initNumber: number;
	itemSize: number;

	constructor(initNumber: number, itemSize: number) {
		this.initNumber = initNumber;
        this.itemSize = itemSize;
    }

    public build() : Array<number> {
		var col = [];
		for (var index = 0; index < this.itemSize; index++) {
			col.push(this.initNumber + index);
		}
		return col;
    }
}

class SeatController {
	public static calcRow(row: Array<SeatNumbering>) : Array<SeatNumbering> {
		for(var index in row) {
			row[index].counting();
		}
		return row;
	}

	public static alignRow(row: Array<SeatNumbering>, index: number) : void {
		for(var seat_index in row) {
			$('#Seat' + row[seat_index].initNumber).addClass('row_' + index);
		}
	}

	public static alignCol(col: Array<number>, index: number) : void {
		for(var seat_index in col) {
			$('#Seat' + col[seat_index]).addClass('col_' + index);
		}
	}

	public static repeatAlign (factory: Factory<Object>, defaultIndex: number, loopSize: number = null) {
		if(factory instanceof RowFactory) {
			var row: Array<SeatNumbering> = factory.build();
			for (var index = 0; index < loopSize; index++) {
				SeatController.alignRow(row, index + defaultIndex);
				row = SeatController.calcRow(row);
			}
		} else if(factory instanceof ColFactory) {
			var col: Array<number> = factory.build();
			SeatController.alignCol(col, defaultIndex)
		}
	}
}