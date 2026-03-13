import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: { user: { id: string } }) {
    return this.authService.getProfile(req.user.id)
  }
}
