/**
 * Created by namhyun on 2015-06-23.
 */
function SeatsNumbering(init_number, increase) {
    this.number = init_number;
    this.increase = increase;
}

SeatsNumbering.prototype.counting = function () {
    if (this.increase)
        this.number++;
    else
        this.number--;
};

function RowProperty(size, initNumbers, increaseValues) {
    this.size = size;
    this.initNumbers = initNumbers;
    this.increaseValues = increaseValues;
}

function ColProperty(size, initNumber) {
    this.size = size;
    this.initNumber = initNumber;
}

function generateRow(rowProperty) {
    var row = [];
    for (var index = 0; index < rowProperty.size; index++) {
        row.push(new SeatsNumbering(rowProperty.initNumbers[index], rowProperty.increaseValues[index]));
    }
    return row;
}

function generateCol(colProperty) {
    var col = [];
    for (var index = 0; index < colProperty.size; index++) {
        col.push(colProperty.initNumber + index);
    }
    return col;
}

function calcRow(row) {
    for (index in row) {
        row[index].counting();
    }
    return row;
}

function alignRow(row, index) {
    for (var seat_index in row) {
        $('#Seat' + row[seat_index].number).addClass('row_' + index);
    }
}

function alignCol(col, index) {
    for (var seat_index in col) {
        $('#Seat' + col[seat_index]).addClass('col_' + index);
    }
}