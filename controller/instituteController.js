const Institute = require("../models/instituteModel");
const BigPromise = require("../middleware/bigPromise");
const WhereClause = require("../utils/whereClause");


exports.getAllInstitute = BigPromise(async (req, res, next) => {

    const resultPerPage = 10;
    const totalInstituteNumber = await Institute.countDocuments();

    const institutesObj = new WhereClause(Institute.find(), req.query).search().filter();

    let institutes = await institutesObj.base
    const filteredInstituteNumber = institutes.length

    // institutesObj.pager(resultPerPage)
    institutes = await institutesObj.base.clone()

    console.log(await institutes[0].branches);
    console.log("hello.....");
    console.log(await Object.keys(institutes[0].branches));

    res.status(200).json({
        success: true,
        totalInstituteNumber,
        filteredInstituteNumber,
        institutes,
    });
});

exports.getParticularInstitute = BigPromise(async (req, res, next) => {

    if(!req.params.id){
        return res.status(400).json({
            success: false,
            message: 'Please provide institute id.'
        });
    }

    const institute = await Institute.findById(req.params.id);

    if(!institute){
        return res.status(400).json({
            success: false,
            message: 'Institute with given id does not exists.'
        });
    }

    console.log(await institute.branches['AUTOMOBILE ENGINEERING']);
    const branchList = await Object.keys(institute.branches);

    res.status(200).json({
        success: true,
        institute,
        branchList
    });
});

