const uuid = require('uuid')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')

let DUMMY_PLACES = [
    {
        id: 'p1',
        description: 'One of the most famous sky scraper in the world', 
        title: 'Empire State Buiulding',
        imageUrl: `https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/crm/newyorkstate/GettyImages-486334510_CC36FC20-0DCE-7408-77C72CD93ED4A476-cc36f9e70fc9b45_cc36fc73-07dd-b6b3-09b619cd4694393e.jpg`,
        address: '20 W 34th St., New York, NY 10001',
        location: {
            lat: 40.748817,
            lng: -73.985428
        },
        creator: 'u1'
    }, 
]


const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid  // { pid: 'p1'}
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if(!place){
    throw new HttpError('Could not find a place for the provided id', 404)
    }

    res.json({ place })
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId
    });

    if(!places || places.length === 0){
            return next(
                new HttpError('Could not find places for the provided user id', 404)
            ) 
    }

    res.json({ places })
}

const createPlace = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }

    const {title, description, coordinates, address, creator} = req.body
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };
    DUMMY_PLACES.push(createdPlace)

    res.status(201).json({ place: createdPlace })
}

const updatePlace = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }

    
    const {title, description } = req.body
    const placeId = req.params.pid
    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)}

    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY_PLACES[placeIndex] = updatedPlace
    
    res.status(200).json({ place: updatedPlace })
}

const deletePlace = () => {
    const placeId = req.params.pid;

    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Could not find a place for that id')
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    res.status(200).json({ message: 'Deleted place'})
}



exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;