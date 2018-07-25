"use strict";
const child_process_1 = require('child_process');
let ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
//let macAddressRegex = /^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/gmi
let macAddressRegex = /\b([0-9a-fA-F]{2}[:.-]){5}[0-9a-fA-F]{2}\b/gmi;
function extractDefaultGatewayIPFromIpConfigText(str) {
    let idx = str.toLowerCase().indexOf("default gateway");
    if (idx > -1) {
        let idxEnd = str.indexOf("\r", idx + 1);
        let toTest = "";
        if (idxEnd > -1) {
            toTest = str.substring(idx, idxEnd);
        }
        else {
            toTest = str.substring(idx);
        }
        let ary = toTest.match(ipRegex);
        if (ary && ary.length)
            return ary[0];
    }
    return "";
}
function extractMacAddressFromArpText(str, gatewayIp) {
    //console.log(str);
    //console.log(gatewayIp);
    let idx = str.toLowerCase().indexOf(gatewayIp + " ");
    if (idx > -1) {
        // console.log("found gatewayip");
        let idxEnd = str.indexOf("\r", idx + 1);
        let toTest = "";
        if (idxEnd > -1) {
            toTest = str.substring(idx, idxEnd);
        }
        else {
            toTest = str.substring(idx);
        }
        //console.log(toTest);
        let ary = toTest.match(macAddressRegex);
        if (ary && ary.length)
            return ary[0];
    }
    return "";
}
function _getRouterMacAddress() {
    return new Promise((resolve, reject) => {
        let ipconfig = child_process_1.spawn('ipconfig', ['/all']);
        let ipConfigText = "";
        ipconfig.stdout.on('data', data => {
            ipConfigText += data.toString();
        });
        ipconfig.stderr.on('data', data => {
        });
        ipconfig.on('close', code => {
            if (ipConfigText.length > 0) {
                let arpResponse = '';
                let gatewayIp = extractDefaultGatewayIPFromIpConfigText(ipConfigText);
                let arp = child_process_1.spawn('arp', ['-a']);
                arp.stdout.on('data', data => {
                    arpResponse += data.toString();
                });
                arp.on('close', code => {
                    let macAddr = extractMacAddressFromArpText(arpResponse, gatewayIp);
                    if (macAddr != null && macAddr != "") {
                        resolve(macAddr);
                    }
                    else {
                        reject("cannot find valid mac address in arp text");
                    }
                    let idx = arpResponse.indexOf(gatewayIp);
                    if (idx > -1) {
                        let idxEnd = arpResponse.indexOf("\r", idx + 1);
                        if (idxEnd > -1) {
                        }
                    }
                    else {
                        reject("did not find default gateway in arp table");
                    }
                });
            }
            else {
                reject("Could not get results of ipconfig");
            }
            //console.log(gatewayIp);  
            //console.log( `child process exited with code ${code}` );
        });
    });
}
exports.getRouterMacAddress = _getRouterMacAddress;
//# sourceMappingURL=index.js.map