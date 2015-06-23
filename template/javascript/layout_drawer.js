/**
 * Created by namhyun on 2015-06-22.
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

function draw(index) {
    if (index == 2) {
        const room_seats_size = 208;

        const row_1_size = 10;
        const row_1_init_number = [37, 70, 71, 104, 105, 140, 141, 176, 177, 208];
        const row_1_increase_values = [true, false, true, false, true, false, true, false, true, false];

        const row_2_size = 4;
        const row_2_init_number = [1, 18, 19, 36];
        const row_2_increase_values = [true, false, true, false];

        const row_3_size = 4;
        const row_3_init_number = [53, 54, 87, 88];
        const row_3_increase_values = [true, true, true, true];

        const row_4_size = 4;
        const row_4_init_number = [121, 124, 157, 160];
        const row_4_increase_values = [true, false, true, false];

        for(var i = 1; i <= room_seats_size; i++)
            $('#container').append('<paper-button id=Seat' + i + '>' + i + "</paper-button>");

        var row_1 = generateRow(new RowProperty(row_1_size, row_1_init_number, row_1_increase_values));
        for (var index = 0; index < 16; index++) {
            alignRow(row_1, index);
            row_1 = calcRow(row_1);
        }

        var row_2 = generateRow(new RowProperty(row_2_size, row_2_init_number, row_2_increase_values));
        for (var index = 0; index < 10; index++) {
            alignRow(row_2, index + 10);
            row_2 = calcRow(row_2);
        }

        var row_3 = generateRow(new RowProperty(row_3_size, row_3_init_number, row_3_increase_values));
        alignRow(row_3, 16);

        var row_4 = generateRow(new RowProperty(row_4_size, row_4_init_number, row_4_increase_values));
        for (var index = 0; index < 2; index++) {
            alignRow(row_4, index + 16);
            row_4 = calcRow(row_4);
        }

        var col_init_number = [1, 10, 19, 28, 37, 54, 71, 88, 105, 123, 141, 159, 177, 193];
        var col_size = [9, 9, 9, 9, 18, 18, 18, 18, 19, 19, 19, 19, 17, 17];
        var col_index = [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19];

        for(var index in col_init_number) {
            var col = generateCol(new ColProperty(col_size[index], col_init_number[index]));
            alignCol(col, col_index[index]);
        }
    }
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