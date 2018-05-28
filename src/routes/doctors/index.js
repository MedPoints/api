const doctors = require('../../lib/doctors/index');

exports.get = async (req, res) => {
    const {id, name} = req.query;
    try{
        const doctor = await doctors.getDoctor({name, id});
        res.send({result: doctor});
    }catch(err){
        res.status(500).send({error: err});
    }
};

exports.post = async (req, res) => {
    const doctor = req.body;
    try{
        await doctors.saveDoctor(doctor);
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
};

exports.put = async (req, res) => {
    const doctor = req.body;
    try{
    	await doctors.updateDoctor(doctor);
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
};

exports.delete = async (req, res) => {
    const {id} = req.query;
    try{
        await doctors.deleteDoctor(id);
        res.send({result: 'OK'});
    }catch(err){
        res.status(500).send({error: err});
    }
};


exports.post = {
    path: '/rating/:id',
    handler: async (req, res) => {
        const id = req.params.id;
	    const score = req.body.score;
	    try{
		    res.send({result: 'OK'});
	    }catch(err){
		    res.status(500).send({error: err});
	    }
    }
};
