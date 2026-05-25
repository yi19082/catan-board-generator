import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system/legacy";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const WEB_ASSETS = [
  { module: require("../assets/web/index.html"), path: "index.html" },
  { module: require("../assets/web/common.css"), path: "common.css" },
  { module: require("../assets/web/map_select.css"), path: "map_select.css" },
  { module: require("../assets/web/style_by_orientation.css"), path: "style_by_orientation.css" },
  { module: require("../assets/web/index.min.webjs"), path: "index.min.js" },
  { module: require("../assets/web/mobile-bridge.css"), path: "mobile-bridge.css" },
  { module: require("../assets/web/mobile-bridge-script.webjs"), path: "mobile-bridge.js" },
  { module: require("../assets/web/pics/wood.png"), path: "pics/wood.png" },
  { module: require("../assets/web/pics/wheat.png"), path: "pics/wheat.png" },
  { module: require("../assets/web/pics/sheep.png"), path: "pics/sheep.png" },
  { module: require("../assets/web/pics/ore.png"), path: "pics/ore.png" },
  { module: require("../assets/web/pics/normalBackground.png"), path: "pics/normalBackground.png" },
  { module: require("../assets/web/pics/desert.png"), path: "pics/desert.png" },
  { module: require("../assets/web/pics/brick.png"), path: "pics/brick.png" }
];

type LoadState =
  | { status: "loading" }
  | { status: "ready"; uri: string }
  | { status: "error"; message: string };

async function copyAsset(asset: Asset, targetPath: string) {
  if (!asset.localUri) {
    throw new Error(`Asset did not resolve locally: ${asset.name}`);
  }

  const existing = await FileSystem.getInfoAsync(targetPath);
  if (existing.exists) {
    await FileSystem.deleteAsync(targetPath, { idempotent: true });
  }

  await FileSystem.copyAsync({ from: asset.localUri, to: targetPath });
}

async function prepareWebApp() {
  const root = `${FileSystem.documentDirectory}web`;
  const pics = `${root}/pics`;

  await FileSystem.makeDirectoryAsync(pics, { intermediates: true });

  const assets = await Promise.all(
    WEB_ASSETS.map(async (entry) => {
      const [asset] = await Asset.loadAsync(entry.module);
      return { asset, path: entry.path };
    })
  );

  await Promise.all(
    assets.map(({ asset, path }) => {
      return copyAsset(asset, `${root}/${path}`);
    })
  );

  return `${root}/index.html`;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <BoardGenerator />
    </SafeAreaProvider>
  );
}

function BoardGenerator() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    prepareWebApp()
      .then((uri) => setLoadState({ status: "ready", uri }))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Unable to prepare the board generator.";
        setLoadState({ status: "error", message });
      });
  }, []);

  return (
    <SafeAreaView edges={["top", "right", "bottom", "left"]} style={styles.container}>
      <StatusBar backgroundColor="#fff8e7" style="dark" translucent={false} />
      {loadState.status === "ready" ? (
        <WebView
          originWhitelist={["*"]}
          source={{ uri: loadState.uri }}
          allowFileAccess
          allowingReadAccessToURL={FileSystem.documentDirectory ?? undefined}
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
          injectedJavaScriptBeforeContentLoaded={`
            document.documentElement.style.setProperty('--native-safe-top', '${insets.top}px');
            document.documentElement.style.setProperty('--native-safe-right', '${insets.right}px');
            document.documentElement.style.setProperty('--native-safe-bottom', '${insets.bottom}px');
            document.documentElement.style.setProperty('--native-safe-left', '${insets.left}px');
            true;
          `}
          style={styles.webview}
        />
      ) : (
        <View style={styles.loading}>
          {loadState.status === "loading" ? (
            <ActivityIndicator color="#7a4d22" />
          ) : (
            <Text style={styles.errorText}>{loadState.message}</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8e7"
  },
  webview: {
    flex: 1,
    backgroundColor: "#fff8e7"
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  },
  errorText: {
    color: "#5e2a17",
    fontSize: 16,
    textAlign: "center"
  }
});
