import { DataSource, DeepPartial, ObjectLiteral, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async insertUser(user: DeepPartial<User>[]): Promise<User> {
    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .returning('*')
      .execute();

    return result.raw as User;
}

  async findAll(): Promise<User[] | null> {
    const user = await this.dataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .getMany();

    return user;
  }

  async findOne(id: ObjectLiteral): Promise<User | null> {
    const user = await this.dataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where(id)
    .getOne();

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
}
