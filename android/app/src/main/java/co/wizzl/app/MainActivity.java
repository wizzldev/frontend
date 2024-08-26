package com.wizzl.app;

import com.getcapacitor.BridgeActivity;
import android.webkit.WebView;
import android.os.Bundle;
import android.webkit.CookieManager;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);
    }

    @Override
    public void onStart() {
         super.onStart();
         // Disable the rubber-band over-scroll effect that causes the app UI to get stretched.
         WebView v = getBridge().getWebView();
         v.setOverScrollMode(v.OVER_SCROLL_NEVER);
    }

    @Override
    public void onPause() {
        super.onPause();

        CookieManager.getInstance().flush();
    }
}
