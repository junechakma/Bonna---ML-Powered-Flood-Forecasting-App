import { StyleSheet, Text, View } from 'react-native'
import { Slot, Stack } from 'expo-router'
import "../global.css"

const RootLayout = () => {
    return (
        <Stack>
            <Stack.Screen name='index' options={{headerShown:false}}/>
        </Stack>
    )
}

export default RootLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

})