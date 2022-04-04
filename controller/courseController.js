const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer')
const cloudinary = require("cloudinary").v2;

const Section = require('../models/sectionModel');
const Course = require('../models/courseModel');
const LandingPageData = require('../models/landingPageModel');
const User = require('../models/userModel')
const BigPromise = require('../middleware/bigPromise');


exports.addCourseBasic = BigPromise(async (req,res,next) => {
    const { CourseTitle,CourseLearning,CoursePrerequisite,CourseAudience,LectureCaption,AuthorId} = req.body;

    if(!CourseTitle){
        return res.status(400).send({
            success:false,
            message:"Course Title is required please make sure it's not empty"
        })
    }

    if(!CourseLearning){
        return res.status(400).send({
            success:false,
            message:"Course Learning is required please make sure it's not empty"
        })
    }

    if(!CourseAudience){
        return res.status(400).send({
            success:false,
            message:"Target audience for the course is required please make sure it's not empty"
        })
    }

    if(!AuthorId){
        return res.status(400).send({
            success:false,
            message:"Author Id is require please add"
        })
    }

    const authorExist = await User.findById({_id:AuthorId});
    if(!authorExist){
        return res.status(400).send({
            success:false,
            message:"No such user exist with this id please enter valid id"
        })
    }
    

    const result = await Course.create({
        CourseTitle:CourseTitle,
        CourseLearning: CourseLearning,
        CoursePrerequisite:CoursePrerequisite,
        CourseAudience:CourseAudience,
        LectureCaption:LectureCaption,
        AuthorId:AuthorId
    })

    res.status(201).send({
        success:true,
        result
    })
});

exports.addSectionContent = BigPromise (async (req, res, next)=>{
    
    const {CourseId,SectionNo,SectionName, ContentType, VideoName, LectureDesc} = req.body;
    const LectureVideo = req.files.LectureVideo;
    const LectureResourceFile = req.files.LectureResourceFile;

    
    if(!CourseId){
        return res.status(400).send({
            success:false,
            message:"Please provide Section origin"
        })
    }
    
    const course = await Course.findById({_id:CourseId})

    if(!course){
        res.status(400).send({
            success:false,
            message:"No such course is available"
        })
    }
    

    if(!SectionNo){
        return res.status(400).send({
            success:false,
            message:"Please provide section number"
        })
    }

    if(!SectionName){
        return res.status(400).send({
            success:false,
            message:"Please give name to the section"
        })
    }
    if(!ContentType){
        return res.status(400).send({
            success:false,
            message:"content type is missing"
        })
    }
    if(!VideoName){
        return res.status(400).send({
            success:false,
            message:"Provide name to the Lecture video inside section"
        })
    }

    if(!LectureDesc){
        return res.status(400).send({
            success:false,
            message:"Please provide description of lecture"
        })
    }
    
    if(!LectureVideo){
        return res.status(400).send({
            success:false,
            message:"Please provide some content for lecture"
        })
    }

    const resultVideo = await cloudinary.uploader.upload(LectureVideo.tempFilePath,{
            resource_type: "video",
            folder:"videos"
        }
    );
    
    var resultResource = undefined;

    if(LectureResourceFile){
        
        resultResource = await cloudinary.uploader.upload(LectureResourceFile.tempFilePath,{
            folder:"resources",
            resource_type:"raw",

        })

    }

    var result = undefined;
    var courseData = undefined;

    const existingSection = await Section.findOne({CourseId:CourseId, SectionNo:SectionNo});

    if(existingSection){
        result = await Section.findByIdAndUpdate({_id:existingSection._id},{$set:
            {
                CourseId:CourseId,
                SectionNo:SectionNo,
                SectionName:SectionName,
                ContentType:ContentType,
                VideoName:VideoName,
                LectureDesc:LectureDesc,
                LectureVideo:{
                    id:resultVideo.public_id,
                    secure_url:resultVideo.secure_url
                },
                LectureResourceFile:{
                    id:resultResource.public_id,
                    secure_url:resultResource.secure_url
                }
            }
        }).exec();
    }else{  
        result = await Section.create({
            CourseId:CourseId,
            SectionNo:SectionNo,
            SectionName:SectionName,
            ContentType:ContentType,
            VideoName:VideoName,
            LectureDesc:LectureDesc,
            LectureVideo:{
                id:resultVideo.public_id,
                secure_url:resultVideo.secure_url
            },
            LectureResourceFile:{
                id:resultResource.public_id,
                secure_url:resultResource.secure_url
            }
        }) 
        courseData = await Course.update({CourseId:CourseId},{$push:{Section:result._id}}).exec();
    }

    res.status(201).send({
        success:true,
        result,
        courseData
    })

})

exports.addLandingPage = BigPromise(async (req,res,next)=>{
    const {CourseId, 
        CourseTitle,
        CourseSubTitle,
        CourseDesc,
        CourseLanguage,
        DifficultyLevel,
        CourseCategory,
        CourseLearing,
        Pricing,
        CouponCode,
        WelcomeMessage,
        CongoMessage,
        Mode} = req.body;

    const CourseImg = req.files.CourseImg;
    const CoursePromo = req.files.CoursePromo;

    if(!CourseId){
        return res.status(400).send({
            success:false,
            message:"Please provide Section origin"
        })
    }

    const course = await Course.findById({_id:CourseId})

    if(!course){
        res.status(400).send({
            success:false,
            message:"No such course is available"
        })
    }
    if(!CourseTitle){
        return res.status(400).send({
            success:false,
            message:"Please provide Course Title"
        })
    }

    if(!CourseDesc){
        return res.status(400).send({
            success:false,
            message:"Please write something about course"
        })
    }

    if(!CourseLanguage){
        return res.status(400).send({
            success:false,
            message:"Please provide course language"
        })
    }

    if(!DifficultyLevel){
        return res.status(400).send({
            success:false,
            message:"Please select defficulty level of course"
        })
    }

    if(!CourseCategory){
        return res.status(400).send({
            success:false,
            message:"Please select course category"
        })
    }

    if(!CourseLearing){
        return res.status(400).send({
            success:false,
            message:"Please provide details about course learning"
        })
    }

    if(!CourseImg){
        return res.status(400).send({
            success:false,
            message:"Please provide image for your course"
        })
    }

    const resultImg = await cloudinary.uploader.upload(CourseImg.tempFilePath,{
        folder:"courseimgs"
    });

    var resultPromo = undefined;
    if(CoursePromo){
        resultPromo = await cloudinary.uploader.upload(CoursePromo.tempFilePath,{
            resource_type: "video",
            folder:"promos"
        });
    }


    if(!Pricing){
        return res.status(400).send({
            success:false,
            message:"Please choose price for your course"
        })
    }

    if(!WelcomeMessage){
        return res.status(400).send({
            success:false,
            message:"Please wite welcome message for your user"
        })
    }
    
    if(!CongoMessage){
        return res.status(400).send({
            success:false,
            message:"Please write congretulations message for your user"
        })
    }

    if(!Mode){
        return res.status(400).send({
            success:false,
            message:"Please choose mode of course"
        })
    }

    var result =undefined;
    
    const existingPage = await LandingPageData.findOne({CourseId:CourseId});

    if(existingPage){
        result= await LandingPageData.findByIdAndUpdate({_id:existingPage._id},{$set:
            {
                CourseId:CourseId, 
                CourseTitle:CourseTitle,
                CourseSubTitle:CourseSubTitle,
                CourseDesc:CourseDesc,
                CourseLanguage:CourseLanguage,
                DifficultyLevel:DifficultyLevel,
                CourseCategory:CourseCategory,
                CourseLearing:CourseLearing,
                CourseImg:{
                    id:resultImg.public_id,
                    secure_url:resultImg.secure_url
                },
                CoursePromo:{
                    id:resultPromo.public_id,
                    secure_url:resultPromo.secure_url
                },
                Pricing:Pricing,
                CouponCode:CouponCode,
                WelcomeMessage:WelcomeMessage,
                CongoMessage:CongoMessage,
                Mode:Mode
            }
        }).exec();
    }else{
        result = await LandingPageData.create({
            CourseId:CourseId, 
            CourseTitle:CourseTitle,
            CourseSubTitle:CourseSubTitle,
            CourseDesc:CourseDesc,
            CourseLanguage:CourseLanguage,
            DifficultyLevel:DifficultyLevel,
            CourseCategory:CourseCategory,
            CourseLearing:CourseLearing,
            CourseImg:{
                id:resultImg.public_id,
                secure_url:resultImg.secure_url
            },
            CoursePromo:{
                id:resultPromo.public_id,
                secure_url:resultPromo.secure_url
            },
            Pricing:Pricing,
            CouponCode:CouponCode,
            WelcomeMessage:WelcomeMessage,
            CongoMessage:CongoMessage,
            Mode:Mode
        });
    }

    res.status(201).send({
        success:true,
        result
    });


})