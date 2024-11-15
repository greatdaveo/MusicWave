import { Request, Response, NextFunction } from 'express';
import UserModel, { IAuthModel } from '../models/auth.model';

import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
    id: string;
}

export const loggedInUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    if (token) {
        res.setHeader('Authorization', `Bearer ${token}`);
    } else {
        return res.status(400).json({ status: 400, message: 'User is not logged in' });
    }

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    const userData = await UserModel.findById(verifiedToken.id).select('-password');

    if (userData) {
        res.status(200).json({ status: 200, message: 'Retrieved a current logged in profile successfully', data: userData });
    } else {
        res.status(400).json({ status: 401, message: 'User data not found' });
    }
};
