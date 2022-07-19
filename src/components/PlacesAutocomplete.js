import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_PLACES_APIKEY } from "@env";

export const GooglePlacesInput = ({ placeholder, onPlaceSelected }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      fetchDetails
      styles={{ textInput: styles.inputText }}
      onPress={(data, details = null) => {
        onPlaceSelected(details);
      }}
      query={{
        key: GOOGLE_PLACES_APIKEY,
        language: "en",
      }}
      currentLocation={true}
    />
  );
};
