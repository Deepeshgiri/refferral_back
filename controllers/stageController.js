const Stage = require("../models/stageModel")

const getAllStages = async (req, res) => {
    try {
        const stages = await Stage.getAllStages(); 

        if (!stages || stages.length === 0) {
            return res.status(404).json({ message: "No stages found" }); // Proper error response
        }

        console.log("stages:", stages);
        return res.status(200).json(stages); // Send JSON response
    } catch (error) {
        console.error("Error fetching stages:", error);
        return res.status(500).json({ message: "Internal Server Error" }); // Handle errors
    }
};

const updateStage = async (req,res)=>{
    const {id, stage_name, stage_points}= req.body;
    const stage = await Stage.updateStageById(id, stage_name, stage_points);
    if(!stage){
        return res.status(404).json({message: "Stage not found"});
    }
    return res.status(200).json(stage);
}


module.exports = {
    getAllStages,updateStage
}