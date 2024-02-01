"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllInstitutions = exports.addInstitution = void 0;
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
exports.addInstitution = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        const { institutionName, zone, acronym, address, lat, long, email, state, phoneNumber, } = req.body;
        // const alreadyExists = await prisma.institutionProfile.findFirst({
        //   where: {
        //     institutionName,
        //   },
        // });
        // if (alreadyExists) {
        //   return next(new ErrorHandler("Institution Already Exists!", 400))
        // }
        // const institution = await prisma.institutionProfile.create({
        //   data: {
        //     institutionName,
        //     acronym,
        //     address,
        //     lat,
        //     long,
        //     zone,
        //     email,
        //     state,
        //     phoneNumber,
        //     stateProfileId: "",
        //     userId: "",
        //   },
        // });
        res.status(200).json({
            message: "Good"
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
exports.getAllInstitutions = (0, middlewares_1.asyncErrorMiddleware)(async (req, res, next) => {
    try {
        // const institutions = await prisma.institutionProfile.findMany({
        //   select: {
        //     institutionName: true,
        //     lat: true,
        //     long: true,
        //   },
        // });
        res.status(200).json({
            message: "Fetched Institutions Successfully!",
            data: [],
        });
    }
    catch (error) {
        return next(new utils_1.ErrorHandler(error.message, 400));
    }
});
