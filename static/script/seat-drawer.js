/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="./seat-controller.ts" />
/// <reference path="./seat-config.ts" />
/**
 * Created by namhyun on 2015-06-22.
 */
function draw(index) {
    var config = null;
    if (index == 1) {
        config = new Room1();
    }
    else if (index == 2) {
        config = new Room2();
    }
    else if (index == 6) {
        config = new Room6();
    }
    if (config != null) {
        drawEntry(config.entryMark);
        drawSeats(config.seatSize);
        updateSeatsStatus(index);
        alignSeats(config);
    }
    else {
        $.ajax({
            url: './layout/layout_' + index + '.json',
            success: function (data) {
                var obj = JSON.parse(data);
                var entry = obj.entryMark;
                var entryMark = new EntryMark(entry.rowIndex, entry.colIndex, entry.arrowRotate);
                drawEntry(entryMark);
                drawSeats(Number(obj.seatSize));
                for (var i in obj.seats) {
                    var seat = obj.seats[i];
                    SeatController.alignSeat(seat.seatNumber, seat.rowIndex, seat.colIndex);
                }
                updateSeatsStatus(index);
            }
        });
    }
}
function drawEntry(entryMark) {
    if (entryMark == null)
        return null;
    var iconName = "arrow-drop-down";
    if (entryMark.arrowRotate) {
        iconName = "arrow-drop-up";
    }
    $('#container').append('<div id=entry-mark><iron-icon icon=' + iconName + '></iron-icon>출입구</div>');
    $('#entry-mark').addClass('row_' + entryMark.rowIndex);
    $('#entry-mark').addClass('col_' + entryMark.colIndex);
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
function alignSeats(config) {
    // Align Row
    var rowProperty = config.rowProperty;
    var colProperty = config.colProperty;
    for (var index = 0; index < rowProperty.rowFactories.length; index++)
        SeatController.repeatAlign(rowProperty.rowFactories[index], rowProperty.rowIndexes[index], rowProperty.rowSizes[index]);
    for (var index = 0; index < colProperty.colFactories.length; index++)
        SeatController.repeatAlign(colProperty.colFactories[index], colProperty.colIndexes[index]);
}
//# sourceMappingURL=seat-drawer.js.map