const mysql = require('mysql2');
module.exports.addPlane = async function(req, res, connection) {
    const Serial_number= req.body.Serial_number;
    const Plane_name = req.body.Plane_name;
    const Class = req.body.Class;
    const Seats_number = req.body.Seats_number;
    const Owner = req.body.Owner;

    const insertPlaneQuery = `INSERT INTO Plane (Plane_name, Class, Seats_number, Owner, Serial_number) VALUES (?, ?, ?, ?, ?)`;
    connection.query(insertPlaneQuery, [Plane_name, Class, Seats_number, Owner, Serial_number], (err, result) => {
        if (err) {
            console.error('Error inserting plane:', err);
            res.status(500).json({ error: 'Error inserting plane' });
        } else {
            const planeId = result.insertId;

            const insertSeatsQuery = `INSERT INTO Seat (Seat_number, Seats_booked, Plane_id_plane) VALUES (?, 0, ?)`;
            const seatNumbers = [];
            for (let i = 1; i <= Seats_number; i++) {
                const seatNumber = 'A' + `${i}`;
                seatNumbers.push(seatNumber);
                connection.query(insertSeatsQuery, [seatNumber, planeId], (err) => {
                    if (err) {
                        console.error('Error inserting seats:', err);
                        res.status(500).json({ error: 'Error inserting seats' });
                    }
                });
            }

            res.status(200).json({ message: 'Plane and seats added successfully', seatNumbers });
        }
    });
};
module.exports.addFlight = async function(req, res, connection) {
    const {
        DepartureLocation,
        DestinationLocation,
        DepartureDate,
        DestinationDate,
        DepartureTime,
        DestinationTime,
        Price_per_seat,
        Plane_id_plane,
    } = req.body;

 
    const checkPlaneQuery = `SELECT id_plane FROM Plane WHERE id_plane = ?`;
    connection.query(checkPlaneQuery, [Plane_id_plane], (checkPlaneErr, checkPlaneResults) => {
        if (checkPlaneErr || checkPlaneResults.length === 0) {
            console.error('wrong vslue Plane_id_plane:', checkPlaneErr);
            res.status(500).send('wrong value Plane_id_plane');
        } else {
           
            const sql = `INSERT INTO Flight (DepartureLocation, DestinationLocation, DepartureDate, DestinationDate, DepartureTime, DestinationTime, Price_per_seat, Plane_id_plane) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            connection.query(sql, [
                DepartureLocation,
                DestinationLocation,
                DepartureDate,
                DestinationDate,
                DepartureTime,
                DestinationTime,
                Price_per_seat,
                Plane_id_plane,
            ], (err, results) => {
                if (err) {
                    console.error('error adding data:', err.message);
                    res.status(500).send('error adding data');
                } else {
                    console.log('data added, ID:', results.insertId);
                    res.status(200).send('data added');
                }
            });
        }
    });
};