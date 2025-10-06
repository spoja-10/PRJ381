const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // need this to allow frontend to contact backend
const readline = require('readline');//import readline module

const app = express();
const port = 3000;

const USER_DATA_FILE = path.join(__dirname, 'user info.txt');

function encryptPassword(password) {
    let encrypted = '';
    for (let i = 0; i < password.length; i++) {
        // Get the character code (ASCII value)
        const charCode = password.charCodeAt(i);
        // Shift the code by 2
        const newCharCode = charCode + 2;
        // Convert the new code back to a character
        encrypted += String.fromCharCode(newCharCode);
    }
    return encrypted;
}
function decryptPassword(encryptedPassword) {
    let decrypted = '';
    for (let i = 0; i < encryptedPassword.length; i++) {
        // Get the character code (ASCII value)
        const charCode = encryptedPassword.charCodeAt(i);
        // Shift the code back by 2
        const newCharCode = charCode - 2;
        // Convert the new code back to a character
        decrypted += String.fromCharCode(newCharCode);
    }
    return decrypted;
}

//enable CORS (so that frontend can contact backend)
app.use(cors({
  origin: 'http://127.0.0.1:5500', // replace with your frontend URL
  methods: ['GET', 'POST'],
}));
app.use(express.json()); // for parsing application/json
// registration/sign up endpoint (saves to file)
function checkLoginCredentials(email, password){
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(USER_DATA_FILE);
    fileStream.on('error', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('User data file not found. Rejecting login.')
        return resolve(false); // File doesn't exist, no users registered yet
      }
      reject(err); // Some other error
    });
    // Create readline interface
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity // Recognize all instances of CR LF ('\r\n') as a single line break
    });
    let found = false;
    //Loop through each line in the file
    rl.on('line', (line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // Skip empty lines
      //split the stored data: email,encryptedPassword
      const parts = trimmedLine.split(',');
      if (parts.length !== 2) return; //Skip malformed lines
      const storedEmail = parts[0];
      const storedEncryptedPassword = parts[1];

      //check if email matches
      if (storedEmail === email){
        //decrypt the stored password
        const storedDecryptedPassword = decryptPassword(storedEncryptedPassword);
        //compare passwords
        if (storedDecryptedPassword === password){
          found = true;
          rl.close(); // Stop reading further
        }
      }
    });
    rl.on('close',() => {
      resolve(found);
    });

  });
  
}
app.post('/login', async (req, res) => {
  const {email,password} = req.body;
  if (!email || !password){
    return res.status(400).json({success:false, message: 'Email and password are required'});
  }
  try {
    const isAuthenticated = await checkLoginCredentials(email, password);
    if (isAuthenticated) {
      //success credentials found
      console.log('User logged in:', email);
      return res.json({ success:true, message: 'Login successful' });
    } else {
      //credentials not found
      return res.status(401).json({ success:false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login file read error:', error);
    return res.status(500).json({ success:false, message: 'Login failed due to server error' });
  }
});
app.post('/register', (req, res) => {
  const {name, email, password} = req.body;
  if (!email || !password){
    return res.status(400).json({success:false, message: 'Email and password are required'});
  }
  //encrypt the password before saving
  const encryptedPassword = encryptPassword(password);
  // format: email, encryptedPassword
  const userData = `${email},${encryptedPassword}\n`;

  fs.appendFile(USER_DATA_FILE, userData, (err) => {
    if (err) {
      console.error('Error writing to file', err);
      return res.status(500).json({soccess:false, message: 'Registration failed due to server error'});
    }
    console.log('New user registered:', email);
    res.status(201).json({success:true, message: 'User registered successfully'});
  });
});

app.listen(port, () => {
  console.log('Server running on http://localhost:' + port);
  console.log('User data will be saved to', USER_DATA_FILE);
});