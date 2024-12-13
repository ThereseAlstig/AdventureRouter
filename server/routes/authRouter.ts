import express from 'express';
import { registerUser, loginUser, logoutUser, getProtectedResource  } from '../controllers/authControllers';
import { ensureAuthenticated, verifyToken} from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/protected', ensureAuthenticated, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});
router.get('/protected-resource', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Access granted to protected resource',
    user: req.user, 
  });
});

export default router;
