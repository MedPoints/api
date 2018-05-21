const hospital = require('../../lib/hospitals/index');

exports.get = async (req, res) => {
    const {id, name} = req.query;
    try{
        const hospital = await hospital.getHospital({id, name});
        res.send({result: hospital});
    }catch(err){
        res.status(500).send({error: err});
    }
};

exports.post = async (req, res) => {
    const hospital = req.body;
    try{
        await hospital.saveHospital(hospital);
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
};

exports.put = async (req, res) => {
    const hospital = req.body;
    try{
        await hospital.updateHospital(hospital);
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
};

exports.delete = async (req, res) => {
    const {id} = req.query;
    try{
        await hospital.deleteHospital(id);
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
}; 
