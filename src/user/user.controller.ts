import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'guards/jwt.guard';
import {
  ICreateUser,
  IModifyUserStatus,
  IUpdateUser,
  IUserFilters,
} from './user.dto';
import { Request } from 'express';
import { Roles } from 'decorators/roles.decorator';
import { RolesGuard } from 'guards/authorize.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  getAllUsers(@Query() filters: IUserFilters) {
    return this.userService.getAllUsers(filters);
  }

  @Post('create')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  createUser(@Body() data: ICreateUser, @Req() req: Request) {
    return this.userService.createUser(data, req.metadata);
  }

  @Put('update')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  updateUser(@Body() data: IUpdateUser, @Req() req: Request) {
    return this.userService.updateUser(data, req.metadata);
  }

  @Put('status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  ModifyUser(@Body() data: IModifyUserStatus, @Req() req: Request) {
    return this.userService.modifyUserStatus(data, req.metadata);
  }

  @Get('linked')
  @UseGuards(AuthGuard)
  listLinkedAgencies(@Req() req: Request) {
    return this.userService.listMyLinkedAgencies(req.metadata.user);
  }
}
