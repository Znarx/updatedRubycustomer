import mysql from 'mysql2/promise';
import { parse } from 'url';
import { sign, verify } from 'jsonwebtoken';
import { authMiddleware } from '../../utils/authMiddleware';
import bcrypt from 'bcrypt';

const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default async function handler(req, res) {
  const { method } = req;
  const { pathname } = parse(req.url, true);

  try {
    switch (method) {
      case 'GET':
        if (pathname === '/api/check-auth') {
          return handleCheckAuth(req, res);
        } else if (pathname === '/api/login') {
          return handleGetLogin(req, res);
        } else if (pathname === '/api/signup') {
          return handleGetSignup(req, res);
        } else if (pathname === '/api/acustomer') {
          return authMiddleware(handleGetCustomers)(req, res);
        }else if (pathname === '/api/profile') {
          return authMiddleware(handleGetProfile)(req, res);  // New route to fetch profile
        }
        break;

      case 'POST':
        if (pathname === '/api/login') {
          return handleLogIn(req, res);
        } else if (pathname === '/api/validate-pin') {
          return handleValidatePin(req, res);
        } else if (pathname === '/api/logout') {
          return handleLogout(req, res);
        } else if (pathname === '/api/acustomer') {
          return authMiddleware(handleAddCustomer)(req, res);
        } else if (pathname === '/api/orders') {
          return authMiddleware(handleGetOrders)(req, res);
        } else if (pathname === '/api/signup') {
          return handlePostSignup(req, res);
        }
        break;

      case 'PUT':
        if (pathname.startsWith('/api/aproduct/')) {
          const id = pathname.split('/').pop();
          return authMiddleware(handleUpdateProduct)(req, res, id);
        } else if (pathname.startsWith('/api/acustomer/')) {
          const customerId = pathname.split('/').pop();
          return authMiddleware(handleUpdateCustomer)(req, res, customerId);
        } else if (pathname === '/api/orders') {
          return authMiddleware(handleAddOrder)(req, res);
        }
        break;

      case 'DELETE':
        if (pathname.startsWith('/api/aproduct/')) {
          const id = pathname.split('/').pop();
          return authMiddleware(handleDeleteProduct)(req, res, id);
        } else if (pathname.startsWith('/api/acustomer/')) {
          const customerId = pathname.split('/').pop();
          return authMiddleware(handleDeleteCustomer)(req, res, customerId);
        }
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
}


// Authentication
function handleCheckAuth(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ isAuthenticated: false });
  }

  try {
    verify(token, process.env.JWT_SECRET);
    return res.status(200).json({ isAuthenticated: true });
  } catch (error) {
    return res.status(200).json({ isAuthenticated: false });
  }
}

// Login
async function handleLogIn(req, res) {
  const { emailaddress, password } = req.body;

  try {
    // Input validation
    if (!emailaddress || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Query the database
    const [result] = await db.query(
      'SELECT * FROM acustomer WHERE emailaddress = ?', 
      [emailaddress]
    );

    // Check if user exists and password matches
    if (result.length === 0 || !(await bcrypt.compare(password, result[0].password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result[0];
    
    // Create JWT token
    const token = sign(
      { userId: user.id, email: user.emailaddress, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '5h' }
    );

    // Set cookie
    res.setHeader(
      'Set-Cookie', 
      `token=${token}; HttpOnly; Path=/; Max-Age=18000; SameSite=Strict`
    );

    // Send success response
    res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: {
        emailaddress: user.emailaddress,
        fullname: user.fullname,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
}


// Logout
async function handleLogout(req, res) {
  try {
    // Clear the authentication cookie
    res.setHeader(
      'Set-Cookie',
      'token=; Path=/; HttpOnly; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict'
    );

    // Send success response
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'An error occurred during logout' });
  }
}


// Signup
async function handlePostSignup(req, res) {
  const { fullname, contactnumber, emailaddress, password } = req.body;

  // Perform basic validation
  if (!fullname || !contactnumber || !emailaddress || !password) {
    return res.status(400).json({ 
      error: 'All fields are required',
      missing: {
        fullname: !fullname,
        contactnumber: !contactnumber,
        emailaddress: !emailaddress,
        password: !password
      }
    });
  }

  try {
    // Check if the user already exists
    const [existingUser] = await db.query(
      'SELECT * FROM acustomer WHERE emailaddress = ?', 
      [emailaddress]
    );
    
    if (existingUser.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const [result] = await db.query(
      'INSERT INTO acustomer (fullname, contactnumber, emailaddress, password) VALUES (?, ?, ?, ?)',
      [fullname, contactnumber, emailaddress, hashedPassword]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Signup successful', 
      userId: result.insertId 
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: 'An error occurred while creating the user' });
  }
}

// Fetch user profile
async function handleGetProfile(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;  // Assuming userId is in the JWT payload

    // Fetch the customer's profile details from the database
    const [result] = await db.query('SELECT * FROM acustomer WHERE customerid = ?', [userId]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const customer = result[0];
    res.status(200).json({ customer });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
}


// Other functions (handleGetCustomers, handleAddOrder, etc.) would go here