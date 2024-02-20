const { safeMock, safeRequire } = require('../utils/jest');

global.FormData = require('react-native/Libraries/Network/FormData');

// REACT NATIVE

safeMock('react-native/Libraries/Animated/NativeAnimatedHelper');
safeMock('react-native/Libraries/EventEmitter/NativeEventEmitter');
safeMock('react-native/Libraries/Utilities/BackHandler', () => safeRequire('react-native/Libraries/Utilities/__mocks__/BackHandler'));
safeMock('react-native/Libraries/Settings/Settings.ios.js', () => {
  const settingsStore = {};
  return ({
    get: jest.fn().mockImplementation((key) => settingsStore[key]),
    set: jest.fn().mockImplementation(store => {
      Object.assign(settingsStore, store);
    }),
    watchKeys: jest.fn().mockReturnValue(1),
    clearWatch: jest.fn(),
    _sendObservations: jest.fn(),
  });
});
safeMock('react-native/Libraries/PermissionsAndroid/PermissionsAndroid.js', () => {
  const actualPermissions = jest.requireActual('react-native/Libraries/PermissionsAndroid/PermissionsAndroid.js');
  return ({
    PERMISSIONS: actualPermissions.PERMISSIONS,
    requestMultiple: jest.fn().mockResolvedValue({
      'android.permission.READ_CALENDAR': 'granted',
      'android.permission.WRITE_CALENDAR': 'granted',
      'android.permission.CAMERA': 'granted',
      'android.permission.READ_CONTACTS': 'granted',
      'android.permission.WRITE_CONTACTS': 'granted',
      'android.permission.GET_ACCOUNTS': 'granted',
      'android.permission.ACCESS_BACKGROUND_LOCATION': 'granted',
      'android.permission.ACCESS_FINE_LOCATION': 'granted',
      'android.permission.ACCESS_COARSE_LOCATION': 'granted',
      'android.permission.RECORD_AUDIO': 'granted',
      'android.permission.READ_PHONE_STATE': 'granted',
      'android.permission.CALL_PHONE': 'granted',
      'android.permission.READ_CALL_LOG': 'granted',
      'android.permission.WRITE_CALL_LOG': 'granted',
      'com.android.voicemail.permission.ADD_VOICEMAIL': 'granted',
      'com.android.voicemail.permission.READ_VOICEMAIL': 'granted',
      'com.android.voicemail.permission.WRITE_VOICEMAIL': 'granted',
      'android.permission.USE_SIP': 'granted',
      'android.permission.PROCESS_OUTGOING_CALLS': 'granted',
      'android.permission.BODY_SENSORS': 'granted',
      'android.permission.BODY_SENSORS_BACKGROUND': 'granted',
      'android.permission.SEND_SMS': 'granted',
      'android.permission.RECEIVE_SMS': 'granted',
      'android.permission.READ_SMS': 'granted',
      'android.permission.RECEIVE_WAP_PUSH': 'granted',
      'android.permission.RECEIVE_MMS': 'granted',
      'android.permission.READ_EXTERNAL_STORAGE': 'granted',
      'android.permission.READ_MEDIA_IMAGES': 'granted',
      'android.permission.READ_MEDIA_VIDEO': 'granted',
      'android.permission.READ_MEDIA_AUDIO': 'granted',
      'android.permission.WRITE_EXTERNAL_STORAGE': 'granted',
      'android.permission.BLUETOOTH_CONNECT': 'granted',
      'android.permission.BLUETOOTH_SCAN': 'granted',
      'android.permission.BLUETOOTH_ADVERTISE': 'granted',
      'android.permission.ACCESS_MEDIA_LOCATION': 'granted',
      'android.permission.ACCEPT_HANDOVER': 'granted',
      'android.permission.ACTIVITY_RECOGNITION': 'granted',
      'android.permission.ANSWER_PHONE_CALLS': 'granted',
      'android.permission.READ_PHONE_NUMBERS': 'granted',
      'android.permission.UWB_RANGING': 'granted',
      'android.permission.POST_NOTIFICATIONS': 'granted',
      'android.permission.NEARBY_WIFI_DEVICES': 'granted',
    }),
  });
});

// LIBRARIES MOCK

safeMock('react-native-safe-area-context', () => safeRequire('react-native-safe-area-context/jest/mock'));
safeMock('react-native-permissions', () => safeRequire('react-native-permissions/mock'));
safeMock('react-native-device-info', () => safeRequire('react-native-device-info/jest/react-native-device-info-mock'));
safeMock('@react-native-async-storage/async-storage', () => safeRequire('@react-native-async-storage/async-storage/jest/async-storage-mock'));

// NATIVE MODULES

// safeMock('react-native', () => {
//   const ReactNative = jest.requireActual('react-native');

//   ReactNative.NativeModules.OtpModule = {
//     generateToken: jest.fn().mockReturnValue(Promise.resolve({
//       currentToken: 'currentToken',
//       nextToken: 'nextToken',
//     })),
//     generateEncryptedPacket: jest.fn().mockReturnValue(Promise.resolve('EncryptedPacket')),
//     generatePacket1: jest.fn().mockReturnValue(Promise.resolve('Packet1')),
//     generatePacket2: jest.fn().mockReturnValue(Promise.resolve({
//       cripto2: 'cripto2',
//       packetHash: 'packetHash',
//     })),
//   };

//   ReactNative.NativeModules.OmniIDWallThemeModule = {
//     setColorsIOS: jest.fn().mockResolvedValue(),
//   };

//   return ReactNative;
// });

// LIBRARIES CUSTOM

safeMock('expo-barcode-scanner', () => {
  const { View: RNView, Button: RNButton } = require('react-native');

  const BarCodeScanner = ({ onBarCodeScanned, children, testID }) => (
    <RNView testID={testID}>
      {children}
      <RNButton onPress={() => onBarCodeScanned?.({ data: 'example', type: '' })} testID="barcode-simulate-scan" title="Simulate" />
    </RNView>
  );

  BarCodeScanner.requestPermissionsAsync = jest.fn().mockResolvedValue({
    granted: true, status: 'granted', expires: 'never', canAskAgain: false,
  });

  const PermissionStatus = {
    GRANTED: 'granted',
    DENIED: 'denied',
  };

  const BarCodeType = {
    qr: 'qr',
  };

  return { BarCodeScanner, Constants: { BarCodeType, Type: { back: 'back' } }, PermissionStatus };
});

safeMock('react-native-view-shot', () => {
  const { View } = require('react-native');
  const { forwardRef, useImperativeHandle, createElement } = require('react');

  const ViewShotMock = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
      capture: jest.fn(() => {
        props.onCapture?.('view-shot-image-uri');
        return Promise.resolve('view-shot-image-uri');
      }),
    }), []);
    return createElement(View, props, props.children);
  });

  return ViewShotMock;
});

safeMock('rn-fetch-blob', () => {
  return {
    DocumentDir: () => { },
    fetch: () => { },
    base64: () => { },
    android: () => { },
    ios: () => { },
    config: () => { },
    session: () => { },
    fs: () => { },
    wrap: () => { },
    polyfill: () => { },
    JSONStream: () => { },
  };
});

safeMock('react-native-share', () => ({
  open: jest.fn().mockResolvedValue(),
}));

safeMock('react-navigation-animated-switch', () => {
  const animatedSwitch = jest.fn();
  animatedSwitch.default = jest.fn();
  return animatedSwitch;
});

safeMock('react-native-reanimated', () => ({
  Transition: {
    In: jest.fn(),
    Out: jest.fn(),
    Together: jest.fn(),
  },
}));

safeMock('react-native-marketingcloudsdk', () => ({
  logSdkState: jest.fn(),
  enablePush: jest.fn(),
  setContactKey: jest.fn(),
}));

safeMock('@react-native-firebase/messaging', () => {
  return jest.fn(() => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    setBackgroundMessageHandler: jest.fn(),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    requestPermission: jest.fn().mockResolvedValue(1),
    getToken: jest.fn(() => Promise.resolve('myMockToken')),
  }));
});

safeMock('@react-native-firebase/analytics', () => {
  return () => ({
    logEvent: jest.fn(),
    logAppOpen: jest.fn(),
    setUserProperties: jest.fn(),
    setUserId: jest.fn(),
    setCurrentScreen: jest.fn(),
  });
});

safeMock('react-navigation', () => ({
  createAppContainer: jest.fn().mockReturnValue(jest.fn()),
}));

safeMock('react-native-qrcode-scanner', () => ({
  default: jest.fn(),
}));

safeMock('react-native-camera', () => {
  const RNCamera = jest.fn();
  RNCamera.Constants = {
    Aspect: {},
    BarCodeType: {},
    Type: { back: 'back', front: 'front' },
    CaptureMode: {},
    CaptureTarget: {},
    CaptureQuality: {},
    Orientation: {},
    FlashMode: {},
    TorchMode: {},
  };
  return {
    RNCamera,
    default: RNCamera,
  };
});

safeMock('@idwall/react-native-idwall-sdk', () => ({
  initialize: jest.fn(),
  IdwallFlowType: { COMPLETE: 'COMPLETE' },
  IdwallDocumentOption: { PRINTED: 'PRINTED' },
  startFlow: jest.fn().mockImplementation(() => {
    return Promise.resolve('tokenidwall');
  }),
  ios: {
    setupPublicKeys: jest.fn(),
  },
}));

safeMock('expo-camera', () => {
  const { View } = require('react-native');
  const { forwardRef, useImperativeHandle, createElement } = require('react');

  const CameraMock = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
      takePictureAsync: jest.fn().mockResolvedValue({
        exif: {},
        height: 1920,
        uri: 'file:///path/image.jpg',
        width: 1080,
      }),
      getSupportedRatiosAsync: jest.fn().mockResolvedValue(["1:1", "2:1", "3:2", "4:3", "11:9"]),
    }), []);
    return createElement(View, props, props.children);
  });

  CameraMock.getCameraPermissionsAsync = jest.fn().mockResolvedValue({
    granted: true, status: 'granted', expires: 'never', canAskAgain: true,
  });

  CameraMock.requestCameraPermissionsAsync = jest.fn().mockResolvedValue({
    granted: true, status: 'granted', expires: 'never', canAskAgain: false,
  });

  return {
    Camera: CameraMock,
    PermissionStatus: {
      UNDETERMINED: 'undetermined',
      DENIED: 'denied',
      GRANTED: 'granted',
    },
    AutoFocus: {
      off: 'off',
      on: 'on',
    },
    CameraType: {
      front: 'front',
      back: 'back',
    },
    default: CameraMock,
  };
});

safeMock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  const ReactImport = require('react');
  const LinearGradient = props => ReactImport.createElement(View, props, props.children);
  return {
    LinearGradient,
    default: LinearGradient,
  };
});

safeMock('expo-secure-store', () => {
  const store = {};
  return ({
    getItemAsync: jest.fn().mockImplementation((...args) => store[args[0]]),
    setItemAsync: jest.fn().mockImplementation((...args) => {
      store[args[0]] = args[1];
    }),
    deleteItemAsync: jest.fn().mockImplementation((...args) => {
      delete store[args[0]];
    }),
  });
});

safeMock('expo-file-system', () => ({
  downloadAsync: jest.fn().mockResolvedValue({
    uri: 'file:///file/',
    headers: {},
    mimeType: 'file/type',
    status: 200,
  }),
  documentDirectory: 'file:///dir/',
  cacheDirectory: 'file:///dir/cache/',
  makeDirectoryAsync: jest.fn(),
  writeAsStringAsync: jest.fn().mockResolvedValue(),
  copyAsync: jest.fn(),
  getInfoAsync: jest.fn().mockReturnValue({
    modificationTime: 0,
    exists: true,
  }),
  deleteAsync: jest.fn(),
  EncodingType: {
    UTF8: 'utf8',
    Base64: 'base64',
  }
}));

safeMock('expo-clipboard', () => ({
  setStringAsync: jest.fn().mockImplementation(() => {
    return Promise.resolve(true);
  }),
  getStringAsync: jest.fn().mockImplementation(() => {
    return Promise.resolve('clipboard');
  }),
}));

safeMock('react-native-file-viewer', () => {
  const instance = {
    open: jest.fn().mockResolvedValue(undefined),
  };
  return {
    ...instance,
    default: instance,
  };
});

safeMock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn().mockResolvedValue({
    uri: 'file://result/file.jpg',
    width: 100,
    height: 100,
    base64: 'a1b2c3d4e5...',
  }),
  SaveFormat: {
    JPEG: 'jpeg',
    PNG: 'png',
    WEBP: 'webp',
  },
  FlipType: {
    Vertical: 'vertical',
    Horizontal: 'horizontal',
  },
}));

safeMock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn().mockResolvedValue({
    name: 'file.jpg',
    uri: 'file://result/file.jpg',
    type: 'success',
    mimeType: 'image/jpeg',
  }),
}));

safeMock('expo-image-picker', () => ({
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({
    granted: true,
    status: 'granted',
    canAskAgain: true,
    expires: 'never',
   }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{
      uri: 'file:///library-mock.jpg',
      height: 500,
      width: 600,
    }]
  }),
  launchCameraAsync: jest.fn().mockResolvedValue({
    canceled: false,
    assets: [{
      uri: 'file:///camera-mock.jpg',
      height: 500,
      width: 600,
    }]
  }),
  MediaTypeOptions: {
    All: 'All',
    Videos: 'Videos',
    Images: 'Images',
  },
}));

safeMock('reactotron-react-native', () => {
  const reactotron = jest.requireActual('reactotron-react-native');

  return {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    ReactotronReactNative: reactotron.ReactotronReactNative,
    setAsyncStorageHandler: jest.fn(() => ({
      configure: jest.fn(() => ({
        useReactNative: jest.fn(() => ({
          connect: jest.fn(() => ({
            log: jest.fn(),
            warn: jest.fn(),
            error: jest.fn(),
          })),
        })),
      }))
    })),
  }
});
