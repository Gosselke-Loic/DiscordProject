import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { createSchemaForClassWithMethods } from "src/shared/mongoose/create.schema";
import { ObjectId } from "src/shared/mongoose/object-id";
import { Room } from "src/features/room/schema/room.schema";
import { User } from "src/features/user/schema/user.schema";

@Schema()
export class Message extends Document {
    @Prop({ required: true })
    message: string;

    @Prop({ type: ObjectId, ref: Room.name })
    room?: Room;

    @Prop()
    order: number;

    @Prop({ type: ObjectId, ref: User.name })
    from: User;

    @Prop({ type: ObjectId, ref: User.name })
    to?: User;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const MessageSchema = createSchemaForClassWithMethods(Message);