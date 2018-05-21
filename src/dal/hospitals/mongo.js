const collectionName = 'hospitals';

/**
 * @typedef {Object} Coordinations -- coordination model
 * @property {Number} lat
 * @property {Number} lon
 */

/**
 * @typedef {Object} Hospital -- hospital model
 * @property {Stirng} _id
 * @property {String} name -- hospital name
 * @property {String} specialiazion -- hospital specialization
 * @property {Coordinations} coordinations -- hospital coordinations
 * @property {Array<Doctor>} doctors
 */

/**
 * @param {String} id
 * @returns {Promise<Hospital>} 
 */
exports.getHospitalById = async function(id){
    return hospitalQuery.call(this, {_id: id});
};

/**
 * @param {String} name
 * @return {Promise<Hospital>}
 */
exports.getHospitalByByName = async function(name){
    return hospitalQuery.call(this, {name});
};

/**
 * @param {Hospital} hospital 
 */
exports.saveHospital = async function(hospital){
    const collection = this.mongo.collection(collectionName);
    await collection.save(hospital);
};

/**
 * 
 * @param {String} id 
 * @param {Hospital} hospital 
 */
exports.updateHospital = async function(id, hospital){
    const collection = this.mongo.collection(collectionName);
    await collection.update({_id: id}, hospital);
};


/**
 * @param {String} id 
 */
exports.deleteHospital = async function(id){
    const collection = this.mongo.collection(collectionName);
    await collection.remove({_id, id});
};

/**
 * @param {Object} filter
 * @returns {Promise<Hospital>} 
 */
async function hospitalQuery(filter){
    const collection = this.mongo.collection(collectionName);
    const hospitals = await collection.find(filter).limit(1).toArray();
    return hospitals[0];
} 
