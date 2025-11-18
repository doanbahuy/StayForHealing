import { Prop } from '@nestjs/mongoose';

export class BaseModel {
    _id: any;

    @Prop({
        type: String,
    })
    createdBy: String;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    updatedBy: string;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    deletedBy: string;

    @Prop({
        required: false,
        type: Date,
        default: null,
    })
    deletedAt: Date;

    @Prop({
        required: true,
        type: Date,
        default: Date.now,
    })
    createdAt: Date;

    @Prop({
        required: false,
        type: Date,
        default: null,
    })
    updatedAt: Date;
}