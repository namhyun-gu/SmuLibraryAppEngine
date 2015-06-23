/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="./seat-controller.ts" />
/// <reference path="./seat-config.ts" />

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
    var config: RoomModelInterface;
    if (index == 1) {
        config = new Room1();
    } else if (index == 2) {
        config = new Room2();
    }

    for (var index = 0; index < config.rowFactories.length; index++)
        SeatController.repeatAlign(config.rowFactories[index], config.rowIndexes[index], config.rowSizes[index]);
    for (var index = 0; index < config.colFactories.length; index++)
        SeatController.repeatAlign(config.colFactories[index], config.colIndexes[index]);
}