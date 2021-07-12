const Roles = require('../models/Roles');

exports.obtenerRoles =async(req,res)=>{
    try {
        const roles = await Roles.findAll();
        res.status(200).json(roles)
    } catch (error) {
    res.status(500).json({ msg: error.message });
    }
}