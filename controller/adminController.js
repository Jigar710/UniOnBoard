const BigPromise = require("../middleware/bigPromise");

const Feacture = require("../models/featureTable");
const Institute = require("../models/instituteModel");



exports.getInstHome = BigPromise(async (req, res, next) => {

    const instituteID = [];

    const institute = await Feacture.find({ contentType: "institute" });

    for (var x in institute) {
        console.log(institute[x].idInst)


        const inst = await Institute.findById(institute[x].idInst)

        instituteID[x] = inst;

    }

    res.send(instituteID)



});
