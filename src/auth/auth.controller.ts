import {
    Body,
    Controller,
    Get,
    Post,
    Patch,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response, Request } from "express";
import mimetypes from "mime-types";

import { LoginDto, RegisterDto, UpdateDto } from "./dto";
import { iUploadFile } from "../shared/types";

import { AuthService } from "./auth.service";
import { AccountDecorator } from "src/shared/account.decorator";
import { AccountTypeDoc } from "src/shared/account.interface";
import { AuthGuard } from "src/shared/auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    public async register(
        @Body() registerDto: RegisterDto,
        @Res() response: Response
    ) {
        return this.authService.register(registerDto, response);
    }

    @Post("login")
    public async login(@Body() loginDto: LoginDto, @Res() response: Response) {
        return this.authService.login(loginDto, response);
    }

    @Get("logout")
    @UseGuards(AuthGuard)
    public async logout(@Req() request: Request, @Res() response: Response) {
        return this.authService.logout(request, response);
    }

    @Get("refresh")
    public async refresh(@Req() request: Request) {
        return this.authService.refresh(request);
    }

    @Get("me")
    @UseGuards(AuthGuard)
    public me(@AccountDecorator() accountId: number) {
        return this.authService.me(accountId);
    }

    @Patch("me")
    @UseGuards(AuthGuard)
    public async updateMe(
        @AccountDecorator() accountId: number,
        @Body() data: UpdateDto
    ) {
        return this.authService.updateUser(accountId, data as AccountTypeDoc);
    }

    @Post("profile")
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor("image", {
            dest: "./uploads",
        })
    )
    public async updateProfile(
        @AccountDecorator() accountId: number,
        @UploadedFile() file: iUploadFile
    ) {
        return await this.authService.updateUser(accountId, {
            profile: `${file.filename}.${mimetypes.extension(file.mimetype)}`,
        });
    }
}
