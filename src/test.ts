import { getRouterMacAddress } from './index';

getRouterMacAddress().then(
    (arg)=>{
        console.log("getRouterMacAddress returned: " + arg);
    }
).catch((err)=>{
    console.log("getRouterMacAddress returned error: " + JSON.stringify(err));
})
