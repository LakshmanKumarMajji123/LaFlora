const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log("token triggered in Authorization is...", token);

  if (!token) {
    return res.status(401).json({ error: 'No token provided Please login' });
  }

  try {
    //const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "1234567890");
    console.log("decoded is....", decoded);

    //decoded payload to req (for want to use in routes)
    req.user = decoded; //req.user contains the decoded token payload (e.g., { phone }).
    next();

  } catch (error) {
    console.error('Auth error:', error.message);
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ error: "Token has expired" });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { auth };



/**
 * #If valid, req.user contains the payload ({ phone }), 
 * and the request proceeds to the route handler (e.g., getAllUsers).
  
  #If invalid or expired, it returns a 401 error.
 */