package im.satellite.core;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowInsetsAnimation;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  private WindowInsetsAnimation.Callback windowInsetsCallback;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    Window window = getWindow();
    float density = getResources().getDisplayMetrics().density;
    View view = window.getDecorView();

    window.setStatusBarColor(Color.TRANSPARENT);
    window.setNavigationBarColor(Color.TRANSPARENT);
    view.setSystemUiVisibility(window.getDecorView().getSystemUiVisibility() | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);

    view.setOnApplyWindowInsetsListener((v, insets) -> {
      int keyboardHeight = insets.getSystemWindowInsetBottom();

      getBridge().getWebView().evaluateJavascript("window.dispatchEvent(new CustomEvent('keyboardHeight', { detail: { height: " + (keyboardHeight / density) + " } }));", null);
      return insets;
    });
  }

}
