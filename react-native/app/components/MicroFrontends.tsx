import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { page } from './picard';

/**
 * Renders the micro frontends on iOS and Android. As there is no DOM,
 * Picard.js runs in a WebView using its browser script.
 */
export default function MicroFrontends() {
  return (
    <WebView
      style={styles.webview}
      originWhitelist={['*']}
      source={{ html: page, baseUrl: 'https://localhost/' }}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    alignSelf: 'stretch',
  },
});
