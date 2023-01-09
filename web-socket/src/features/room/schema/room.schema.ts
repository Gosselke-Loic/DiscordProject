import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

import { createSchemaForClassWithMethods } from "src/shared/mongoose/create.schema";
import { ObjectId } from "src/shared/mongoose/object-id";
import { User } from "src/features/user/schema/user.schema";

@Schema()
export class Room extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ type: [{ type: ObjectId, ref: User.name }] })
    members: User[];

    @Prop({ type: ObjectId, ref: User.name })
    owner: User;

    @Prop({ required: true })
    isPublic: boolean;
}

export const RoomSchema = createSchemaForClassWithMethods(Room);