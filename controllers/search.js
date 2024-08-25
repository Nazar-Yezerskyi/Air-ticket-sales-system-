const mysql = require('mysql2');



module.exports.search = async function(req, res, connection) {
    const from = req.query.from;
    const to = req.query.to;
    const departure_date = req.query.departure_date;
  

    const sqlSearch =` SELECT  Flight.*, 
    Plane.serial_number FROM Flight 
    JOIN 
    Plane ON Flight.Plane_id_plane = Plane.id_plane
    WHERE 
    DepartureLocation = ? 
    AND DestinationLocation = ? 
    AND DepartureDate = ? 
   `;
    const search_query = mysql.format(sqlSearch, [from, to, departure_date]);

    connection.query(search_query, (err, result) => {
        if (err) {
            console.error('Error executing search query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log('SQL Query:', search_query);


        if (result.length === 0) {
            res.status(404).json({ error: 'No matching records found' });
        } else {
            res.status(200).json({ data: result });
        }
    });
};
