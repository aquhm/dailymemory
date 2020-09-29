import React from "react";
import MapView, { Region, Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import { HomeNavigationProps, DiaryNavigatorStackProps } from "../../routes/HomeNavigator";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import RoundedIconButton from "../../components/RoundedIconButton";

interface State {
  mapRegion?: Region;
  location?: Location.LocationData | undefined;
  geocode?: Location.Address[];
  hasLocationPermissions: boolean;
}

interface Props {
  latitude?: number;
  longitude?: number;
  palceTitle?: string;
  navigation: DiaryNavigatorStackProps<"Map">;
}

export default class MapScreen extends React.Component<Props, State> {
  state: State = {
    location: undefined,
    geocode: undefined,
    hasLocationPermissions: false,
  };
  myLatitude: number;
  myLongitude: number;

  constructor(props: Props) {
    super(props);
    console.log("MapScreen");
    this.myLatitude = 0;
    this.myLongitude = 0;
  }

  componentDidMount() {
    this.getLocationAsync();
  }

  handleMapRegionChangeComplete = (region: Region) => {
    console.log("handleMapRegionChangeComplete latitude = " + region.latitude);
    console.log("handleMapRegionChangeComplete longitude = " + region.longitude);

    this.setState({ mapRegion: region });
  };

  async getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === "granted") {
      this.setState({ hasLocationPermissions: true });
      //  let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
        accuracy: Location.Accuracy.Highest,
      });

      await this.getGeocodeAsync(location);

      console.log("getLocationAsync latitude = " + location.coords.latitude);
      console.log("getLocationAsync longitude = " + location.coords.longitude);
      // Center the map on the location we just fetched.

      this.myLatitude = location.coords.latitude;
      this.myLongitude = location.coords.longitude;

      this.setState({
        location: location,
        mapRegion: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
      });
    } else {
      alert("Location permission not granted");
    }
  }

  getGeocodeAsync = async (location: Location.LocationData) => {
    const { latitude, longitude } = location.coords;
    let _geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    this.setState({ geocode: _geocode });
  };

  renderMap = () => {
    return (
      this.state.mapRegion && (
        <MapView
          style={styles.mapStyle}
          region={this.state.mapRegion}
          showsUserLocation={true}
          onRegionChangeComplete={this.handleMapRegionChangeComplete}
          showsMyLocationButton
          mapType="standard"
          loadingEnabled
        >
          {
            <Marker
              coordinate={{ latitude: this.myLatitude, longitude: this.myLongitude }}
              title={this.props.palceTitle || ""}
              draggable
            />
          }
        </MapView>
      )
    );
  };

  renderOverlayButtons = () => {
    return (
      <>
        <View
          style={{
            flexDirection: "row-reverse",
            ...StyleSheet.absoluteFillObject,
            top: 10,
            right: 10,
          }}
        >
          <RoundedIconButton
            name="arrow-left"
            size={32}
            iconScale={0.5}
            backgroundColor={"white"}
            color="black"
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "column-reverse",
            ...StyleSheet.absoluteFillObject,
            bottom: 10,
            right: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
            }}
          >
            <RoundedIconButton
              name="map-pin"
              size={32}
              iconScale={0.5}
              backgroundColor={"white"}
              color="black"
              onPress={() => {
                this.setState({
                  mapRegion: {
                    latitude: this.myLatitude,
                    longitude: this.myLongitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  },
                });
              }}
            />
          </View>
        </View>
      </>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.renderMap()}
        {this.renderOverlayButtons()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
