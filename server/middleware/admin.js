// server/middleware/admin.js
export const ensureAdmin = (req, res, next) => {
    if(req.isAuthenticated() && req.user.role === 'admin'){
        next();
    }else{
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
}