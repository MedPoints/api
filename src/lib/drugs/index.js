'use strict';

const Promise = require('bluebird');
const dal = require('../../dal/index');
const ResponseWithMeta = require("../../routes/responses").ResponseWithMeta;

const log = require('../../utils/logger').getLogger('DRUGS');

exports.getDrugs = async ({name, id, groupId, pharmacyId, filter}, paginator) => {
	const drugsDal = await dal.open('drugs');
	const pharmacyDal = await dal.open("pharmacies");
	try{
		if(id){
			let drug = await drugsDal.getDrugById(id);
			drug.providers.pharmacies = await pharmacyDal.getCount({drugs: {$in: [drug.id.toString()]}});
			return drug;
		}
		const query = {};
		if (groupId) {
			query['group.id'] =  groupId;
		}else if(name) {
			query.name = {$regex: name};
		}

		if(pharmacyId){
            const pharmacy = await pharmacyDal.getPharmacyById(pharmacyId);
            query.ids = pharmacy.drugs.map(x => x);
		}

		if(filter){
			if(filter.insurance){
				query['is_covered_by_insurance'] = filter.insurance === 'on';
			}
			if(filter.prescription){
				query['is_by_prescription'] = filter.prescription === 'on';
			}
			if(filter.maxPrice){
				const maxPrice = Number(filter.maxPrice);
				query['price.mpts'] = {$lte: maxPrice};
			}
			if(filter.city && filter.city !== 'worldwide'){
				const pharmQuery = {};
				pharmQuery['location.city'] = filter.city;
				const pharmacies = await pharmacyDal.getAllPharmaciesWithoutPages(pharmQuery);
				query.ids = pharmacies.reduce((total, {drugs}) => {
					total.push(...drugs.map(drug => new ObjectId(drug)));
					return total;
				}, []);
			}
		}

        const result = await drugsDal.getDrugsWithPages(query, paginator);
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
