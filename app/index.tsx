import dayjs from "dayjs"
import { useKeepAwake } from "expo-keep-awake"
import * as ScreenOrientation from "expo-screen-orientation"
import { StatusBar } from "expo-status-bar"

import Feather from "@expo/vector-icons/Feather"
import { useLocales } from "expo-localization"
import { useEffect, useState } from "react"
import {
  PixelRatio,
  Text,
  View,
  useColorScheme,
  useWindowDimensions,
} from "react-native"

import "dayjs/locale/en"
import "dayjs/locale/pt-br"

const getResponsiveFontSize = (width: number, height: number, size: number) => {
  return (size * (width / height)) / PixelRatio.getFontScale()
}

const Home = () => {
  useKeepAwake()
  const [time, setTime] = useState(new Date())
  const [orientation, setOrientation] =
    useState<ScreenOrientation.OrientationLock | null>(null)
  const colorScheme = useColorScheme()
  const [isDark, setIsDark] = useState(colorScheme === "dark")
  const [{ languageTag }] = useLocales()
  const { width, height } = useWindowDimensions()
  const getFontSize = (size: number) =>
    orientation === ScreenOrientation.OrientationLock.LANDSCAPE
      ? getResponsiveFontSize(height, width, size)
      : getResponsiveFontSize(width, height, size)

  useEffect(() => {
    if (!languageTag) return
    dayjs.locale(languageTag)
  }, [languageTag])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const sub = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationLock)
    })

    return () => {
      ScreenOrientation.removeOrientationChangeListener(sub)
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isDark ? "black" : "white",
      }}
    >
      <StatusBar hidden />
      <Text
        style={{
          color: isDark ? "white" : "black",
          fontSize:
            orientation === ScreenOrientation.OrientationLock.LANDSCAPE
              ? getFontSize(240)
              : getFontSize(120),
        }}
      >
        {time.toLocaleTimeString()}
      </Text>
      <View>
        <Text
          style={{
            color: isDark ? "white" : "black",
            textTransform: "capitalize",
            fontSize: getFontSize(32),
          }}
        >
          {dayjs(time).format("dddd")} {time.toLocaleDateString()}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 16,
          gap: 8,
        }}
      >
        <Feather.Button
          iconStyle={{
            left: 5,
          }}
          name={isDark ? "sun" : "moon"}
          onPress={() => setIsDark((prev) => !prev)}
        />
        <Feather.Button
          iconStyle={{
            left: 5,
          }}
          name={
            orientation === ScreenOrientation.OrientationLock.LANDSCAPE
              ? "rotate-cw"
              : "rotate-ccw"
          }
          onPress={async () => {
            if (orientation === ScreenOrientation.OrientationLock.LANDSCAPE) {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
              )
            } else {
              await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE
              )
            }
          }}
        />
      </View>
    </View>
  )
}

export default Home
