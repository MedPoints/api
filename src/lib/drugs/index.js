const Promise = require('bluebird');
const dal = require('../../dal/index');
const ResponseWithMeta = require("../../routes/responses").ResponseWithMeta;

const log = require('../../utils/logger').getLogger('DRUGS');

exports.getDrugs = async ({name, id, groupId, pharmacyId}, paginator) => {
	const drugsDal = await dal.open('drugs');
	const pharmacyDal = await dal.open("pharmacies");
	try{
		if(id){
			let drug = await drugsDal.getDrugById(id);
			drug.providers.pharmacies = await pharmacyDal.getCount({drugs: {$in: [drug.id.toString()]}});
			return drug;
		}
		const filter = {};
		if (groupId) {
			filter['group.id'] =  groupId;
		}else if(name) {
			filter.name = name;
		}

		if(pharmacyId){
            let pharmacy = await pharmacyDal.getPharmacyById(pharmacyId);
            filter.ids = pharmacy.drugs.map(x => x);
		}

        const result = await drugsDal.getDrugsWithPages(filter, paginator);
		await Promise.each(result.data, async (drug) => {
			drug.providers.pharmacies = await pharmacyDal.getCount({drugs: {$in: [drug.id.toString()]}});
		});

		return new ResponseWithMeta(result);
	}catch(err){
		log.error('getDrugs error', err);
		throw err;
	}finally{
		drugsDal.close();
        pharmacyDal.close();
	}
};

exports.saveDrug = async function(entity){
	const drugsDal = await dal.open('drugs');
	try{
		return drugsDal.saveDrug(entity);
	}catch(err){
		log.error({}, 'saveDrug error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};

exports.getCount = async function(filter = {}) {
	const drugsDal = await dal.open('drugs');
	try{
		return drugsDal.getCount(filter);
	}catch(err){
		log.error({}, 'getCount error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};

exports.updateDrug = async function(entity){
	const drugsDal = await dal.open('drugs');
	try{
		return drugsDal.updateDrug(entity.id, entity);
	}catch(err){
		log.error({}, 'updateDrug error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};
