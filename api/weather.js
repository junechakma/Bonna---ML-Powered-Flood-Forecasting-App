import axios from "axios";

import { apiKey } from "../constants";

const forecastEndpoint = params =>`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.city}&days=${params.days}&aqi=no&alerts=no`
const locationEndPoint = params =>`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.city}`

const apiCall = async (endpoint)=>{
    const options ={
        method: "GET",
        url: endpoint
    }
    try{
        const response = await axios(options)
        return response.data
    }catch(err){
        console.log(err)
        return null
    }
}

export const fetchWeatherForecast = params =>{
    return apiCall(forecastEndpoint(params))
}
export const fetchLocation= params =>{
    return apiCall(locationEndPoint(params))
}