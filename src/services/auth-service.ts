import bcrypt from 'bcrypt';

class AuthService {
  /**
   * Hashes a given password using bcrypt with a generated salt.
   * @param password The plain-text password to be hashed.
   * @returns The hashed password.
   */
  generateHashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  };
}

export default new AuthService();
