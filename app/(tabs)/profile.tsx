import { View, Text } from "react-native"
import { Link } from "expo-router"

export default function Profilepage(){
    return(
        <View>
            <Text>Profile Page</Text>
            <Link href="/">
                Go to Root
            </Link>
        </View>
    )
}