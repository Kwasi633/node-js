const uuid = require('uuid')
const HttpError = require('../models/http-error')
const { validationResult } = require('express-validator')
const Place = require('../models/place')

const getCoordsForAddress = require('../util/location')

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


const getPlaceById =  async(req, res, next) => {
    const placeId = req.params.pid  // { pid: 'p1'}

    let place
    try{
        place = await Place.findById(placeId);
    }catch(err){
        const error = new HttpError('Somoething went wrong, could not find place', 500)
        
        return next(error)
    }
    

    if(!place){
    const error = HttpError('Could not find a place for the provided id', 404)
    
    return next(error)
}

    res.json({ place: place.toObject({ getters: true}) })
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let places
    try {
    places = await Place.find({ creator: userId })
    }
    catch(err){
        const error = new HttpError('Fetching places failed, try again', 500)
        return next(error)
    }

    if(!places || places.length === 0){
            return next(
                new HttpError('Could not find places for the provided user id', 404)
            ) 
    }

    res.json({ places: places.map(place => place.toObject({ getters: true})) })
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs passed, please check your data', 422))
    }

    const {title, description, address, creator} = req.body;
    
    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address)

    }catch(error){
        return next(error)
    }
    
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: `https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/crm/newyorkstate/GettyImages-486334510_CC36FC20-0DCE-7408-77C72CD93ED4A476-cc36f9e70fc9b45_cc36fc73-07dd-b6b3-09b619cd4694393e.jpg`, 
        creator
    })
    
    try{
        await createdPlace.save()
    } catch(err) {
        const error = new HttpError('Creating place failed please try again', 500)
    
    return next(error)
}
    res.status(201).json({ place: createdPlace })

}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next ( new HttpError('Invalid inputs passed, please check your data', 422)
    )}

    
    const {title, description } = req.body
    const placeId = req.params.pid

    let place
    try {
        const place = await Place.findById(placeId)
    }catch(err){
            const error = new HttpError('Something went wrong, could not update place', 500)
        
        return next(error)
    }
    place.title = title;
    place.description = description;

    try {
        await place.save()
    }catch(err){
        const error = new HttpError('Something went wrong, could not update place')
        return(error)
    }
    
    res.status(200).json({ place: place.toObject({ getters: true}) })
}

const deletePlace = async() => {
    const placeId = req.params.pid;

    let place
    try {
        place = await Place.findById(placeId)
    }
    catch(err){
        const error = new HttpError('Could not find a place for that id', 500)
    
        return next(error)}
    
   
    try{
        await place.remove();
    }
    catch(err){
        const error = new HttpError('Could not find a place for that id', 500)
    
        return next(error)
    }
    
    
    res.status(200).json({ message: 'Deleted place'})
}



exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;