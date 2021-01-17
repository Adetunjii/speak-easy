const { Router } = require("express");
const Group = require("../utils/group");
const router = Router();

router.post("/createGroup", auth, (req, res) => {
    try{
        const group = new Group(req.body);
        await group.save();
        res.status(201).send(group);
    }
    catch(error){
        res.status(400).send()
    }
});

router.get('/getAllGroups', auth, async (req,res) => {
    try{
        const groups = await Group.find({});
        res.status(200).send(groups)
    }
    catch(error){
        res.status(500).send(error)
    }
});

router.delete("/deleteGroup/:id", auth, async (req, res) => {
    try{
        const groupId = req.params.id;
        const group = await Group.findByIdAndDelete(groupId);

        if(!group) {
            return res.status(404).send({error: "Group doesn't exist"});
        }
        
        res.status(200).send(group)

    }
    catch(error){
        res.status(500).send({error: "A server error occured"})
    }
})

module.exports = router;