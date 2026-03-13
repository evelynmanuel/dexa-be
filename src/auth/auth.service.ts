import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/user/entity/user.entity'
import { Repository } from 'typeorm'
import { LoginDto } from './dto/login.dto'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto
    const user = await this.repo.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    if (password !== user.password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // if (!(await bcrypt.compare(password, user.password))) {
    //   throw new UnauthorizedException('Invalid credentials')
    // }

    const payload = { sub: user.id, email: user.email }
    const access_token = this.jwtService.sign(payload)

    return {
      access_token: access_token,
      user: user,
    }
  }

  async getProfile(userId: string) {
    const user = await this.repo.findOne({ where: { id: userId } })
    if (!user) {
      throw new Error('User not found')
    }
    return { user }
  }
}
