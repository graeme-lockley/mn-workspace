function extend(obj, interfaces) {
    // console.log(`>= ${obj.__proto__}`);
    for (let interfacesIdx in interfaces) {
        const interface = interfaces[interfacesIdx];

        // console.log(`>> ${interface.prototype}`);
        for (let name in interface.prototype) {
            // console.log(`>- ${name}: ${interface.prototype[name]}`);
            obj.prototype[name] = interface.prototype[name];
        }
    }
    // console.log(`>= ${obj.__proto__}`);
}


module.exports = {
    extend
};