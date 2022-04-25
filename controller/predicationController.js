const express  = require('express');
const bigPromise = require('../middleware/bigPromise');
const BigPromise = require('../middleware/bigPromise');
const Merit = require('../models/meritModel');
const Institute = require('../models/instituteModel');
const Placement = require('../models/placementModel');

exports.calculateRank = BigPromise(async (req, res, next) =>{
    const {gujcetPR, sciencePR} = req.body
    console.log(gujcetPR, sciencePR);
    if(gujcetPR < 0 || gujcetPR > 100 ){
        res.status(400).send({
            success: false,
            message: "Plaese enter valid GUJCET Percentile Rank"
        })
    }

    if(sciencePR < 0 || sciencePR > 100){
        res.status(400).send({
            success: false,
            message: "Plaese enter valid Science Percentile Rank"
        })
    }
    
    const gujcetPortion = gujcetPR * 0.5;
    const sciencePortion = sciencePR * 0.5;

    const totalStudents = 41293;
    const totalPortion = gujcetPortion + sciencePortion;
    
    const positionInPercent = 100 - totalPortion;
    const rank = Math.round(totalStudents * positionInPercent / 100) 

    res.status(200).send({
        success: true,
        rank:rank
    });
});

exports.getBranchList = BigPromise(async (req, res, next)=>{
    const meritsData = await Merit.find();

    if(!meritsData){
        res.status(400).send({
            success: false,
            message: "No data in merit list"
        })
    }

    var branchList = [] 
    for(let i in meritsData){
        if(!branchList.includes(meritsData[i].course)){
            branchList.push(meritsData[i].course)
        }
    }

    res.status(200).send({
        success: true,
        branches:branchList
    })

})

exports.getCityList = BigPromise(async (req, res, next)=>{
    const meritsData = await Merit.find();

    if(!meritsData){
        res.status(400).send({
            success: false,
            message: "No data in merit list"
        })
    }

    var cityList = [] 

    for(let i in meritsData){
        if(!cityList.includes(meritsData[i].city)){
            cityList.push(meritsData[i].city)
        }
    }

    res.status(200).send({
        success: true,
        cities:cityList
    })

})

exports.getCollegeList = BigPromise(async (req, res, next)=>{
    const meritsData = await Merit.find();

    if(!meritsData){
        res.status(400).send({
            success: false,
            message: "No data in merit list"
        })
    }

    var collegeNameList = [] 
    const collegeData = await Institute.find();

    for(let i of meritsData){
        for (let j of collegeData){
            if(i.college_id == j._id){
                if(!collegeNameList.includes(j.name)){
                    collegeNameList.push(j.name)
                }
            }
        }
    }

    res.status(200).send({
        success: true,
        colleges:collegeNameList
    })

})

exports.collegeRecommander = BigPromise(async(req, res, next) =>{
    const {rank, location, category, branch, collegePreference, maxFee} = req.body;

    var recommandations = [];
    if(location){
        if(branch){
            if(collegePreference){
                if(maxFee){
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }else{
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }
            }else{
                if(maxFee){
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData ){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }else{
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }
            }
        }else{
            if(collegePreference){
                if(maxFee){
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }else{
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }
            }else{
                if(maxFee){
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }else{
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }
            }
        }
    }else{
        if(branch){
            if(collegePreference){
                if(maxFee){
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }else{
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }
            }else{
                if(maxFee){
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }else{
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }
            }
        }else{
            if(collegePreference){
                if(maxFee){
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().limit(10).
                                                    exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }else{
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().limit(10).
                                                    exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }
            }else{
                if(maxFee){
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().limit(10).
                                                    exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }else{
                    if(category){
                        if(rank){
                            if(category == "OPEN"){
                                const meritList = await Merit.find().
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('sc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('st_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('sebc_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('ews_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('aiop_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }else{
                        if(rank){
                            const meritList = await Merit.find().
                                                    where('open_rank').gte(rank).limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().limit(10).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }
                    }
                }
            }
        }
    }
    
    var coachingData = []

    for(let i in recommandations){
        const coaching = await Institute.findOne({_id:recommandations[i].college_id})
        if(coaching){
            coachingData.push({
                CollegeName:coaching.name,
                CollegeImg:coaching.images[0].secure_url,
                CollegeLogo:coaching.logo[0].secure_url,
                CollegeLocation:recommandations[i].city,
                RecommandedBranch:recommandations[i].course,
                CollegeFee:coaching.fees,
                CollegeWebsite:coaching.website,
                CollegeContact:coaching.contactNo,
                ApprovedBy:coaching.approvedBy,
                AcceptedExams:coaching.acceptedExam
            })
        }
    }

    if(!recommandations){
        res.status(204).send({
            success: true,
            message:"No data found"
        })
    }else{
        res.status(200).send({
            success:true,
            result:coachingData
        })
    }
})

exports.dataForComparison = BigPromise(async (req, res, next) =>{
    const {id} = req.params;

    if(!id){
        res.status(400).send({
            success: false,
            message:"No id is found"
        })
    }

    const instituteData = await Institute.findOne({_id:id});
    const plcData = await Placement.findOne({college_id:instituteData._id})

    if(!instituteData || !plcData){
        res.status(400).send({
            success: false,
            message:"no data found"
        })
    }

    res.status(200).send({
        success:true,
        result:{
            collegeImg:instituteData.images[0],
            collegeLogo:instituteData.logo[0],
            collegeName:instituteData.name,
            city:plcData.city,
            fees:instituteData.fees,
            approvedBy:instituteData.approvedBy,
            acceptedExam:instituteData.acceptedExam,
            branches:instituteData.branches,
            website:instituteData.website,
            plcRate:plcData.plcRate,
            maxPkg:plcData.maxPkg,
            minPkg:plcData.minPkg,
            avgPkg:plcData.avgPkg,
            majorRec:plcData.majorComp,
            lastYearHired:plcData.lastYearNoOFStudents
        }
    })
})