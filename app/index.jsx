import { Link } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme'

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import { debounce } from 'lodash';
import { fetchLocation } from '../api/weather'
import { fetchWeatherForecast } from '../api/weather'
import { getData, storeData } from '../utils/asyncStorange';
import * as GPSLocation from 'expo-location'

export default function App() {

    const [toggleSearch, setToggleSearch] = useState(false)
    const [locations, setLocations] = useState([])
    const [weather, setWeather] = useState({})
    const [loading, setLoading] = useState(true)
    const [cordinates, setCordinates] = useState([])

    const handleLocation = (location) => {
        console.log('loc', location)
        setLocations([])
        setToggleSearch(false)
        setLoading(true)
        fetchWeatherForecast({
            city: location.name,
            days: '7'
        }).then(data => {
            setWeather(data)
            setLoading(false)
            storeData('city', location.name)
            console.log('data', data)
        })
    }

    const handleSearch = (value) => {
        console.log("Searching for:", value); // Check if value updates correctly
        if (value.length > 2) {
            fetchLocation({ city: value }).then(data => {
                setLocations(data)
                console.log('data', data)
            }).catch(error => {
                console.error("Failed to fetch location:", error);
            });
        }
    };

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [handleSearch]);
    const { current, location } = weather

    useEffect(() => {
        fetchMyWeatherData();
        getGPSPermissions()
    }, [])

    const getGPSPermissions = async () => {
        const { status } = await GPSLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return false;
        }

        let currentLocation = await GPSLocation.getCurrentPositionAsync()
        const { coords: { latitude, longitude } } = currentLocation
        setCordinates({ latitude, longitude })
    }

    const fetchMyWeatherData = async () => {
        let cityName = await getData('city');
        if (!cityName) {
            cityName = 'Dhaka'; 
        }

        const weatherData = await fetchWeatherForecast({
            city: cityName,
            days: '7'
        });

        fetchWeatherForecast({
            city: cityName,
            days: '7'
        }).then(data => {
            setWeather(data)
            setLoading(false)
        })
    }

    return (
        <View className=" flex-1 relate items-center justify-center flex-grow ">
            <StatusBar style="light" />
            <Image
                source={require('../assets/images/bg.png')}
                blurRadius={70}
                className="absolute h-full w-full"
            />

            {
                loading ? (
                    <ActivityIndicator size="large" />
                ) : (

                    <SafeAreaView className="flex flex-1">
                        <View className="w-[90vw]  mx-4 relative z-50">
                            <View className="flex-row justify-between items-center rounded-full "
                                style={{ backgroundColor: toggleSearch ? theme.bgWhite(0.2) : 'transparent' }}
                            >
                                {
                                    toggleSearch && (
                                        <TextInput
                                            onChangeText={handleTextDebounce}
                                            placeholder='Search City'
                                            placeholderTextColor={'lightgray'}
                                            className="pl-6 h-14 text-base text-white w-[70vw]"
                                        />
                                    )
                                }
                                <TouchableOpacity
                                    onPress={() => setToggleSearch(!toggleSearch)}
                                    style={{ backgroundColor: theme.bgWhite(0.3), borderRadius: 150, padding: 10, margin: 4 }}
                                >
                                    <AntDesign name="search1" size={18} color="white" />
                                </TouchableOpacity>
                            </View>
                            {
                                locations.length > 0 && toggleSearch ? (
                                    <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                                        {
                                            locations.map((location, index) => {
                                                const borderBottomWidth = index + 1 === locations.length ? 0 : 1

                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        onPress={() => handleLocation(location)}
                                                        style={{ flexDirection: 'row', alignItems: "center", gap: 6, padding: 10, paddingLeft: 16, borderBottomWidth, borderColor: "gray" }}
                                                    >
                                                        <FontAwesome6 name="location-dot" size={18} color="black" />
                                                        <Text className="text-black text-lg">{location.name}, {location.country}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                ) : null
                            }
                        </View>

                        {/* Forcasting Section */}
                        <View className="mx-4 flex justify-around flex-1 mb-2">
                            <Text className="text-white text-center text-2xl font-bold ">
                                {location?.name},
                                {" "}
                                <Text className="text-lg font-semibold text-gray-300">
                                    {location?.country}
                                </Text>
                            </Text>

                            {/* Wather image */}
                            <View className="flex-row justify-center">
                                <Image source={require('../assets/images/partlycloudy.png')}
                                    className="w-52 h-52"
                                />
                            </View>

                            {/* Temp Now */}
                            <View className="space-y-2">
                                <Text className="text-center font-bold text-white text-6xl ml-5">
                                    {current?.temp_c}&#176;
                                </Text>
                                <Text className="text-center  text-white text-xl ml-5 tracking-wider">
                                    {current?.condition?.text}
                                </Text>
                            </View>

                            {/* Other Stats */}
                            <View className="flex-row justify-between mx-4 ">
                                <View className="flex-row gap-2 items-center ">
                                    <Image source={require('../assets/icons/wind.png')} className="h-8 w-8" />
                                    <Text className="text-white font-semibold text-base">
                                        {current?.wind_kph}Km
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center ">
                                    <Image source={require('../assets/icons/drop.png')} className="h-8 w-8" />
                                    <Text className="text-white font-semibold text-base">
                                        {current?.humidity}%
                                    </Text>
                                </View>
                                <View className="flex-row gap-2 items-center ">
                                    <Image source={require('../assets/icons/sun.png')} className="h-8 w-8" />
                                    <Text className="text-white font-semibold text-base">
                                        6:05 AM
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="mb-10 space-y-3 h-[20vh]" >
                            <View className="flex-row items-center mx-5 gap-4 pb-6">
                                <FontAwesome5 name="calendar-alt" size={24} color="white" />
                                <Text className="text-white text-base">Daily Forcast</Text>
                            </View>

                            <ScrollView
                                horizontal
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                                showsHorizontalScrollIndicator={false}
                            >
                                {
                                    weather?.forecast?.forecastday?.map((item, index) => {

                                        let date = new Date(item.date)
                                        let options = { weekday: 'long' }
                                        let dayName = date.toLocaleDateString('en-US', options)
                                        dayName = dayName.split(',')[0]

                                        return (
                                            <View
                                                key={index}
                                                className="flex justify-center items-center w-24 rounded-3xl space-y-5 mr-4"
                                                style={{ backgroundColor: theme.bgWhite(0.15) }}
                                            >
                                                <Image source={require('../assets/images/heavyrain.png')} className="h-11 w-11" />
                                                <Text className="text-white">{dayName}</Text>
                                                <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c} &#176;</Text>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>

                    </SafeAreaView>
                )
            }
            
        </View>
    );
}


