const Promise = require('bluebird');
const dal = require('../../dal/index');
const {ResponseWithMeta} = require('../../routes/responses');

exports.getSpecializations = async function(paginator){
	const specDAL = dal.open('specializations');
	const doctorsDAL = dal.open('doctors');
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
