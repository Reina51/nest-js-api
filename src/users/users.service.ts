import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { password, confirmPassword, username, phone } = createUserDto;
    if (password !== confirmPassword) throw new BadRequestException('Passwords do not match');

    const existing = await this.usersRepository.findOne({ where: [{ username }, { phone }] });
    if (existing) throw new BadRequestException('Username or phone already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({ ...createUserDto, password: hashedPassword });
    const savedUser = await this.usersRepository.save(user);

    const { password: _, ...result } = savedUser;
    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const { usernameOrPhone, password } = loginUserDto;
    const user = await this.usersRepository.findOne({
      where: [{ username: usernameOrPhone }, { phone: usernameOrPhone }],
    });

    if (!user) throw new UnauthorizedException('User not found');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username };
    const token = this.jwtService.sign(payload);

    return { message: 'Login successful', access_token: token };
  }

  async updateUser(userId: number | string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: +userId } });
    if (!user) throw new NotFoundException('User not found');

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const exists = await this.usersRepository.findOne({ where: { username: updateUserDto.username } });
      if (exists) throw new BadRequestException('Username already exists');
    }

    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const exists = await this.usersRepository.findOne({ where: { phone: updateUserDto.phone } });
      if (exists) throw new BadRequestException('Phone already exists');
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const updated = await this.usersRepository.save(user);
    const { password, ...result } = updated;

    return { message: 'User updated successfully', user: result };
  }

  async findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }
}
