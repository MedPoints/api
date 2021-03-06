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
			query.name = {$regex: `^${name}`, $options: 'i'};
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

exports.getDrugsByInterval = async function(interval){
	const drugsDal = await dal.open('drugs');
	try{
		return await drugsDal.getDrugsByInterval({"timestamp": {$lte: Date.now() - 60000*interval}});
	}catch(err){
		log.error({}, 'getDrugsByInterval error', err);
		throw err;
	}finally{
		drugsDal.close();
	}
};

exports.saveDrug = async function(entity){
	const drugsDal = await dal.open('drugs');
	const groupsDal = await dal.open('groups');
	try{
		const drugResult = await drugsDal.saveDrug(entity);
		await groupsDal.updateCategory(entity.group.id, {$push: {drugs: drugResult._id.toString()}});
		return drugResult;
	}catch(err){
		log.error({}, 'saveDrug error', err);
		throw err;
	}finally{
		drugsDal.close();
		groupsDal.close();
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
	const groupsDal = await dal.open('groups');
	try{
		const drug = await drugsDal.getDrugById(entity.id);
		if (drug.group.id !== entity.group.id) {
			await groupsDal.updateCategory(drug.group.id, {$pull: {drugs: entity.id}});
			await groupsDal.updateCategory(entity.group.id, {$push: {drugs: entity.id}});
		}
		const id = entity.id;
		delete entity.id;
		await drugsDal.updateDrug(id, {$set: entity});
	}catch(err){
		log.error({}, 'updateDrug error', err);
		throw err;
	}finally{
		drugsDal.close();
		groupsDal.close();
	}
};

exports.deleteDrug = async function(id){
	const drugsDal = await dal.open('drugs');
	const groupsDal = await dal.open('groups');
	try{
		const drug = await drugsDal.getDrugById(id);
		await groupsDal.updateCategory(drug.group.id, {$pull: {drugs: id}});
		await drugsDal.deleteDrug(id);
	}catch(err){
		log.error('drugsDal error', err);
		throw err;
	}finally{
		drugsDal.close();
		groupsDal.close();
	}
};