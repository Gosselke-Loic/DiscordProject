import * as bcrypt from "bcrypt";

export function validatePassword(password: string, userPassword: string): Promise<boolean> {
    return bcrypt.compare(password, userPassword || '');
}