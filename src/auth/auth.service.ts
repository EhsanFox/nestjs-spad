import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';

import { RegisterDto, LoginDto } from './dto';
import { Account } from './schemas';
import { AccountDocument, AccountTypeDoc } from "./interfaces"
import { UserNotFound, UserExistException, InvalidPasswordException, UnauthorizedException, InternalErrorException  } from '../excepetions';

@Injectable()
export class AuthService
{
    constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}

    public async updateUser(accountId: number, updatedUser: Partial<AccountTypeDoc>)
    {
        try {
            const userExist = await this.accountModel.findById(accountId)
            if(!userExist) throw new UserNotFound(`User doesn't exist.`)
            else
            {
                return await this.accountModel.findByIdAndUpdate(
                    accountId,
                    { ...updatedUser },
                    { new: true }
                )
            }
        } catch (error) {
            throw new InternalErrorException(error)
        }
        
    }

    public async register(registerDto: RegisterDto, response: Response)
    {
        const { email, password, passwordConfirm } = registerDto;

        const emailExists = await this.accountModel.findOne({ email: email.toLowerCase() });
        if (emailExists)
            throw new UserExistException('Email address already exists');

        if (passwordConfirm !== password)
            throw new InvalidPasswordException('Password does not match');

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAccount = new this.accountModel({ email: email.toLowerCase(), password: hashedPassword });

        await this.generateAndSetToken(newAccount, response);
    }

    public async login(loginDto: LoginDto, response: Response)
    {
        const { email, password } = loginDto;

        const account: AccountDocument = await this.accountModel.findOne({ email: email.toLowerCase() });

        if (account && (await bcrypt.compare(password, account.password)))
        {
            await this.generateAndSetToken(account, response);
        }

        throw new UnauthorizedException('Please check your login credentials');
    }

    public async logout(request: Request, response: Response)
    {
        const refreshToken: string = request.cookies.refreshToken;
        if (!refreshToken)
        {
            throw new UnauthorizedException('You are not logged in! Please log in to get access.');
        }

        const account = await this.accountModel.findOne({ refreshToken });
        if (!account)
        {
            this.clearCookies(response);
        }

        account.refreshToken = '';
        await account.save();

        this.clearCookies(response);
    }

    public async refresh(request: Request)
    {
        const refreshToken: string = request.cookies.refreshToken;
        if (!refreshToken)
        {
            throw new UnauthorizedException('You are not logged in! Please log in to get access.');
        }

        const account = await this.accountModel.findOne({ refreshToken });
        if (!account)
        {
            throw new UnauthorizedException('Invalid Token. Please log in again!');
        }

        const verifyRefreshToken = verify(refreshToken, process.env.JWT_REFRESH_KEY);
        if (!verifyRefreshToken || !account || account.id !== (verifyRefreshToken as JwtPayload) .id)
        {
            throw new UnauthorizedException('Invalid Token. Please log in again!');
        }

        const accessToken: string = sign({ id: account.id }, process.env.JWT_ACCESS_KEY, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
        return { accessToken };
    }

    public me(accountId: number)
    {
        return this.accountModel.findById(accountId);
    }

    private async generateAndSetToken(account: AccountDocument, response: Response)
    {
        const accessToken: string = sign({ id: account.id }, process.env.JWT_ACCESS_KEY, { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN });
        const refreshToken: string = sign({ id: account.id }, process.env.JWT_REFRESH_KEY, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });

        account.refreshToken = refreshToken;
        await account.save();

        response.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: +process.env.JWT_REFRESH_COOKIE_MAX_AGE });

        return response.status(HttpStatus.OK).json({ accessToken });
    }

    private clearCookies(response: Response)
    {
        response.clearCookie('refreshToken', { httpOnly: true, sameSite: 'none', secure: true });

        return response.status(HttpStatus.OK).json({ message: 'You are already logged out' });
    }
}
