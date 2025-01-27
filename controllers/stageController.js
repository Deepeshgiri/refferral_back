const UserStage = require("../models/userStage");
const Reward = require("../models/reward");
const Referral = require("../models/referral");
const User = require("../models/user");

const STAGE_CONFIG = {
  1: {
    requirements: {
      directReferrals: 2,
      points: 100
    },
    reward: 50
  },
  2: {
    requirements: {
      directReferrals: 5,
      points: 250
    },
    reward: 100
  },
  3: {
    requirements: {
      directReferrals: 10,
      points: 500
    },
    reward: 200
  }
};

const stageController = {
  // Initialize user stage
  initializeUserStage: async (userId) => {
    try {
      return await UserStage.create({
        userId,
        stage: 1,
        requirements: STAGE_CONFIG[1].requirements,
        nextStageRequirements: STAGE_CONFIG[2]?.requirements
      });
    } catch (error) {
      console.error('Error in initializeUserStage:', error);
      throw error;
    }
  },

  // Get user's current stage
  getUserStage: async (req, res) => {
    try {
      const { userId } = req.params;
      const userStage = await UserStage.findOne({
        where: { userId },
        order: [['stage', 'DESC']]
      });

      if (!userStage) {
        return res.status(404).json({ message: "User stage not found" });
      }

      return res.status(200).json(userStage);
    } catch (error) {
      console.error('Error in getUserStage:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Check and update stage progress
  checkStageProgress: async (req, res) => {
    try {
      const { userId } = req.params;
      const userStage = await UserStage.findOne({
        where: { userId },
        order: [['stage', 'DESC']]
      });

      if (!userStage) {
        return res.status(404).json({ message: "User stage not found" });
      }

      const currentStage = userStage.stage;
      const requirements = STAGE_CONFIG[currentStage].requirements;
      
      // Check if requirements are met
      const requirementsMet = await stageController.checkRequirements(userId, requirements);

      if (requirementsMet) {
        // Update stage
        await userStage.update({
          stage: currentStage + 1,
          completedAt: new Date(),
          requirements: STAGE_CONFIG[currentStage + 1]?.requirements,
          nextStageRequirements: STAGE_CONFIG[currentStage + 2]?.requirements
        });

        // Create reward for stage completion
        await Reward.create({
          userId,
          type: 'stage_completion',
          amount: STAGE_CONFIG[currentStage].reward,
          status: 'pending',
          description: `Completion reward for stage ${currentStage}`
        });

        return res.status(200).json({
          message: `Advanced to stage ${currentStage + 1}`,
          reward: STAGE_CONFIG[currentStage].reward
        });
      }

      return res.status(200).json({
        message: "Stage requirements not met yet",
        currentProgress: requirementsMet
      });
    } catch (error) {
      console.error('Error in checkStageProgress:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Helper function to check if requirements are met
  checkRequirements: async (userId, requirements) => {
    // Get direct referrals count
    const directReferrals = await Referral.count({
      where: { 
        referrerId: userId,
        status: 'active'
      }
    });

    // Get user points
    const user = await User.findByPk(userId);
    const points = user?.points || 0;

    // Compare with requirements
    const meetsReferralReq = directReferrals >= requirements.directReferrals;
    const meetsPointsReq = points >= requirements.points;

    // Only return true if all requirements are met
    const requirementsMet = meetsReferralReq && meetsPointsReq;

    return {
      directReferrals: {
        required: requirements.directReferrals,
        current: directReferrals,
        met: meetsReferralReq
      },
      points: {
        required: requirements.points,
        current: points,
        met: meetsPointsReq
      },
      allRequirementsMet: requirementsMet
    };
  }
};

module.exports = stageController;