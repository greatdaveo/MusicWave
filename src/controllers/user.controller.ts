import { Request, Response, NextFunction } from 'express';
import UserModel, { IAuthModel } from '../models/auth.model';

// import jwt, { JwtPayload } from 'jsonwebtoken';

// interface DecodedToken extends JwtPayload {
//     id: string;
// }

declare global {
    namespace Express {
        export interface Request {
            user?: IAuthModel;
        }
    }
}

export const loggedInUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData = await UserModel.findById(req.user?._id).select('-password');

    if (userData) {
        res.status(200).json({ status: 200, message: 'Retrieved a current logged in profile successfully', data: userData });
    } else {
        res.status(401).json({ status: 401, message: 'User data not found' });
    }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.user?._id);

    if (user) {
        const { name, email, phoneNumber, accountType, country, countryCode, state, address } = user;
        user.name = req.body.name || name;
        user.email = req.body.email || email;
        user.phoneNumber = req.body.phoneNumber || phoneNumber;
        user.accountType = req.body.accountType || accountType;
        user.country = req.body.country || country;
        user.countryCode = req.body.countryCode || countryCode;
        user.state = req.body.state || state;
        user.address = req.body.address || address;

        const updatedUser = await user?.save();

        res.status(200).json({ status: 200, message: 'User profile edited successfully', data: updatedUser });
    } else {
        res.status(401).json({ status: 401, message: 'User not found' });
    }
};
