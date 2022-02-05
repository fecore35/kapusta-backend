import jwt from 'jsonwebtoken';
import User from "../../models/user";
import userService from '../../services/users/user-service';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthService {
    async isUserExist(email) {
        const user = await userService.findByEmail(email);
        return !!user;
    };

    async getUser(email, password) {
        const user = await userService.findByEmail(email);
        const isValidPass = await user?.isValidPassword(password);
        if (!isValidPass) {
            return null;
        };
        return user;
    };

    getToken(user) {
        const id = user.id;
        const payload = { id }; 
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '12h'}); 
        return token;
    };

    async setToken(id, token) {
        await this.updateToken(id, token);
    };

    async updateToken(id, token) {
        return await User.updateOne({_id:id}, {token});
    };
};
 
const authService = new AuthService;

export default authService;