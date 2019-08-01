const dal = require('../dal/index');
const Promise = require('bluebird');

/**
 * @param {Array} data
 * @returns {Promise<void>}
 */
exports.importDrugs = async function(data){
	const drugsDal = await dal.open('drugs');
	const groupDal = await dal.open('groups');
	try{
		await Promise.each(data, async (group) => {
			const category = await groupDal.saveCategory({name: group.name});
			category.drugs = await Promise.map(group.drugs, async (drug) => {
				drug.group = category;
				const newDrug = await drugsDal.saveDrug(drug);
				return newDrug._id.toString();
			});
			await groupDal.updateCategory(category._id, category);
		});
	}catch(e){
		console.log(e);
	}finally{
		drugsDal.close();
		groupDal.close();
	}
};
