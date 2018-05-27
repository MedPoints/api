const doctors = require('../../lib/doctors/index');

exports.get = async (req, res) => {
    const {id, name} = req.query;
    try{
        const doctor = await doctors.getDoctor({id});
        res.send({result: doctor});
    }catch(err){
        console.log(err);
        res.status(500).send({error: err});
    }
};

exports.post = async (req, res) => {
    const doctor = req.body;
    try{
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
};

exports.put = async (req, res) => {
    const doctor = req.body;
    try{
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
};

exports.delete = async (req, res) => {
    const {id} = req.query;
    try{
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
};
