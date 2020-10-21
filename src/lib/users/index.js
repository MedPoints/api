"use strict";

const Promise = require("bluebird");
const uuid = require("uuid/v4");
const utils = require("../utils");

const doctorsModule = require("../doctors/index");
const hospitalsModule = require("../hospitals/index");
const pharmacyModule = require("../pharmacies/index");

const User = require("../../models/user");

const dal = require("../../dal/index");
const notifications = require("../../notifications/events");

exports.register = async ({
  publicKey,
  privateKey,
  firstName,
  lastName,
  email,
}) => {
  const authDAL = await dal.open("auth");
  try {
    const confirmationToken = uuid();
    const base64ConfirmationToken = Buffer.from(confirmationToken).toString(
      "base64"
    );
    const id = utils.createUserId(publicKey, privateKey);
    const existedUser = await authDAL.getUserById(id);
    if (existedUser) {
      if (existedUser.confirmed) {
        throw new Error("USER_ALREADY_EXISTS");
      }
      await authDAL.deleteUserById(id);
    }
    const user = {
      _id: id,
      publicKey,
      privateKey,
      confirmationToken,
      confirmed: false,
      firstName,
      lastName,
      email,
    };
    await authDAL.register(user);
    notifications.raise("registration", email, {
      token: base64ConfirmationToken,
      firstName,
      lastName,
    });
    return new User(user);
  } finally {
    authDAL.close();
  }
};

exports.confirm = async ({ token }) => {
  const authDAL = await dal.open("auth");
  try {
    const decodedToken = Buffer.from(token, "base64").toString();
    const user = await authDAL.getUserByConfirmId(decodedToken);
    if (!user) {
      throw new Error("CONFIRMATION_FAILED");
    }
    if (user.confirmed) {
      throw new Error("ALREADY_CONFIRMED");
    }
    await authDAL.confirmUser(user._id);
    return "OK";
  } finally {
    authDAL.close();
  }
};

exports.auth = async ({ publicKey, privateKey }) => {
  const authDAL = await dal.open("auth");
  try {
    const id = utils.createUserId(publicKey, privateKey);
    const user = await authDAL.getUserById(id);
    if (!user) {
      throw new Error("USER_NOT_EXIST");
    }
    if (!user.confirmed) {
      throw new Error("USER_NOT_CONFIRMED");
    }
    return new User(user);
  } finally {
    authDAL.close();
  }
};

exports.updateProfile = async (profile) => {
  const authDAL = await dal.open("auth");
  try {
    const id = utils.createUserId(profile.publicKey, profile.privateKey);
    const user = await authDAL.getUserById(id);
    if (!user) {
      throw new Error("USER_NOT_EXIST");
    }
    if (!user.confirmed) {
      throw new Error("USER_NOT_CONFIRMED");
    }
    await authDAL.updateUser(id, Object.assign({}, user, profile));
    return "OK";
  } finally {
    authDAL.close();
  }
};

exports.getUserInfo = async ({ publicKey, privateKey }) => {
  const authDAL = await dal.open("auth");
  try {
    const id = utils.createUserId(publicKey, privateKey);
    const user = await authDAL.getUserById(id);
    return new User(user);
  } finally {
    authDAL.close();
  }
};

exports.addToFavorites = async ({ publicKey, privateKey }, favorite) => {
  const authDAL = await dal.open("auth");
  try {
    const userId = utils.createUserId(publicKey, privateKey);
    const user = await authDAL.getUserById(userId);
    if (!user) {
      throw new Error("USER_NOT_EXIST");
    }
    if (user.favorites && user.favorites.find(({ id }) => id === favorite.id)) {
      return "ALREADY_ADDED";
    }
    await authDAL.addFavorite(userId, favorite);
    return "OK";
  } finally {
    authDAL.close();
  }
};

exports.removeFromFavorites = async ({ publicKey, privateKey }, favorite) => {
  const authDAL = await dal.open("auth");
  try {
    const userId = utils.createUserId(publicKey, privateKey);
    const user = await authDAL.getUserById(userId);
    if (!user) {
      throw new Error("USER_NOT_EXIST");
    }
    if (!user.favorites.find(({ id }) => id === favorite.id)) {
      throw new Error("FAVORITE_NOT_EXIST");
    }
    await authDAL.removeFavorite(userId, favorite);
    return "OK";
  } finally {
    authDAL.close();
  }
};

exports.getFavorites = async ({ publicKey, privateKey }) => {
  const authDAL = await dal.open("auth");
  const userId = utils.createUserId(publicKey, privateKey);
  try {
    const result = {
      clinics: [],
      pharmacies: [],
      doctors: [],
    };

    const user = await authDAL.getUserById(userId);
    if (!user) {
      throw new Error("USER_NOT_EXIST");
    }
    if (!user.favorites || user.favorites.length === 0) {
      return result;
    }
    const clinicsFavs = user.favorites.filter(({ type }) => type === "clinic");
    const doctorFavs = user.favorites.filter(({ type }) => type === "doctor");
    const pharmacyFavs = user.favorites.filter(
      ({ type }) => type === "pharmacy"
    );

    await Promise.all([
      Promise.each(clinicsFavs, async ({ id }) => {
        const clinic = await hospitalsModule.getHospital({ id });
        result.clinics.push(clinic);
      }),
      Promise.each(doctorFavs, async ({ id }) => {
        const doctor = await doctorsModule.getDoctorById(id);
        result.doctors.push(doctor);
      }),
      Promise.each(pharmacyFavs, async ({ id }) => {
        const pharmacy = await pharmacyModule.getPharmacies({ id });
        result.pharmacies.push(pharmacy);
      }),
    ]);

    return result;
  } finally {
    authDAL.close();
  }
};

exports.getCount = async (filter = {}) => {
  const authDAL = await dal.open("auth");
  try {
    return authDAL.getCount(filter);
  } catch (err) {
    log.error("getCount error", err);
    throw err;
  } finally {
    authDAL.close();
  }
};
