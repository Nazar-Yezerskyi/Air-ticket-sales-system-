const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken'); 



module.exports.login = async function(req, res, connection) {
  const email = req.body.Email;
  const password = req.body.Password; 

  const sqlSearch = 'SELECT * FROM User WHERE Email = ?';
  const search_query = mysql.format(sqlSearch, [email]);

  connection.query(search_query, async (err, result) => {
    if (err) throw err;

    if (result.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
    } else {
      const user = result[0];

      if (!user.Password) { 
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.Password);
      if (isPasswordValid) {
        const token = jwt.sign({ userId: user.id_user, email: user.Email, lastname: user.Last_name }, 'secret-key', { expiresIn: '1h' });

        const userData = { id: user.id_user, firstname: user.First_name, lastname: user.Last_name, email: user.Email };
        res.status(200).json({ token: token, user: userData });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
};



module.exports.register = async function (req, res, connection) {
  
  const username = req.body.username;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sqlSearch = 'SELECT * FROM User WHERE email = ?';
  const search_query = mysql.format(sqlSearch, [email]);
  const sqlInsert = 'INSERT INTO User (First_name, Last_name, Email, Password) VALUES (?, ?, ?, ?)';
  const insert_query = mysql.format(sqlInsert, [username, lastname, email, hashedPassword]);

  connection.query(search_query, async (err, result) => {
    if (err) throw err;
    console.log('------> Search Results');
    console.log(result.length);
    if (result.length !== 0) {
      console.log('------> User already exists');
      res.status(409).json({ error: 'User already exists' });
    } else {
      connection.query(insert_query, (err, result) => {
        if (err) throw err;
        console.log('--------> Created new User');
        console.log(result.insertId);
        res.status(201).json({ message: 'User created successfully' });
      });
    }
  });
};