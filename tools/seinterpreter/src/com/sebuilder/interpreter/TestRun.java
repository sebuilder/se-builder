/*
* Copyright 2012 Sauce Labs
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package com.sebuilder.interpreter;

import com.sebuilder.interpreter.webdriverfactory.WebDriverFactory;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openqa.selenium.remote.RemoteWebDriver;

/**
 * A single run of a test script.
 * @author zarkonnen
 */
public class TestRun {
	HashMap<String, String> vars = new HashMap<String, String>();
	Script script;
	protected int stepIndex = -1;
	RemoteWebDriver driver;
	Log log;
	WebDriverFactory webDriverFactory = SeInterpreter.DEFAULT_DRIVER_FACTORY;
	HashMap<String, String> webDriverConfig = new HashMap<String, String>();
	Long implicitlyWaitDriverTimeout;
	Long pageLoadDriverTimeout;
	public Log getLog() { return log; }
	public RemoteWebDriver getDriver() { return driver; }
	public Script getScript() { return script; }

	public TestRun(Script script) {
		this.script = script;
		log = LogFactory.getFactory().getInstance(SeInterpreter.class);
	}

	public TestRun(Script script, int implicitlyWaitDriverTimeout, int pageLoadDriverTimeout) {
		this(script);
		setTimeouts(implicitlyWaitDriverTimeout, pageLoadDriverTimeout);
	}
	
	public TestRun(Script script, Log log) {
		this.script = script;
		this.log = log;
	}
	
	public TestRun(Script script, Log log, WebDriverFactory webDriverFactory, HashMap<String, String> webDriverConfig) {
		this(script, log);
		this.webDriverFactory = webDriverFactory;
		this.webDriverConfig = webDriverConfig;
	}

	public TestRun(
		Script script,
		Log log,
		WebDriverFactory webDriverFactory,
		HashMap<String, String> webDriverConfig,
		int implicitlyWaitDriverTimeout,
		int pageLoadDriverTimeout)
	{
		this(script, log, webDriverFactory, webDriverConfig);
		setTimeouts(implicitlyWaitDriverTimeout, pageLoadDriverTimeout);
	}
        
	public TestRun(
		Script script,
		WebDriverFactory webDriverFactory,
		HashMap<String, String> webDriverConfig,
		int implicitlyWaitDriverTimeout,
		int pageLoadDriverTimeout)
	{
		this(
			script,
			LogFactory.getFactory().getInstance(SeInterpreter.class),
			webDriverFactory,
			webDriverConfig,
			implicitlyWaitDriverTimeout,
			pageLoadDriverTimeout);
	}
	
	/** @return True if there is another step to execute. */
	public boolean hasNext() {
		boolean hasNext = stepIndex < script.steps.size() - 1;
		if (!hasNext && driver != null) {
			log.debug("Quitting driver.");
			driver.quit();
		}
		return hasNext;
	}
	
	/**
	 * Executes the next step.
	 * @return True on success.
	 */
	public boolean next() {
		if (stepIndex == -1) {
			log.debug("Starting test run.");
		}

		initRemoteWebDriver();

		log.debug("Running step " + (stepIndex + 2) + ":" +
		script.steps.get(stepIndex + 1).getClass().getSimpleName() + " step.");
		boolean result = false;
		try {
			result = script.steps.get(++stepIndex).type.run(this);
		} catch (Exception e) {
			throw new RuntimeException(currentStep() + " failed.", e);
		}
		
		if (!result) {
			// If a verify failed, we just note this but continue.
			if (currentStep().type instanceof Verify) {
				log.error(currentStep() + " failed.");
				return false;
			}
			// In all other cases, we throw an exception to stop the run.
			RuntimeException e = new RuntimeException(currentStep() + " failed.");
			e.fillInStackTrace();
			log.fatal(e);
			throw e;
		} else {
			return true;
		}
	}

	/**
	 * Resets the script's progress and closes the driver if needed.
	 */
	public void reset() {
		log.debug("Resetting test run.");
		vars.clear();
		stepIndex = -1;
		if (driver != null) { driver.quit(); }
	}
	
	/**
	 * Runs the entire (rest of the) script.
	 * @return True if the script ran successfully, false if a verification failed.
	 *         Any other failure throws an exception.
	 * @throws RuntimeException if the script failed.
	 */
	public boolean finish() {
		boolean success = true;
		try {
			while (hasNext()) {
				success = next() && success;
			}
		} catch (RuntimeException e) {
			// If the script terminates, the driver will be closed automatically.
			try { driver.quit(); } catch (Exception e2) {}
			throw e;
		}
		return success;
	}
	
	/** @return The step that is being/has just been executed. */
	public Step currentStep() { return script.steps.get(stepIndex); }
	/** @return The driver instance being used. */
	public RemoteWebDriver driver() { return driver; }
	/** @return The logger being used. */
	public Log log() { return log; }
	/** @return The HashMap of variables. */
	public HashMap<String, String> vars() { return vars; }
		
	/**
	 * Fetches a String parameter from the current step.
	 * @param paramName The parameter's name.
	 * @return The parameter's value.
	 */
	public String string(String paramName) {
		String s = currentStep().stringParams.get(paramName);
		if (s == null) {
			throw new RuntimeException("Missing parameter \"" + paramName + "\" at step #" +
					(stepIndex + 1) + ".");
		}
		// This kind of variable substitution makes for short code, but it's inefficient.
		for (Map.Entry<String, String> v : vars.entrySet()) {
			s = s.replace("${" + v.getKey() + "}", v.getValue());
		}
		return s;
	}
	
	/**
	 * Fetches a Locator parameter from the current step.
	 * @param paramName The parameter's name.
	 * @return The parameter's value.
	 */
	public Locator locator(String paramName) {
		Locator l = new Locator(currentStep().locatorParams.get(paramName));
		if (l == null) {
			throw new RuntimeException("Missing parameter \"" + paramName + "\" at step #" +
					(stepIndex + 1) + ".");
		}
		// This kind of variable substitution makes for short code, but it's inefficient.
		for (Map.Entry<String, String> v : vars.entrySet()) {
			l.value = l.value.replace("${" + v.getKey() + "}", v.getValue());
		}
		return l;
	}

	/**
	 * Initialises remoteWebDriver by invoking factory and set timeouts when
	 * needed
	 */
	public void initRemoteWebDriver() {
		if (driver == null) {
			log.debug("Initialising driver.");
			try {
				driver = webDriverFactory.make(webDriverConfig);
				if (implicitlyWaitDriverTimeout != null) {
					driver.manage().timeouts().implicitlyWait(implicitlyWaitDriverTimeout, TimeUnit.SECONDS);
				}
				if (pageLoadDriverTimeout != null) {
					driver.manage().timeouts().pageLoadTimeout(pageLoadDriverTimeout, TimeUnit.SECONDS);
				}
			} catch (Exception e) {
				throw new RuntimeException("Test run failed: unable to create driver.", e);
			}
		}
	}

	/**
	 *
	 * @param implicitlyWaitDriverTimeout
	 * @param pageLoadDriverTimeout
	 */
	private void setTimeouts(int implicitlyWaitDriverTimeout, int pageLoadDriverTimeout) {
		if (implicitlyWaitDriverTimeout > 0) {
			this.implicitlyWaitDriverTimeout = Long.valueOf(implicitlyWaitDriverTimeout);
		}
		if (pageLoadDriverTimeout > 0) {
			this.pageLoadDriverTimeout = Long.valueOf(pageLoadDriverTimeout);
		}
	}
}
