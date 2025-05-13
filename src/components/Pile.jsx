import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useMemo, useRef} from 'react';
import {useSelector} from 'react-redux';
import {
  selectCellSelection,
  selectDiceNo,
  selectPocketPileSelection,
} from '../redux/reducers/gameSelectors';
import {Colors} from '../constants/Colors';
import PileGreen from '../assets/images/piles/green.png';
import PileRed from '../assets/images/piles/red.png';
import PileYellow from '../assets/images/piles/yellow.png';
import PileBlue from '../assets/images/piles/blue.png';
import DashedCircle from '../assets/images/dashedcircle.png';
// import {Svg, Circle} from 'react-native-svg';

const Pile = ({cell, pieceId, color, player, onPress}) => {
  const rotation = useRef(new Animated.Value(0)).current;
  const currentPlayerPileSelection = useSelector(selectPocketPileSelection);
  const currentPlayerCellSelection = useSelector(selectCellSelection);
  const diceNo = useSelector(selectDiceNo);
  const playerPieces = useSelector(state => state.game[`player${player}`]);

  const isPileEnabled = useMemo(
    () => player === currentPlayerPileSelection,
    [player, currentPlayerPileSelection],
  );

  const isCellEnabled = useMemo(
    () => player === currentPlayerCellSelection,
    [player, currentPlayerCellSelection],
  );

  const isForwardable = useCallback(() => {
    const piece = playerPieces?.find(item => item.id === pieceId);
    return piece && piece.travelCount + diceNo <= 57;
  }, [playerPieces, pieceId, diceNo]);

  const getPileImage = useMemo(() => {
    switch (color) {
      case Colors.green:
        return PileGreen;
      case Colors.red:
        return PileRed;
      case Colors.blue:
        return PileBlue;
      case Colors.yellow:
        return PileYellow;
      default:
        return PileGreen;
    }
  }, [color]);

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    rotateAnimation.start();

    return () => rotateAnimation.stop();
  }, [rotation]);

  const rotateInterpolate = useMemo(
    () =>
      rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      }),
    [rotation],
  );

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.5}
      disabled={!(cell ? isCellEnabled && isForwardable() : isPileEnabled)}
      onPress={onPress}>
      <View style={styles.hollowCircle}>
        {(cell ? isCellEnabled && isForwardable() : isPileEnabled) && (
          <View style={styles.dashedCircleContainer}>
            <Animated.View
              style={[
                styles.dashedCircle,
                {transform: [{rotate: rotateInterpolate}]},
              ]}>
              <Image source={DashedCircle} style={styles.dashedCircleImage} />
            </Animated.View>
          </View>
        )}
      </View>
      <Image
        source={getPileImage}
        style={{width: 32, height: 32, position: 'absolute', top: -16}}
      />
    </TouchableOpacity>
  );
};

export default memo(Pile);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    alignSelf: 'center',
  },
  hollowCircle: {
    width: 15,
    height: 15,
    position: 'absolute',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedCircleContainer: {
    position: 'absolute',
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    top: -8,
  },
  dashedCircle: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashedCircleImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    borderWidth: 4,
    borderRadius: 50,
    borderColor: 'pink',
  },
});
