const userDashboard = require("../models/userDashboard")



const getRecentActivities=async(req,res)=>{
    const {userId}=req.user

    const result = await userDashboard.getRecentActivity(userId);
    if(!result){
        res.status(400).json({error:"No recent activity found"})
    }
    res.status(200).json({result})
   
  
}

const dashboard= async (req,res)=>{
    const { userId } = req.user;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  const user =await userDashboard.dashboard(userId)
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
   
    res.status(200).json({ user });
  
  
  }


module.exports = { getRecentActivities,dashboard}