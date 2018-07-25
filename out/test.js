"use strict";
const index_1 = require('./index');
index_1.getRouterMacAddress().then((arg) => {
    console.log("getRouterMacAddress returned: " + arg);
}).catch((err) => {
    console.log("getRouterMacAddress returned error: " + JSON.stringify(err));
});
//# sourceMappingURL=test.js.map