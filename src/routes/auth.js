"use strict";

const { Router } = require("express");

const users = require("../lib/users/index");

const validator = require("../validators/auth");

const router = new Router();

router.get(
  "/:publicKey/:privateKey",
  validator.getUserInfo,
  async (req, res, next) => {
    try {
      res.result = await users.getUserInfo(req.params);
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/register",
  validator.registerValidator,
  async (req, res, next) => {
    try {
      res.result = await users.register(req.body);
      next();
    } catch (e) {
      next(e);
    }
  }
);

router.get("/confirm", validator.confirmValidator, async (req, res, next) => {
  try {
    res.result = await users.confirm(req.query);
    // if (res.result === 'OK') {
    // 	res.redirect(301, 'http://medpoints.online/confirm');
    // 	return;
    // }
    next();
  } catch (err) {
    next(err);
  }
});

router.post("/auth", validator.authValidator, async (req, res, next) => {
  try {
    res.result = await users.auth(req.body);
    next();
  } catch (err) {
    next(err);
  }
});

router.put(
  "/update",
  validator.updateProfileValidator,
  async (req, res, next) => {
    try {
      res.result = await users.updateProfile(req.body);
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.get("/count", async (req, res, next) => {
  try {
    res.result = await users.getCount();
    next();
  } catch (err) {
    next(err);
  }
});

router.get("/:publicKey/:privateKey/favorites", async (req, res, next) => {
  try {
    res.result = await users.getFavorites(req.params);
    next();
  } catch (err) {
    next(err);
  }
});

router.post(
  "/:publicKey/:privateKey/favorites",
  validator.addToFavorites,
  async (req, res, next) => {
    try {
      res.result = await users.addToFavorites(req.params, req.body);
      next();
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:publicKey/:privateKey/favorites/remove",
  async (req, res, next) => {
    try {
      res.result = await users.removeFromFavorites(req.params, req.body);
      next();
    } catch (err) {
      next(err);
    }
  }
);

exports.module = router;
exports.name = "users";
