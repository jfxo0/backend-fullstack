// import mongoose from 'mongoose';
//
//
// const characterSchema = new mongoose.Schema({
//         name: {type: String, required: true},
//         description: {type: String, required: true},
//         funFact: {type: String, required: true},
//         // loc: {type: {type: String}, coordinates: [[Number]]},
//         // locationType: {type: String, enum: [ 'park', 'library', 'store']},
//         imageUrl: {type: String},
//         // hasBookmark: {type: Boolean, default: false},
//         // date: {type: Date, default: Date.now}
//     },
//     {
//         toJSON: {
//             virtuals: true,
//             versionKey: false,
//             transform: (doc, ret) => {
//                 ret._links = {
//                     self: {
//                         href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/characters/${ret.id}`,
//                     },
//                     collection: {
//                         href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/characters/detail`,
//                     },
//                 };
//
//                 delete ret._id;
//             },
//         },
//     }
// )
//
// const Character = mongoose.model('Character', characterSchema);
//
// export default Character;

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
