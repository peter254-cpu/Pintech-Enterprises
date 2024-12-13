import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      console.log("Error occurred here: No access token provided");
      return res.status(401).json({ message: 'Unauthorized - No access token provided' });
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      // Find the user by ID and exclude the password field
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Attach user to the request object
      req.user = user;
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized - Access token expired' });
      }
      throw error;
    }
  } catch (error) {
    console.log('Error in protectRoute middleware', error.message);
    return res.status(401).json({ message: 'Unauthorized - Invalid access token' });
  }
};


export const adminRoute = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};