const Promise = require('bluebird');
const DAL = require('../dal/index');

exports.contextWrapper = (method) => {
    const opendDALs = {};
    method.getDAL = async function(name){
        if(opendDALs[name]){
            return opendDALs[name];
        }
        opendDALs[name] = await DAL.open('name');
    };
    return function(...args){
        return Promise.resolve().then(() => method.apply(method, arguments)).finally(() => {
            for(const dal in opendDALs){
                dal.close();
            }
        });
    };
};