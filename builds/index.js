"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const constants_1 = require("./lib/constants");
app_1.app.listen(constants_1.PORT, () => {
    // mailTransporter.verify((error, success) => {
    //   if (error) {
    //     console.log("error sending email now... ", error)
    //   } else {
    //     console.log("can now send emails... ", success)
    //   }
    // })
    console.log(`TIMSAN API BACKEND - Running on PORT : ${constants_1.PORT}`);
    // console.log()
});
