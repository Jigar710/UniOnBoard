const express  = require('express');
const bigPromise = require('../middleware/bigPromise');
const BigPromise = require('../middleware/bigPromise');
const Merit = require('../models/meritModel');
const Institute = require('../models/instituteModel');

exports.calculateRank = BigPromise(async (req, res, next) =>{
    const {gujcetPR, sciencePR} = req.body

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
    })
});

exports.collegeRecommander = bigPromise(async(req, res, next) =>{
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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('city').equals(location).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('city').equals(location).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('city').equals(location).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().
                                                    where('course').equals(branch).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().limit(50).
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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('sc_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('st_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('sebc_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('ews_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData && collegeData.name === collegePreference){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().limit(50).
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
                                                    where('open_rank').gte(rank).limit(50).exec();

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
                                                    where('sc_rank').gte(rank).limit(50).exec();

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
                                                    where('st_rank').gte(rank).limit(50).exec();

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
                                                    where('sebc_rank').gte(rank).limit(50).exec();

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
                                                    where('ews_rank').gte(rank).limit(50).exec();

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
                                                    where('aiop_rank').gte(rank).limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).
                                                            where('fees').lte(maxFee).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().limit(50).
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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SC"){
                                const meritList = await Merit.find().
                                                    where('sc_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "ST"){
                                const meritList = await Merit.find().
                                                    where('st_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "SEBC"){
                                const meritList = await Merit.find().
                                                    where('sebc_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "EWS"){
                                const meritList = await Merit.find().
                                                    where('ews_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                            if(category == "AIOP"){
                                const meritList = await Merit.find().
                                                    where('aiop_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                            }
                        }else{
                            const meritList = await Merit.find().limit(50).exec();

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
                                                    where('open_rank').gte(rank).limit(50).exec();

                                for(let x of meritList){
                                    const collegeData = await Institute.findOne({_id:x.college_id}).exec();
                                    if(collegeData){
                                        recommandations.push(x);
                                    }
                                }
                        }else{
                            const meritList = await Merit.find().limit(50).exec();

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

    if(!recommandations){
        res.status(204).send({
            success: true,
            message:"No data found"
        })
    }else{
        res.status(200).send({
            success:true,
            result:recommandations
        })
    }
})