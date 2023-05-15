import { User } from "./user";

export class UsersStorage {
  private users: Record<number, User> = {};

  public get(id: number): User {
    if (!this.users[id]) {
      this.users[id] = new User(id);
    }

    return this.users[id];
  }

  public remove(id: number): void {
    delete this.users[id];
  }
}

export const usersStorage = new UsersStorage();
