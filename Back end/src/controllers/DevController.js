const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../util/parseStringAsArray');

module.exports = {
    async index(req,resp) {
        const devs = await Dev.find();

        return resp.json(devs)
    },

    async store(req,resp) {
        const {github_username, techs,latitude,longitude} = req.body;

        let dev = await Dev.findOne({github_username});
        if(!dev){
            const response = await axios.get(`https://api.github.com/users/${github_username}`);

            const {name = login, avatar_url, bio} = response.data;

            const techsArr = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArr,
                location
            })
        }


        return resp.json(dev);
    },

    async update(req,resp) {
        const {github_username,name, techs, latitude, longitude, bio, avatar_url} = req.body;

        const dev = await Dev.findOne({github_username});

        if(dev){
            if(name && dev.name != name)
                dev = await Dev.updateOne({name});

            if(avatar_url && dev.avatar_url != avatar_url)
                dev = await Dev.updateOne({avatar_url});

            if(bio && dev.bio != bio)
                dev = await Dev.updateOne({bio});

            if(longitude || latitude){
                let location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }

                // dev = await Dev.updateOne({location:});
            }

            if(techs && techs.length){
                let techsArr = parseStringAsArray(techs);

                techsArr.map(tech => {
                    if(dev.techs.indexOf(tech)<0)
                        Dev.updateOne({
                            techs:{
                                $push:tech
                            }
                        })
                })

            }

        }else{
            return resp.status(400).json({error: "Dev doesn't find"})
        }

        return resp.json(dev);
    },

    async destroy(req,resp) {
        const {github_username, techs,latitude,longitude} = req.body;

        let dev = await Dev.findOne({github_username});
        if(!dev){
            const response = await axios.get(`https://api.github.com/users/${github_username}`);

            const {name = login, avatar_url, bio} = response.data;

            const techsArr = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArr,
                location
            })
        }


        return resp.json({dev});
    }
}