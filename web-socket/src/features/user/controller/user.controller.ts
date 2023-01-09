import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "../service/user.service";

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get(':username')
    async getuser(
        @Param('username') username: string
    ) {
        return this.userService.filterUser(
            await this.userService.validateUserByName(username),
        );
    }
}