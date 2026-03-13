import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserService } from './user.service'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { CreateUserDto, UpdateUserDto } from './dto/user.dto'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private service: UserService) {}

  @Get()
  findAll() {
    return this.service.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('profilePicture'))
  create(
    @Request() req,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const path = file ? `/uploads/${file.filename}` : undefined
    return this.service.create(req, createUserDto, path)
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('profilePicture'))
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const path = file ? `/uploads/${file.filename}` : undefined
    return this.service.update(req, id, updateUserDto, path)
  }
}
