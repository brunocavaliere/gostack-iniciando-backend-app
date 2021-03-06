import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import AppError from '../errors/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const usersRepository = getRepository(User);

    // Check if e-mail is unique
    const checkUserExists = await usersRepository.findOne({ where: { email } });
    if (checkUserExists) throw new AppError('E-mail address already in use');

    // Hashing password
    const hashedPassword = await hash(password, 8);

    // Saving user in the database
    const user = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await usersRepository.save(user);

    return user;
  }
}
