/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="./seat-controller.ts" />
/**
 * Created by namhyun on 2015-06-22.
 */
function draw(index) {
    var room_seats_size = 0;
    if (index == 1) {
        room_seats_size = 52;
    }
    else if (index == 2) {
        room_seats_size = 208;
    }
    drawSeats(room_seats_size);
    updateSeatsStatus(index);
    alignSeats(index);
}
function drawSeats(size) {
    for (var i = 1; i <= size; i++) {
        $('#container').append('<seat-element number=' + i + ' id=Seat' + i + '></seat-element>');
    }
}
function updateSeatsStatus(index) {
    $.ajax({
        url: '../request/room_detail?index=' + index,
        success: function (data) {
            for (var index in data.seat_list) {
                var seat = data.seat_list[index];
                var number = seat.seat_number;
                var is_available = seat.is_available;
                var seat_element = document.querySelector("#Seat" + number);
                seat_element.changeStatus(is_available);
            }
        }
    });
}
function alignSeats(index) {
    if (index == 1) {
        // Align Row 1
        var row_1_numbers = [1, 16, 17, 32];
        var row_1_increases = [true, false, true, false];
        var row_1 = new RowFactory(row_1_numbers, row_1_increases).build();
        for (var index = 0; index < 5; index++) {
            SeatController.alignRow(row_1, index);
            row_1 = SeatController.calcRow(row_1);
        }
        // Align Row 2
        var row_2_numbers = [33, 46];
        var row_2_increases = [true, false];
        var row_2 = new RowFactory(row_2_numbers, row_2_increases).build();
        for (var index = 0; index < 4; index++) {
            SeatController.alignRow(row_2, index);
            row_2 = SeatController.calcRow(row_2);
        }
        // Align Row 3
        var row_3_numbers = [6, 11, 22, 27, 37, 42, 47, 52];
        var row_3_increases = [true, false, true, false, true, false, true, false];
        var row_3 = new RowFactory(row_3_numbers, row_3_increases).build();
        for (var index = 0; index < 3; index++) {
            SeatController.alignRow(row_3, index + 6);
            row_3 = SeatController.calcRow(row_3);
        }
        // Align Col
        var col_init_number = [1, 9, 17, 25, 33, 40, 47, 50];
        var col_size = [8, 8, 8, 8, 8, 8, 3, 3];
        var col_index = [0, 1, 3, 4, 6, 7, 9, 10];
        for (var index = 0; index < col_init_number.length; index++) {
            var col = new ColFactory(col_init_number[index], col_size[index]).build();
            SeatController.alignCol(col, col_index[index]);
        }
    }
    else if (index == 2) {
        // Align Row 1
        var row_1_numbers = [37, 70, 71, 104, 105, 140, 141, 176, 177, 208];
        var row_1_increases = [true, false, true, false, true, false, true, false, true, false];
        var row_1 = new RowFactory(row_1_numbers, row_1_increases).build();
        for (var index = 0; index < 5; index++) {
            SeatController.alignRow(row_1, index);
            row_1 = SeatController.calcRow(row_1);
        }
        // Align Row 2
        var row_2_numbers = [42, 65, 76, 99, 110, 135, 146, 171, 182, 203];
        var row_2_increases = row_1_increases;
        var row_2 = new RowFactory(row_2_numbers, row_2_increases).build();
        for (var index = 0; index < 4; index++) {
            SeatController.alignRow(row_2, index + 6);
            row_2 = SeatController.calcRow(row_2);
        }
        // Align Row 3
        var row_3_numbers = [46, 61, 80, 95, 114, 131, 150, 167, 186, 199];
        var row_3_increases = row_1_increases;
        var row_3 = new RowFactory(row_3_numbers, row_3_increases).build();
        for (var index = 0; index < 4; index++) {
            SeatController.alignRow(row_3, index + 11);
            row_3 = SeatController.calcRow(row_3);
        }
        // Align Row 4
        var row_4_numbers = [50, 57, 84, 91, 118, 127, 154, 163, 190, 195];
        var row_4_increases = row_1_increases;
        var row_4 = new RowFactory(row_4_numbers, row_4_increases).build();
        for (var index = 0; index < 3; index++) {
            SeatController.alignRow(row_4, index + 16);
            row_4 = SeatController.calcRow(row_4);
        }
        // Align Row 5
        var row_5_numbers = [53, 54, 87, 88];
        var row_5_increases = [false, false, false, false];
        var row_5 = new RowFactory(row_5_numbers, row_5_increases).build();
        SeatController.alignRow(row_5, 19);
        // Align Row 6
        var row_6_numbers = [121, 124, 157, 160];
        var row_6_increases = [true, false, true, false];
        var row_6 = new RowFactory(row_6_numbers, row_6_increases).build();
        for (var index = 0; index < 2; index++) {
            SeatController.alignRow(row_6, index + 19);
            row_6 = SeatController.calcRow(row_6);
        }
        // Align Row 7
        var row_7_numbers = [1, 18, 19, 36];
        ;
        var row_7_increases = [true, false, true, false];
        var row_7 = new RowFactory(row_7_numbers, row_7_increases).build();
        for (var index = 0; index < 9; index++) {
            SeatController.alignRow(row_7, index + 12);
            row_7 = SeatController.calcRow(row_7);
        }
        // Align Col
        var col_init_number = [1, 10, 19, 28, 37, 54, 71, 88, 105, 123, 141, 159, 177, 193];
        var col_size = [9, 9, 9, 9, 18, 18, 18, 18, 19, 19, 19, 19, 17, 17];
        var col_index = [0, 1, 3, 4, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20];
        for (var index = 0; index < col_init_number.length; index++) {
            var col = new ColFactory(col_init_number[index], col_size[index]).build();
            SeatController.alignCol(col, col_index[index]);
        }
    }
}
