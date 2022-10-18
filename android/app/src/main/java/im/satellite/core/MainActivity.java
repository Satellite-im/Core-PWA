package im.satellite.core;

import android.graphics.Color;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Window window = getWindow();
    window.setStatusBarColor(Color.TRANSPARENT);
    window.setNavigationBarColor(Color.TRANSPARENT);
    window.getDecorView().setSystemUiVisibility(window.getDecorView().getSystemUiVisibility() | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
  }
}
