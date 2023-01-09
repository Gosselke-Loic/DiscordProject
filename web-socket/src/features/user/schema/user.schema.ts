import * as bcrypt from 'bcrypt';
import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { createSchemaForClassWithMethods } from 'src/shared/mongoose/create.schema';

@Schema()
export class User extends Document {
    @Prop()
    username: string;

    @Prop()
    email: string;

    @Prop()
    sessionToken: string;

    @Prop({ default: false })
    online: boolean;

    @Prop()
    password?: string;
}

export const UserSchema = createSchemaForClassWithMethods(User);

UserSchema.pre('save', async function(next) {
    const user: User = this as any;

    if (!user.password || user.password.startsWith('$')) {
        return next()
    }

    try {
        const salt = await bcrypt.genSalt();

        user.password = await bcrypt.hash(user.password, salt);

        next();
    } catch (e) {
        next(e);
    }
});