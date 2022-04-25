const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer')
const cloudinary = require("cloudinary").v2;
const { timeStamp } = require('console');
const Razorpay = require('razorpay');

const app = require('../app');
const Section = require('../models/sectionModel');
const Course = require('../models/courseModel');
const LandingPageData = require('../models/landingPageModel');
const User = require('../models/userModel')
const BigPromise = require('../middleware/bigPromise');
const Purchase = require('../models/paymentModel');


const razorpayInstance = new Razorpay({

	// Replace with your key_id
	key_id: "rzp_test_HEniExhSJlPvuS",

	// Replace with your key_secret
	key_secret: "ktcNlnZRO7V9SDffENfrC859"
});

exports.addCourseBasic = BigPromise(async (req,res,next) => {
    const { CourseTitle,CourseLearning,CoursePrerequisite,CourseAudience,LectureCaption} = req.body;

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

    console.log(req.user)
    if(!req.user.id){
        return res.status(400).send({
            success:false,
            message:"Author Id is require please add"
        })
    }

    const result = await Course.create({
        CourseTitle:CourseTitle,
        CourseLearning: CourseLearning,
        CoursePrerequisite:CoursePrerequisite,
        CourseAudience:CourseAudience,
        LectureCaption:LectureCaption,
        AuthorId:req.user.id
    })

    res.status(201).send({
        success:true,
        result
    })
});

exports.addSectionContent = BigPromise (async (req, res, next)=>{
    
    const {CourseId,SectionNo,SectionName, LectureNo, ContentType, VideoName, LectureDesc} = req.body;
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
    if(!LectureNo){
        return res.status(400).send({
            success:false,
            message:"Please provide lecture number"
        })
    }

    if(!ContentType){
        return res.status(400).send({
            success:false,
            message:"Content type is missing"
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
    
    var resultResource = {
        id:"",
        secure_url:""
    };

    if(LectureResourceFile){
        
        resultResource = await cloudinary.uploader.upload(LectureResourceFile.tempFilePath,{
            folder:"resources",
            resource_type:"raw",

        })

    }

    var result = undefined;
    var courseData = undefined;

    const existingSection = await Section.findOne({CourseId:CourseId, SectionNo:SectionNo, LectureNo:LectureNo});

    if(existingSection){
        result = await Section.findByIdAndUpdate({_id:existingSection._id},{$set:
            {
                CourseId:CourseId,
                SectionNo:SectionNo,
                SectionName:SectionName,
                LectureNo:LectureNo,
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
            LectureNo:LectureNo,
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
        await Course.where({'_id':CourseId}).updateOne({$push:{Section:result._id}}).exec();
    }

    res.status(201).send({
        success:true,
        result
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

    var resultPromo = {
        id:"",
        secure_url:""
    };
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
        result = await LandingPageData.findByIdAndUpdate({_id:existingPage._id},{$set:
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

exports.getAllCourses = BigPromise(async (req, res, next) =>{

    const result = await Course.find();
    const resultMore = await LandingPageData.find();

    const allCourse = []
    for(let x in result){
        for (let y in resultMore){
            if(result[x]._id == resultMore[y].CourseId){
                const authorData = await User.find({_id:result[x].AuthorId})
                const temp_data = {dataOne:result[x],dataTwo:resultMore[y],dataThree:authorData[0]}
                allCourse.push(temp_data)
            }
        }
    }

    res.status(200).send({
        success:true,
        allCourse
    })
})

exports.findAllSections = BigPromise(async(req,res,next)=>{

    const {id} = req.params; 
    const result = await Course.findOne({_id:id});
    const dataAll = []
    var resultData = [];

    for(let i=0; i<result.Section.length;i++){
        const temp = await Section.findOne({_id:result.Section[i]});
        if(temp !== null){
            resultData.push(temp)
        }
        
    }
    
    var secNo = 1;
    var lecNo = 1;
    cnt=0
    var secData = []
    var lecData = []
    var templec = []
    for(let i=0;i<resultData.length;i++){
        if(cnt === resultData.length && dataAll.length === resultData.length){
            break
        }
        for(let k=0;k<resultData.length;k++){
            if(cnt === resultData.length && dataAll.length === resultData.length){
                break
            }
            if(resultData[k] === undefined){
                continue
            }
            if(resultData[k].SectionNo === secNo ){
                if(secData.length !== secNo){
                    secData.push(resultData[k].SectionName)
                }
                if(resultData[k].LectureNo == lecNo){
                    dataAll.push(resultData[k])
                    templec.push(resultData[k].VideoName)
                    lecNo+=1
                    cnt+=1
                }
            }
        }
        lecData.push(templec)
        templec = []
        secNo+=1
        lecNo=1
    }

    res.status(200).send({
        success:true,
        result,
        dataAll,
        secData,
        lecData
    })
})

exports.getAllLandingPageData = BigPromise(async(req, res, next) =>{
    const {id} = req.params;

    if(!id){
        res.status(400).send({
            success:false,
            message:"Please provide course Id"
        })
    }

    const courseData = await Course.findOne({_id:id});

    if(!courseData){
        res.status(400).send({
            success:false,
            message:"No such course available in our database"
        })
    }

    const landingPageData = await LandingPageData.findOne({CourseId:id});

    if(!landingPageData){
        res.status(400).send({
            message:false,
            message:"no landinbg page data found"
        })
    }

    const author = await User.findOne({_id:courseData.AuthorId});
    const sectionCount = courseData.Section.length

    if(!author){
        res.status(400).send({
            success:false,
            message:"User assosiated with this course is not exist"
        })
    }

    res.status(200).send({
        success:true,
        data:{
            landingPageData,
            author,
            courseData,
            sessionCount:sectionCount
        }
    })
})

exports.createOrder = BigPromise(async (req, res, next) => {

	// STEP 1:
	const { amount, currency, notes } = req.body;
    const receipt = req.user.id
    const author = await User.findOne({_id:req.user.id});

	// STEP 2:	
	razorpayInstance.orders.create({ amount, currency, receipt, notes },
		(err, order) => {

			//STEP 3 & 4:
			if (!err)
				res.status(200).json({
					success: true,
					order : order,
                    user:author
				})

			else
				res.status(400).json({
					success: true,
					error : err
				})
				
		}
	)
});

exports.addPurchageData = BigPromise(async (req, res, next) =>{
    const {id} = req.params;
    const {razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature} = req.body;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        res.status(400).send({
            success: false,
            message:"Payment data is not valiable"
        })
    }

    await Purchase.create({
        UserId:req.user.id,
        CourseId:id,
        razorpay_order_id: razorpay_order_id,
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature
    });

    res.status(201).send({
        success:true,
    })
})

exports.getPurchases = BigPromise(async (req, res, next) =>{
    const {id} = req.params;

    const purchase = await Purchase.find().where('UserId').equals(req.user.id).where('CourseId').equals(id).exec();

    console.log(purchase)
    if(purchase.length >0){
        res.status(201).send({
            success:true,
            purchase
        })
    }else{
        res.status(404).send({
            success:false
        })
    }
})

