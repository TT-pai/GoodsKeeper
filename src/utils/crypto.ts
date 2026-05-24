// src/utils/crypto.ts
import bcrypt from 'bcryptjs';

export class CryptoService {
  private static SALT_ROUNDS = 10;

  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.SALT_ROUNDS);
  }

  static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}