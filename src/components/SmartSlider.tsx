import React from "react";
import { Platform } from "react-native";
import Slider, { SliderProps } from "@react-native-community/slider";

type Props = SliderProps & {
  /** Optional web-only inline style for the <input> element */
  webStyle?: React.CSSProperties;
};

export default function SmartSlider(props: Props) {
  // Native (iOS/Android): use the real RN slider
  if (Platform.OS !== "web") {
    return <Slider {...props} />;
  }

  // Web: use a native HTML range input to avoid findDOMNode crashes on React 19
  const {
    value = 0,
    minimumValue = 0,
    maximumValue = 1,
    step,
    disabled,
    onValueChange,
    webStyle,
  } = props;

  const numericValue = typeof value === "number" ? value : Number(value) || 0;

  return (
    <input
      type="range"
      value={numericValue}
      min={minimumValue}
      max={maximumValue}
      step={step ?? 1}
      disabled={disabled}
      onChange={(e) => onValueChange?.(Number(e.target.value))}
      style={{ width: "100%", ...webStyle }}
    />
  );
}
