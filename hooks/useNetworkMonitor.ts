import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { uploadPendingRecipes } from "@/utils/networkUtils";

export const useNetworkMonitor = () => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // When connected to WiFi, try to upload pending recipes
      if (state.isConnected && state.type === "wifi") {
        uploadPendingRecipes().catch((error) => {
          console.error("Error uploading pending recipes:", error);
        });
      }
    });

    // Check initial state
    NetInfo.fetch().then((state) => {
      if (state.isConnected && state.type === "wifi") {
        uploadPendingRecipes().catch((error) => {
          console.error(
            "Error uploading pending recipes on initial check:",
            error
          );
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
