"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const constants_1 = require("./lib/constants");
app_1.app.listen(constants_1.PORT, () => {
    console.log(`TIMSAN API BACKEND - Running on PORT : ${constants_1.PORT}`);
});
