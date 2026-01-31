import express from "express";
import { faker } from "@faker-js/faker";
import Character from "../models/Character.js";


const router = express.Router();


router.options('/detail', (req, res) => {
    res.header('Allow', 'GET,POST,OPTIONS');
    res.header('access-control-allow-methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, Authorization, X-Requested-With');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(204).send();
});


router.get('/detail', async (req, res) => {
    const characters = await Character.find().select('name description');

    res.json({
        items: characters,
        _links: {
            "self": {
                "href": `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/characters/detail`
            },
            "collection": {
                "href": `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/characters/detail`
            }
        }
    });
})



router.post('/detail', async (req, res) => {

    const { name, description, funFact, imageUrl } = req.body;

    if (!name || !description || !funFact) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['name', 'description', 'funFact']
        });
    }

    try {
        const created = await Character.create({
            name,
            description,
            funFact,
            imageUrl
        });

        return res.status(201).json(created);
    } catch (err) {

        return res.status(500).json({ error: "Server error" });
    }
});


router.options('/:id', (req, res) => {
    // res.header('Allow', 'GET, PUT, DELETE, OPTIONS, Origin, Content-Type, Accept, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Origin');
    res.header('Allow', 'GET,PUT,DELETE,OPTIONS');
    res.header('access-control-allow-methods', 'GET,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Accept, Content-Type, Authorization, X-Requested-With');
    res.status(204).send();
});

router.get('/:id', async (req, res) => {
    const character = await Character.findById(req.params.id);
    if (character === null) {
        res.status(404).send();
    } else {
        res.json(character);
    }

});


router.put('/:id', async (req, res) => {


    const updateId = req.params.id


    try {
        const update = await Character.findByIdAndUpdate(updateId,{
            name: req.body.name ,
            description: req.body.description ,
            funFact: req.body.funFact ,
            imageUrl: req.body.imageUrl
        }, {
            new:true,
            runValidators:true
        });

        if (!update){
            res.status(404).json({message:"BLAHAa"})
        }else {
            res.status(200).json(update)
        }

        // return res.status(201).json(update);
    } catch (e) {
        // safety net (zou nu niet meer moeten gebeuren)
        return res.status(400).json({ error: "Field required" });
    }
});


router.delete('/:id', async(req,res) =>{

    try {
        const character = await Character.findByIdAndDelete(req.params.id);
        if (character) {
            res.status(204).json({message: "Note deleted"})
        } else {
            res.status(404).send();
        }
    }catch (e){
        res.status(404).send()
    }
})


// TODO: routes aanmaken
router.post('/seed', async (req, res) => {

    //delete all current
    await Character.deleteMany({});

    for (let i = 0; i < req.body.amount; i++) {

        await Character.create({
            name: faker.word.adjective(),
            description: faker.lorem.lines(4),
            funFact: faker.lorem.lines(1),
            imageUrl: faker.lorem.lines(4),

        })

        res.send();
        res.status(201).send();
    }

});


export default router;

//
//
// import express from "express";
// import { faker } from "@faker-js/faker";
// import Character from "../models/Character.js";
//
// const router = express.Router();
//
// /* ===================== OPTIONS ===================== */
// router.options("/detail", (req, res) => {
//     res.header("Allow", "GET,POST,OPTIONS");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Accept, Content-Type");
//     return res.sendStatus(204);
// });
//
// router.options("/:id", (req, res) => {
//     res.header("Allow", "GET,PUT,PATCH,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Accept, Content-Type");
//     return res.sendStatus(204);
// });
//
// /* ===================== COLLECTION ===================== */
// // GET collection (subset)
// router.get("/detail", async (req, res) => {
//     const characters = await Character.find().select("name description");
//
//     res.json({
//         items: characters,
//         _links: {
//             self: {
//                 href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/characters/detail`,
//             },
//             collection: {
//                 href: `${process.env.APPLICATION_URL}:${process.env.EXPRESS_PORT}/characters/detail`,
//             },
//         },
//     });
// });
//
// // POST collection (create)
// router.post("/detail", async (req, res) => {
//     const { name, description, funFact, imageUrl } = req.body;
//
//     if (!name?.trim() || !description?.trim() || !funFact?.trim()) {
//         return res.status(400).json({ error: "Invalid resource" });
//     }
//
//     const created = await Character.create({
//         name,
//         description,
//         funFact,
//         imageUrl,
//     });
//
//     return res.status(201).json(created);
// });
//
// /* ===================== DETAIL ===================== */
// // GET detail (full)
// router.get("/:id", async (req, res) => {
//     const character = await Character.findById(req.params.id);
//     if (!character) return res.sendStatus(404);
//     return res.json(character);
// });
//
// // PUT full update
// router.put("/:id", async (req, res) => {
//     const { name, description, funFact, imageUrl } = req.body;
//
//     if (!name?.trim() || !description?.trim() || !funFact?.trim()) {
//         return res.status(400).json({ error: "Invalid resource" });
//     }
//
//     const updated = await Character.findByIdAndUpdate(
//         req.params.id,
//         { name, description, funFact, imageUrl },
//         { new: true, runValidators: true }
//     );
//
//     if (!updated) return res.sendStatus(404);
//     return res.status(200).json(updated);
// });
//
// // PATCH partial update
// router.patch("/:id", async (req, res) => {
//     const updates = {};
//
//     if ("name" in req.body) {
//         if (!req.body.name?.trim()) return res.status(400).json({ error: "Invalid field" });
//         updates.name = req.body.name;
//     }
//     if ("description" in req.body) {
//         if (!req.body.description?.trim()) return res.status(400).json({ error: "Invalid field" });
//         updates.description = req.body.description;
//     }
//     if ("funFact" in req.body) {
//         if (!req.body.funFact?.trim()) return res.status(400).json({ error: "Invalid field" });
//         updates.funFact = req.body.funFact;
//     }
//     if ("imageUrl" in req.body) {
//         updates.imageUrl = req.body.imageUrl;
//     }
//
//     if (Object.keys(updates).length === 0) {
//         return res.status(400).json({ error: "Empty update" });
//     }
//
//     const updated = await Character.findByIdAndUpdate(
//         req.params.id,
//         { $set: updates },
//         { new: true, runValidators: true }
//     );
//
//     if (!updated) return res.sendStatus(404);
//     return res.status(200).json(updated);
// });
//
// // DELETE
// router.delete("/:id", async (req, res) => {
//     const deleted = await Character.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.sendStatus(404);
//     return res.sendStatus(204);
// });
//
// /* ===================== SEED ===================== */
// router.post("/seed", async (req, res) => {
//     await Character.deleteMany({});
//
//     for (let i = 0; i < req.body.amount; i++) {
//         await Character.create({
//             name: faker.word.adjective(),
//             description: faker.lorem.lines(4),
//             funFact: faker.lorem.lines(1),
//             imageUrl: faker.lorem.lines(1),
//         });
//     }
//
//     return res.status(201).json({ message: "Seeded" });
// });
//
// export default router;
