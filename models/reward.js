const { Sequelize, DataTypes } = require("sequelize");

const User = require("./user");
const Referral = require("./referral");
const { sequelize } = require("./config/database");


const Reward = sequelize.define("Reward", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  referralId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Referral,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('referral', 'stage_completion', 'mlm_bonus'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('pending', 'processed', 'paid'),
    defaultValue: 'pending'
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Define relationships
Reward.belongsTo(User, { foreignKey: 'userId' });
Reward.belongsTo(Referral, { foreignKey: 'referralId' });
User.hasMany(Reward, { foreignKey: 'userId' });
Referral.hasMany(Reward, { foreignKey: 'referralId' });

module.exports = Reward;