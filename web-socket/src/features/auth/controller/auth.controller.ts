import { 
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Post,
    UseGuards,
} from "@nestjs/common";

import { User } from "src/features/user/schema/user.schema";
import { UserService } from "src/features/user/service/user.service";
import { CurrentUser } from "../decorators/current-user.decorator";
import { AuthService } from "../service/auth.service";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { SubscriptionService } from "src/features/user/service/subscription.service";
import { generateSessionToken } from "src/shared/utils/generateSessionToken";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private subscriptionService: SubscriptionService,
    ) {}

    @Post('login')
    async login(
        @Body() body: LoginDto
    ) {
        return this.authService.login(
            await this.authService.validate(body.username, body.password),
        );
    }

    @Post('refresh-token')
    async refreshToken(
        @Body('refreshToken') refreshToken: string
    ) {
        return this.authService.loginWithRefreshToken(refreshToken)
    }

    @Post('register')
    async register(
        @Body() body: RegisterDto
    ) {
        if(await this.userService.getUserByName(body.username)) {
            throw new BadRequestException('Username already exists');
        }

        if(await this.userService.getUserByEmail(body.email)) {
            throw new BadRequestException('Email already exists');
        }

        const user = await this.userService.create(body);

        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('logout-from-all-devices')
    async logoutFromAllDevices(@CurrentUser() user: User) {
        const updateUser =  generateSessionToken(user);

        await updateUser.save();

        await this.subscriptionService.deleteAll(updateUser);

        return this.authService.login(updateUser);
    }
    
    @Get('me')
    @UseGuards(JwtAuthGuard)
    me(
        @CurrentUser() user: User
    ) {
        return this.userService.filterUser(user, ['email']);
    }
}