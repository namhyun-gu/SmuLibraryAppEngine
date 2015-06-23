/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="./seat-controller.ts" />

/**
 * Created by namhyun on 2015-06-22.
 */
function draw(index: number) : void {
	var room_seats_size = 0;
    if (index == 1) {
        room_seats_size = 52;
    } else if (index == 2) {
        room_seats_size = 208;
    }
    drawSeats(room_seats_size);
    updateSeatsStatus(index);
    alignSeats(index);
}

function drawSeats(size: number) : void {
    for (var i = 1; i <= size; i++) {
        $('#container').append('<seat-element number=' + i + ' id=Seat' + i + '></seat-element>');
    }
}

function updateSeatsStatus(index: number) : void {
    $.ajax({
        url: '../request/room_detail?index=' + index,
        success: function(data) {
            for(var index in data.seat_list) {
                var seat = data.seat_list[index];
                var number = seat.seat_number;
                var is_available = seat.is_available;

                var seat_element = document.querySelector("#Seat" + number);
                seat_element.changeStatus(is_available);
            }
        }
    });
}

function alignSeats(index: number): void {
    if(index == 1) {
        // Align Row 1
        const row_1_numbers: Array<number> = [1, 16, 17, 32];
        const row_1_increases: Array<boolean> = [true, false, true, false];

        var row_1: Array<SeatNumbering> = new RowFactory(row_1_numbers, row_1_increases).build();
        for (var index = 0; index < 5; index++) {
            SeatController.alignRow(row_1, index);
            row_1 = SeatController.calcRow(row_1);
        }

        // Align Row 2
        const row_2_numbers: Array<number> = [33, 46];
        const row_2_increases: Array<boolean> = [true, false];

        var row_2: Array<SeatNumbering> = new RowFactory(row_2_numbers, row_2_increases).build();
        for (var index = 0; index < 4; index++) {
            SeatController.alignRow(row_2, index);
            row_2 = SeatController.calcRow(row_2);
        }

        // Align Row 3
        const row_3_numbers: Array<number> = [6, 11, 22, 27, 37, 42, 47, 52];
        const row_3_increases: Array<boolean> = [true, false, true, false, true, false, true, false];

        var row_3: Array<SeatNumbering> = new RowFactory(row_3_numbers, row_3_increases).build();
        for (var index = 0; index < 3; index++) {
            SeatController.alignRow(row_3, index + 6);
            row_3 = SeatController.calcRow(row_3);
        }

        // Align Col
        const col_init_number = [1, 9, 17, 25, 33, 40, 47, 50];
        const col_size = [8, 8 ,8, 8, 8, 8, 3, 3];
        const col_index = [0, 1, 3, 4, 6, 7, 9, 10];

        for (var index = 0; index < col_init_number.length; index++) {
            var col: Array<number> = new ColFactory(col_init_number[index], col_size[index]).build();
            SeatController.alignCol(col, col_index[index]);
        }
    } else if(index == 2) {
		// Align Row 1
		const row_1_numbers : Array<number> = [37, 70, 71, 104, 105, 140, 141, 176, 177, 208];
		const row_1_increases : Array<boolean> = [true, false, true, false, true, false, true, false, true, false];

		var row_1 : Array<SeatNumbering> = new RowFactory(row_1_numbers, row_1_increases).build();
		for (var index = 0; index < 5; index++) {
			SeatController.alignRow(row_1, index);
			row_1 = SeatController.calcRow(row_1);
		}

		// Align Row 2
		const row_2_numbers : Array<number> = [42, 65, 76, 99, 110, 135, 146, 171, 182, 203];
		const row_2_increases : Array<boolean> = row_1_increases;

		var row_2 : Array<SeatNumbering> = new RowFactory(row_2_numbers, row_2_increases).build();
		for (var index = 0; index < 4; index++) {
            SeatController.alignRow(row_2, index + 6);
            row_2 = SeatController.calcRow(row_2);
		}

        // Align Row 3
        const row_3_numbers : Array<number> = [46, 61, 80, 95, 114, 131, 150, 167, 186, 199];
        const row_3_increases : Array<boolean> = row_1_increases;

        var row_3 : Array<SeatNumbering> = new RowFactory(row_3_numbers, row_3_increases).build();
        for (var index = 0; index < 4; index++) {
            SeatController.alignRow(row_3, index + 11);
            row_3 = SeatController.calcRow(row_3);
        }

        // Align Row 4
        const row_4_numbers : Array<number> = [50, 57, 84, 91, 118, 127, 154, 163, 190, 195];
        const row_4_increases : Array<boolean> = row_1_increases;

        var row_4 : Array<SeatNumbering> = new RowFactory(row_4_numbers, row_4_increases).build();
        for (var index = 0; index < 3; index++) {
            SeatController.alignRow(row_4, index + 16);
            row_4 = SeatController.calcRow(row_4);
        }

        // Align Row 5
        const row_5_numbers : Array<number> = [53, 54, 87, 88];
        const row_5_increases : Array<boolean> = [false, false, false, false];

        var row_5 : Array<SeatNumbering> = new RowFactory(row_5_numbers, row_5_increases).build();
        SeatController.alignRow(row_5, 19);

        // Align Row 6
        const row_6_numbers : Array<number> = [121, 124, 157, 160];
        const row_6_increases : Array<boolean> = [true, false, true, false];

        var row_6 : Array<SeatNumbering> = new RowFactory(row_6_numbers, row_6_increases).build();
        for (var index = 0; index < 2; index++) {
            SeatController.alignRow(row_6, index + 19);
            row_6 = SeatController.calcRow(row_6);
        }

        // Align Row 7
        const row_7_numbers : Array<number> = [1, 18, 19, 36];;
        const row_7_increases : Array<boolean> = [true, false, true, false];

        var row_7 : Array<SeatNumbering> = new RowFactory(row_7_numbers, row_7_increases).build();
        for (var index = 0; index < 9; index++) {
            SeatController.alignRow(row_7, index + 12);
            row_7 = SeatController.calcRow(row_7);
        }

        // Align Col
        const col_init_number = [1, 10, 19, 28, 37, 54, 71, 88, 105, 123, 141, 159, 177, 193];
        const col_size = [9, 9, 9, 9, 18, 18, 18, 18, 19, 19, 19, 19, 17, 17];
        const col_index = [0, 1, 3, 4, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20];

        for (var index = 0; index < col_init_number.length; index++) {
            var col = new ColFactory(col_init_number[index], col_size[index]).build();
            SeatController.alignCol(col, col_index[index]);
        }
	}
}