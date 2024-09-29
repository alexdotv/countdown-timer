import React, { useState, useEffect, useRef } from "react";
import { View, Text, StatusBar, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";
import tw from "twrnc";
import TimePicker from "./component/TimePicker";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("0");
  const [seconds, setSeconds] = useState("0");
  const [initialTime, setInitialTime] = useState(0);
  const timerRef = useRef(null);
  const endTimeRef = useRef(null);

  useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      handleStop();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleStart = () => {
    const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setInitialTime(totalSeconds);
      setIsRunning(true);
      endTimeRef.current = Date.now() + totalSeconds * 1000;
      startTimer();
    }
  };

  const startTimer = () => {
    timerRef.current = setTimeout(() => {
      const remaining = Math.round((endTimeRef.current - Date.now()) / 1000);
      setTimeLeft(remaining >= 0 ? remaining : 0);
      if (remaining > 0) {
        startTimer();
      }
    }, 1000);
  };

  const handleStop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setTimeLeft(0);
    setInitialTime(0);
    setHours("0");
    setMinutes("0");
    setSeconds("0");
  };

  const circleCircumference = 2 * Math.PI * 120;
  const strokeDashoffset = isRunning ? circleCircumference - (circleCircumference * timeLeft) / initialTime : circleCircumference;

  const displayTime = (value) => (value < 10 ? `0${value}` : value);

  return (
    <View style={tw`flex-1 justify-center items-center bg-red-400`}>
      <Text style={tw`text-4xl text-white mb-5`}>Countdown Timer</Text>
      {isRunning ? (
        <View style={tw`items-center justify-center`}>
          <View style={tw`relative mb-10`}>
            <Svg height="250" width="250" viewBox="0 0 250 250">
              <Circle
                cx="125"
                cy="125"
                r="120"
                stroke="white"
                strokeWidth="5"
                fill="transparent"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
              />
            </Svg>
            <View style={[tw`absolute inset-0 justify-center items-center`]}>
              <Text style={tw`text-5xl font-bold text-white`}>
                {`${displayTime(Math.floor(timeLeft / 3600))}:${displayTime(Math.floor((timeLeft % 3600) / 60))}:${displayTime(timeLeft % 60)}`}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={tw`flex-row items-center justify-center`}>
          <TimePicker data={Array.from({ length: 24 }, (_, i) => i.toString())} selectedItem={hours} onItemSelected={setHours} />
          <TimePicker data={Array.from({ length: 60 }, (_, i) => i.toString())} selectedItem={minutes} onItemSelected={setMinutes} />
          <TimePicker data={Array.from({ length: 60 }, (_, i) => i.toString())} selectedItem={seconds} onItemSelected={setSeconds} />
        </View>
      )}
      <View style={tw`mt-10`}>
        {isRunning ? (
          <TouchableOpacity onPress={handleStop} style={tw`bg-red-700 p-4 rounded-full w-20 h-20 items-center justify-center`}>
            <FontAwesome name="pause" size={40} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleStart}
            style={tw`bg-green-500 p-4 rounded-full w-20 h-20 items-center justify-center`}
            disabled={parseInt(hours) === 0 && parseInt(minutes) === 0 && parseInt(seconds) === 0}
          >
            <FontAwesome name="play" size={40} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <StatusBar barStyle="light-content" />
    </View>
  );
};

export default App;
