import { User } from "src/features/user/schema/user.schema";
import { randomString } from "./random-string";

export function generateSessionToken(user: User): User {

    user.sessionToken = randomString(60);

    return user;
}