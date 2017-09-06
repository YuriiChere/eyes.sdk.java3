package com.applitools.eyes.selenium.positioning;

import com.applitools.eyes.BrowserNames;
import com.applitools.eyes.Logger;
import com.applitools.eyes.UserAgent;
import com.applitools.eyes.selenium.Eyes;

public class RegionPositionCompensationFactory {

    public static RegionPositionCompensation getRegionPositionCompensation(UserAgent userAgent, Eyes eyes, Logger logger) {
        if (userAgent.getBrowser().equals(BrowserNames.Firefox)) {
            try {
                if (Integer.parseInt(userAgent.getBrowserMajorVersion()) >= 48) {
                    return new FirefoxRegionPositionCompensation(eyes, logger);
                }
            } catch (NumberFormatException e) {
                return new NullRegionPositionCompensation();
            }
        } else if (userAgent.getBrowser().equals(BrowserNames.Safari)) {
            //regionInScreenshot = regionInScreenshot.offset(0, (int) Math.ceil(pixelRatio));
        }

        return new NullRegionPositionCompensation();
    }
}