const db = require('../config/db')

class Stage {

    static async getStageById(id) {
        const stage = await db.query('SELECT * FROM stages WHERE id = $1', [id])
        return stage.rows[0]
    }
    static getAllStages() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM stage', (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    }


    static async updateStageById(id, stageName, stagePoints) {
        return new Promise((resolve, reject) => {
            db.query('UPDATE stage set stage_name = ?, stage_points = ?  WHERE id = ?', [stageName, stagePoints, id], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
       
    }
    static async createStage(stageName, stagePoints) {
        const stage = await db.query('INSERT INTO stages (stageName, stagePoints) values ($1, $2) RETURNING *', [stageName, stagePoints])
        return stage.rows[0]
    }
    static async deleteStageById(id) {
        const stage = await db.query('DELETE FROM stages WHERE id = $1', [id])
        return stage.rows[0]
    }

}


module.exports = Stage;