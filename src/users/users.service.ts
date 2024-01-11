import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User } from './schemas';
import * as bcrypt from 'bcrypt';
import { EXCEPTION_MESSAGE, ROLES_CONSTANTS } from '../constants';
import { SignupDto } from '../auth/dtos';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) {
    const adminUser = new this.usersModel({
      username: 'admin',
      password: bcrypt.hashSync('strongAdminPassword', 5),
      roles: [ROLES_CONSTANTS.ADMIN],
    });

    adminUser.save().catch((e) => {
    });
  }

  async findOneByUsername(username: string) {
    return this.usersModel.findOne({ username: username });
  }

  async findOneById(id: string) {
    return this.usersModel.findOne({ _id: id });
  }

  async findOneByRefreshToken(refreshToken: string) {
    return this.usersModel.findOne({ refreshToken: refreshToken });
  }

  async checkRole(id: ObjectId, role: string) {
    const user = await this.usersModel.findOne(id);
    if (!user) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    return user.roles.includes(role);
  }

  async create(dto: SignupDto) {
    return (new this.usersModel({
      username: dto.username,
      password: bcrypt.hashSync(dto.password, 5),
    })).save();
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return this.usersModel.updateOne({ _id: id }, { refreshToken });
  }

  async delete() {
    return this.usersModel.deleteMany();
  }
}
