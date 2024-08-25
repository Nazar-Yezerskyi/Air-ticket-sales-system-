const mysql = require('mysql2');

module.exports = {
    getSeatsForFlight: (req, res, connection) => {
      const flightId = req.query.flightId;
      const query = `
        SELECT s.*
        FROM Seat s
        JOIN Plane p ON s.Plane_id_plane = p.id_plane
        JOIN Flight f ON p.id_plane = f.Plane_id_plane
        WHERE f.id_flight = ?;
      `;
     
      connection.query(query, [flightId], (error, results) => {
        if (error) {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Seats for flight:', results);
          res.status(200).json(results);
        }
      });
    },
  
}

module.exports.flight_info = async function(req, res, connection) {
    const id_flight = req.query.id_flight;

    const sqlSearch = `
        SELECT 
            Flight.*, 
            Plane.*
        FROM 
            Flight
        JOIN 
            Plane ON Flight.Plane_id_plane = Plane.id_plane
        WHERE 
            id_flight = ?;
    `;

    connection.query(sqlSearch, [id_flight], (err, result) => {
        if (err) {
            console.error('Error executing search query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log('SQL Query:', sqlSearch);

        if (result.length === 0) {
            res.status(404).json({ error: 'No matching records found' });
        } else {
            res.status(200).json({ data: result });
        }
    });
};
module.exports.order_ticket = function(req, res, connection) {
    
    const id_flight = req.body.id_flight;
    const User_id_user = req.body.id_user;
    const First_name = req.body.firstName;
    const Last_name = req.body.lastName;
    const Passport = req.body.Passport;
    const seat_number = req.body.seatId;
    const Total_price = req.body.Total_price;
    const id_plane = req.body.id_plane;
    const Seat_numberS = req.body.Seat_number;
    
    console.log('Received data:', req.body);

    connection.query(
        'INSERT INTO `airport1`.`Order_ticket` ' +
        '(`Passport`, `First_name`, `Last_name`, `User_id_user`, `Flight_id_flight`,`Total_price`) ' +
        'VALUES (?, ?, ?, ?, ?, ?)',
        [Passport, First_name, Last_name, User_id_user, id_flight, Total_price],
        function(err, orderTicketInsertResult) {
            console.log('Received data:', req.body);
            if (err) {
                console.error('Error during order_ticket:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            const id_ticket = orderTicketInsertResult.insertId;

            seat_number.forEach(seat_number => {
                connection.query(
                    'INSERT INTO `airport1`.`Reservation` ' +
                    '(`seat_number`, `Order_ticket_id_ticket`, `Order_ticket_User_id_user`) ' +
                    'VALUES (?, ?, ?)',
                    [seat_number, id_ticket, User_id_user],
                    function(err, reservationInsertResult) {
                        if (err) {
                            console.error('Error during order_ticket:', err);
                            res.status(500).send('Internal Server Error');
                            return;
                        }

                        const id_reservation = reservationInsertResult.insertId;

                        connection.query(
                            'SELECT `Plane_id_plane` FROM `airport1`.`Flight` WHERE `id_flight` = ?',
                            [id_flight],
                            function(err) {
                                if (err) {
                                    console.error('Error during order_ticket:', err);
                                    res.status(500).send('Internal Server Error');
                                    return;
                                }

                                const Seats_booked = 1;
                                Seat_numberS.forEach(Seat_number => {
                                    connection.query(
                                        'UPDATE Seat SET Seats_booked = ? ' +
                                        'WHERE `Seat_number` = ? AND `Plane_id_plane` = ?',
                                        [Seats_booked, Seat_number, id_plane],
                                        function (err, result) {
                                            if (err) {
                                                console.error('Error during order_ticket:', err);
                                                res.status(500).send('Internal Server Error');
                                                return;
                                            }
                                
                                            console.log('Update seats result:', result);
                                        }
                                    );
                                });
                            }
                        );
                    }
                );
            });
        }
    );
};

module.exports.orderedTicket = function(req, res, connection) {
    const userId = req.query.userId; 
  
    connection.query(`
    SELECT
        ot.id_ticket,
        ot.Passport,
        ot.First_name AS passenger_first_name,
        ot.Last_name AS passenger_last_name,
        ot.Total_price,
        f.DepartureLocation,
        f.DestinationLocation,
        f.DepartureDate,
        f.DestinationDate,
        f.DepartureTime,
        f.DestinationTime,
        p.id_plane,
        p.Class,
        p.Serial_number,  
        GROUP_CONCAT(DISTINCT s.Seat_number) AS Seat_numbers
    FROM
        Order_ticket ot
        JOIN Flight f ON ot.Flight_id_flight = f.id_flight
        JOIN Reservation r ON ot.id_ticket = r.Order_ticket_id_ticket AND ot.User_id_user = r.Order_ticket_User_id_user
        JOIN Seat s ON r.id_reservation = s.id_seats
        JOIN Plane p ON f.Plane_id_plane = p.id_plane
    WHERE
        ot.User_id_user = ?
    GROUP BY
        ot.id_ticket,
        ot.Passport,  
        ot.First_name, 
        ot.Last_name,  
        ot.Total_price,
        f.DepartureLocation,
        f.DestinationLocation,
        f.DepartureDate,
        f.DestinationDate,
        f.DepartureTime,
        f.DestinationTime,
        p.id_plane,
        p.Class,
        p.Serial_number; 
    `, [userId], function(error, results) {
      if (error) {
        console.error('Помилка при отриманні даних з бази даних:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
      } else {
        const orderedData = results.map(result => ({
          id_ticket: result.id_ticket,
          Passport: result.Passport,
          passenger_first_name: result.passenger_first_name,
          passenger_last_name: result.passenger_last_name,
          Total_price: result.Total_price,
          DepartureLocation: result.DepartureLocation,
          DestinationLocation: result.DestinationLocation,
          DepartureDate: result.DepartureDate,
          DestinationDate: result.DestinationDate,
          DepartureTime: result.DepartureTime,
          DestinationTime: result.DestinationTime,
          id_plane: result.id_plane,
          Class: result.Class,
          Serial_number: result.Serial_number,  
          Seat_numbers: result.Seat_numbers.split(',') 
        }));
        
        res.status(200).json({ success: true, data: orderedData });
      }
    });
};