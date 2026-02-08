import Colors from "@/constants/Colors";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

// Interface for props compatible with both implementations
interface MapViewProps {
  style?: any;
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  region?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onRegionChangeComplete?: (region: any) => void;
  children?: React.ReactNode;
}

interface MarkerProps {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title?: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

// Native implementation imports
let NativeMap: any = null;
let NativeMarker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== "web") {
  try {
    const Maps = require("react-native-maps");
    NativeMap = Maps.default;
    NativeMarker = Maps.Marker;
    PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
  } catch (e) {
    console.warn("react-native-maps not installed or failed to load");
  }
}

// Web implementation
const WebMap = (props: MapViewProps) => {
  // Simple check for mounting
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    // Inject Leaflet CSS
    if (Platform.OS === "web") {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }
  }, []);

  if (!isMounted)
    return (
      <View style={[props.style, { backgroundColor: Colors.gray[100] }]} />
    );

  // We require react-leaflet dynamically to avoid breaking native build
  let MapContainer, TileLayer;
  try {
    const RL = require("react-leaflet");
    MapContainer = RL.MapContainer;
    TileLayer = RL.TileLayer;
  } catch (e) {
    return (
      <View style={[props.style, styles.fallback]}>
        <Text>Map libraries missing for web</Text>
      </View>
    );
  }

  // Need to extract lat/lng from initialRegion or region
  const targetRegion = props.region || props.initialRegion;
  const center = targetRegion
    ? [targetRegion.latitude, targetRegion.longitude]
    : [19.4326, -99.1332];

  const zoom = 13;

  return (
    <View style={props.style}>
      {/* @ts-ignore */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        {/* @ts-ignore */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Render children (Markers) converting them to Web Markers */}
        {React.Children.map(props.children, (child) => {
          if (React.isValidElement(child) && child.type === MapMarker) {
            // @ts-ignore
            return React.cloneElement(child, { __isWeb: true });
          }
          return child;
        })}
      </MapContainer>
    </View>
  );
};

export const MapMarker = (props: MarkerProps & { __isWeb?: boolean }) => {
  if (Platform.OS === "web") {
    // Web implementation using React Leaflet Marker
    const RL = require("react-leaflet");
    const Marker = RL.Marker;
    const Popup = RL.Popup;

    const position = [props.coordinate.latitude, props.coordinate.longitude];

    return (
      // @ts-ignore
      <Marker position={position} eventHandlers={{ click: props.onPress }}>
        {props.children ? (
          // @ts-ignore
          <Popup>
            <div style={{ minWidth: 100 }}>
              {/* Simplified popup content */}
              {props.title && <strong>{props.title}</strong>}
              {props.description && <p>{props.description}</p>}
            </div>
          </Popup>
        ) : null}
      </Marker>
    );
  }

  return (
    <NativeMarker
      coordinate={props.coordinate}
      title={props.title}
      description={props.description}
      onPress={props.onPress}
    >
      {props.children}
    </NativeMarker>
  );
};

// Main Component
const MapView = React.forwardRef((props: MapViewProps, ref: any) => {
  if (Platform.OS === "web") {
    return <WebMap {...props} />;
  }

  if (!NativeMap) {
    return (
      <View style={[props.style, styles.fallback]}>
        <Text>Native Maps library could not be loaded.</Text>
        <Text style={{ fontSize: 10, marginTop: 5, color: "#666" }}>
          Please ensure react-native-maps is installed and linked.
        </Text>
      </View>
    );
  }

  return (
    <NativeMap
      ref={ref}
      style={props.style}
      provider={PROVIDER_GOOGLE}
      initialRegion={props.initialRegion}
      region={props.region}
      onRegionChangeComplete={props.onRegionChangeComplete}
    >
      {props.children}
    </NativeMap>
  );
});

export default MapView;

const styles = StyleSheet.create({
  fallback: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
