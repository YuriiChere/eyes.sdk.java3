package com.applitools.eyes.renderingGrid;

import com.applitools.eyes.BatchInfo;
import com.applitools.eyes.Logger;
import com.applitools.eyes.TestResults;
import com.applitools.eyes.selenium.Eyes;
import com.applitools.eyes.selenium.SeleniumRunner;
import com.applitools.eyes.selenium.fluent.Target;
import com.applitools.eyes.visualgridclient.model.RenderingConfiguration;
import com.applitools.eyes.visualgridclient.model.TestResultSummary;
import com.applitools.eyes.visualgridclient.services.EyesRunner;
import com.applitools.utils.GeneralUtils;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.ITestContext;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public final class TestSeleniumVGUnification {

    private EyesRunner runner;
    private WebDriver webDriver;

    private String logsPath = System.getenv("APPLITOOLS_LOGS_PATH");

    @BeforeMethod
    public void Before(ITestContext testContext){
        runner = new SeleniumRunner();

        webDriver = new ChromeDriver();
        webDriver.get("https://applitools.github.io/demo/TestPages/VisualGridTestPage");
        //webDriver.get("http://applitools-vg-test.surge.sh/test.html");

        System.setProperty("https.protocols", "TLSv1,TLSv1.1,TLSv1.2");
    }

    @Test
    public void test() {

        Eyes eyes = new Eyes(runner);
        eyes.setBatch(new BatchInfo("SimpleVisualGridBatch"));

        try {
//            eyes.setProxy(new ProxySettings("http://127.0.0.1", 8888, null, null));
            //VisualGridEyes.setServerUrl("https://eyes.applitools.com/");
            eyes.open(webDriver, "Test for Selenium unification", "test1");
            //CheckRGSettings setting = new CheckRGSettings(CheckRGSettings.SizeMode.FULL_PAGE, null, null, false);
            eyes.check(Target.window().withName("test").fully(false).sendDom(false));
            TestResults close = eyes.close();
            Assert.assertNotNull(close);

        } catch (Exception e) {
            GeneralUtils.logExceptionStackTrace(eyes.getLogger(), e);
        } finally {
            if (webDriver != null) {
                webDriver.quit();
            }
            // End the test.
        }
    }

    @AfterMethod
    public void After(ITestContext testContext) {
        Logger logger = runner.getLogger();
        TestResultSummary allTestResults = runner.getAllTestResults();
        logger.log(allTestResults.toString());
        webDriver.quit();
    }
}