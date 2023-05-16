import { User } from "./user";
import pg from "../pg";

export class UsersStorage {
  private users: Record<number, User> = {};

  public getUser_UNSAFE(id: number) {
    return this.users[id];
  }

  public get(id: number): Promise<User> {
    if (!this.users[id]) {
      return pg.User.findOne({
        where: { userId: id },
      }).then((user) => {
        this.users[id] = new User(id, user?.auth || false);
        return this.users[id];
      });
    }

    return Promise.resolve(this.users[id]);
  }

  public remove(id: number): void {
    delete this.users[id];
  }
}

export const usersStorage = new UsersStorage();
