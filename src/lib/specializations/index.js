const Promise = require('bluebird');
const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

exports.getSpecializations = async function(paginator){
	const [specDAL, doctorsDAL] = await Promise.all([dal.open('specializations'), dal.open('doctors')]);
	try{
		const result = await specDAL.getSpecializationsWithPages({}, paginator);
		result.data = await Promise.map(result.data, async (specialization) => {
			specialization.count = await doctorsDAL.getCount({specialization: specialization.name});
			return specialization;
		});
		return new ResponseWithMeta(result);
	}
	finally{
		specDAL.close();
		doctorsDAL.close();
	}
};

exports.saveSpecialization = async function(specialization) {
	const specDAL = await dal.open('specializations');
	try{
		await specDAL.saveSpecialization(specialization);
	}finally{
		specDAL.close();
	}
};
