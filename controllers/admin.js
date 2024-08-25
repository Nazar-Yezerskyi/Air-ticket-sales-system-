const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const mysql = require('mysql2');

  
  module.exports.adminLogin = async function (req, res) {
    const adminEmail = req.body.Email;
    const adminPassword = req.body.Password;
  
    if (
      adminEmail === temporaryAdminData.email &&
      adminPassword === temporaryAdminData.password
    ) {
      const token = jwt.sign(
        { adminId: 1, email: adminEmail },
        'admin-secret-key',
        { expiresIn: '1h' }
      );
  
      const adminData = { id: 1, email: adminEmail };
      res.status(200).json({ token: token, admin: adminData });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials' });
    }
  };
  
  