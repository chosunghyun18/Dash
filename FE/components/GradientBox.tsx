import { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, LayoutChangeEvent } from 'react-native';
import { useState } from 'react';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme';

interface Props {
  /** 135deg 그라디언트 색상 [시작, 끝] */
  colorsRange?: [string, string];
  /** true면 세로(위→아래) 그라디언트 */
  vertical?: boolean;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

/**
 * expo-linear-gradient 없이 react-native-svg로 135° 선형 그라디언트 배경을 그린다.
 * Dash+ 보라 그라디언트(plusGradient) 기본값.
 */
export function GradientBox({
  colorsRange = [colors.plus.gradientStart, colors.plus.gradientEnd],
  vertical = false,
  borderRadius = 0,
  style,
  children,
}: Props) {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  return (
    <View style={[{ borderRadius, overflow: 'hidden' }, style]} onLayout={onLayout}>
      {size.w > 0 && (
        <Svg style={StyleSheet.absoluteFill} width={size.w} height={size.h}>
          <Defs>
            {/* 대각선(135°) 또는 세로 그라디언트 */}
            <LinearGradient id="dashPlusGrad" x1="0" y1="0" x2={vertical ? '0' : '1'} y2="1">
              <Stop offset="0" stopColor={colorsRange[0]} />
              <Stop offset="1" stopColor={colorsRange[1]} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={size.w} height={size.h} fill="url(#dashPlusGrad)" />
        </Svg>
      )}
      {children}
    </View>
  );
}
