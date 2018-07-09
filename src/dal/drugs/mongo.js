const collectionName = 'drugs';

const ObjectId = require('mongodb').ObjectId;

exports.getAllCategories = async function(){
	const collection = this.mongo.collection(collectionName);
	const categories = await collection.find({}).toArray();
	return categories.map(c => new DrugCategoryResponse(c));
};

exports.getCategoryById = async function(id){
	return exports.getCategoryByFilter({_id: ObjectId(id)});
};

exports.getCategoryByName = async function(name){
	return exports.getCategoryByFilter({name: name});
};

exports.saveCategory = async function(category){
	const collection = this.mongo.collection(collectionName);
	const entity = new DrugCatrgoryCreate(category);
	await collection.insert(entity);
};

exports.getCategoryByFilter = async function(filter){
	const collection = this.mongo.collection(collectionName);
	const [result] = await collection.find(filter).limit(1).toArray();
	if (!result) {
		return null;
	}
	return new DrugCategoryResponse(result[0]);
};

exports.deleteCategory = async function(id){
	const collection = this.mongo.collection(collectionName);
	await collection.remove({_id: ObjectId(id)});
};

class DrugCategoryBase {
	constructor({name, desc, drugs}) {
		this.name = name || '';
		this.desc = desc || '';
		this.drugs = drugs || [];
		this.drugs = this.drugs.map(d => new Drug(d));
	}
}

class DrugCatrgoryCreate extends DrugCategoryBase {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity.id || entity._id);
	}
}

class DrugCategoryResponse extends DrugCategoryBase {
	constructor(entity) {
		super(entity);
		this._id = ObjectId(entity.id || entity._id);
	}
}

class Drug {
	constructor({
		            name,
		            drugId,
		            indication,
		            type,
		            accessionNumber,
		            groups,
		            description,
		            synonyms,
		            unii,
		            cas,
		            chemicalFormula,
		            inchiKey,
		            inchi,
					iupac,
					smiles,
		            pharmacodynamics,
		            mechanismOfAction,
		            absorption,
		            volumeOfDistribution,
		            proteinBinding,
		            metabolism,
		            routeOfElimination,
					halfLife,
		            clearance,
					toxicity,
		            affectedOrganisms,
		            pathways,
		            pharmacogenomicEffects,
		            drugInteractions,
		            foodInteractions,
		            generalReferences,
		            externalLinks,
		            pubChemSubstance,
		            clinicalTrials,
		            manufacturers,
		            packagers,
		            dosageForms,
					prices,
		            patents,
					state,
		            experimentalProperties,
		            predictedProperties,
		            predictedADMETFeatures,
		            nist,
		            spectra,
		            classification
	            }) {
		this.name = name;
		this.drugId = drugId;
		this.indication = indication;
		this.type = type;
		this.accessionNumber = accessionNumber;
		this.groups = groups;
		this.description = description;
		this.synonyms = synonyms;
		this.unii = unii;
		this.cas = cas;
		this.chemicalFormula = chemicalFormula;
		this.inchiKey = inchiKey;
		this.inchi = inchi;
		this.iupac = iupac;
		this.smiles = smiles;
		this.pharmacodynamics = pharmacodynamics;
		this.mechanismOfAction = mechanismOfAction;
		this.absorption = absorption;
		this.volumeOfDistribution = volumeOfDistribution;
		this.proteinBinding = proteinBinding;
		this.metabolism = metabolism;
		this.routeOfElimination = routeOfElimination;
		this.halfLife = halfLife;
		this.clearance = clearance;
		this.toxicity = toxicity;
		this.affectedOrganisms = affectedOrganisms;
		this.pathways = pathways;
		this.pharmacogenomicEffects = pharmacogenomicEffects;
		this.drugInteractions = drugInteractions;
		this.foodInteractions = foodInteractions;
		this.generalReferences = generalReferences;
		this.externalLinks = externalLinks;
		this.pubChemSubstance = pubChemSubstance;
		this.clinicalTrials = clinicalTrials;
		this.manufacturers = manufacturers;
		this.packagers = packagers;
		this.dosageForms = dosageForms;
		this.prices = prices;
		this.patents = patents;
		this.state = state;
		this.experimentalProperties = experimentalProperties;
		this.predictedProperties = predictedProperties;
		this.predictedADMETFeatures = predictedADMETFeatures;
		this.nist = nist;
		this.spectra = spectra;
		this.classification = classification;
	}
}
