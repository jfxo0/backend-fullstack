
import mongoose from "mongoose";

const characterSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        funFact: { type: String, required: true },
        imageUrl: { type: String },
    },
    {
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/characters/${ret.id}`,
                    },
                    collection: {
                        href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/characters/detail`,
                    },
                };
                delete ret._id;
            },
        },
    }
);

export default mongoose.model("Character", characterSchema);
