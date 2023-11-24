"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingCloudUpload = exports.getBroadcastById = exports.getAllBroadcasts = exports.deleteBroadcast = exports.editBroadcast = exports.createBroadcast = exports.getAllNewsPosts = exports.getNewsPostById = exports.deleteNewsPost = exports.editNewsPost = exports.createNewsPost = exports.deleteConferenceById = exports.registerForConference = exports.getAllConferenceAttendee = exports.getAllConference = exports.createNewConference = exports.refreshAccessToken = exports.logoutUser = exports.loginUser = exports.getUserById = exports.deleteUserById = exports.getAllUsers = exports.confirmEmail = exports.registerUser = void 0;
var auth_service_1 = require("./auth.service");
Object.defineProperty(exports, "registerUser", { enumerable: true, get: function () { return auth_service_1.registerUser; } });
Object.defineProperty(exports, "confirmEmail", { enumerable: true, get: function () { return auth_service_1.confirmEmail; } });
Object.defineProperty(exports, "getAllUsers", { enumerable: true, get: function () { return auth_service_1.getAllUsers; } });
Object.defineProperty(exports, "deleteUserById", { enumerable: true, get: function () { return auth_service_1.deleteUserById; } });
Object.defineProperty(exports, "getUserById", { enumerable: true, get: function () { return auth_service_1.getUserById; } });
Object.defineProperty(exports, "loginUser", { enumerable: true, get: function () { return auth_service_1.loginUser; } });
Object.defineProperty(exports, "logoutUser", { enumerable: true, get: function () { return auth_service_1.logoutUser; } });
Object.defineProperty(exports, "refreshAccessToken", { enumerable: true, get: function () { return auth_service_1.refreshAccessToken; } });
var conference_service_1 = require("./conference.service");
Object.defineProperty(exports, "createNewConference", { enumerable: true, get: function () { return conference_service_1.createNewConference; } });
Object.defineProperty(exports, "getAllConference", { enumerable: true, get: function () { return conference_service_1.getAllConference; } });
Object.defineProperty(exports, "getAllConferenceAttendee", { enumerable: true, get: function () { return conference_service_1.getAllConferenceAttendee; } });
Object.defineProperty(exports, "registerForConference", { enumerable: true, get: function () { return conference_service_1.registerForConference; } });
Object.defineProperty(exports, "deleteConferenceById", { enumerable: true, get: function () { return conference_service_1.deleteConferenceById; } });
var newsAndBroadcast_service_1 = require("./newsAndBroadcast.service");
//news
Object.defineProperty(exports, "createNewsPost", { enumerable: true, get: function () { return newsAndBroadcast_service_1.createNewsPost; } });
Object.defineProperty(exports, "editNewsPost", { enumerable: true, get: function () { return newsAndBroadcast_service_1.editNewsPost; } });
Object.defineProperty(exports, "deleteNewsPost", { enumerable: true, get: function () { return newsAndBroadcast_service_1.deleteNewsPost; } });
Object.defineProperty(exports, "getNewsPostById", { enumerable: true, get: function () { return newsAndBroadcast_service_1.getNewsPostById; } });
Object.defineProperty(exports, "getAllNewsPosts", { enumerable: true, get: function () { return newsAndBroadcast_service_1.getAllNewsPosts; } });
//broadcasts
Object.defineProperty(exports, "createBroadcast", { enumerable: true, get: function () { return newsAndBroadcast_service_1.createBroadcast; } });
Object.defineProperty(exports, "editBroadcast", { enumerable: true, get: function () { return newsAndBroadcast_service_1.editBroadcast; } });
Object.defineProperty(exports, "deleteBroadcast", { enumerable: true, get: function () { return newsAndBroadcast_service_1.deleteBroadcast; } });
Object.defineProperty(exports, "getAllBroadcasts", { enumerable: true, get: function () { return newsAndBroadcast_service_1.getAllBroadcasts; } });
Object.defineProperty(exports, "getBroadcastById", { enumerable: true, get: function () { return newsAndBroadcast_service_1.getBroadcastById; } });
//test
Object.defineProperty(exports, "testingCloudUpload", { enumerable: true, get: function () { return newsAndBroadcast_service_1.testingCloudUpload; } });
