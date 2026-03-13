import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator'
import { UserRole } from '../entity/user.entity'

export class CreateUserDto {
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @MinLength(6)
  password: string

  @IsOptional()
  position: string

  @IsEnum(UserRole)
  role: UserRole

  @IsOptional()
  @Matches(/^[0-9]+$/)
  phoneNumber: string

  @IsOptional()
  profilePicture: string
}

export class UpdateUserDto {
  @IsOptional()
  name?: string

  @IsOptional()
  @MinLength(6)
  password?: string

  @IsOptional()
  position?: string

  @IsEnum(UserRole)
  role: UserRole

  @IsOptional()
  @Matches(/^[0-9]+$/)
  phoneNumber?: string

  @IsOptional()
  profilePicture?: string
}
