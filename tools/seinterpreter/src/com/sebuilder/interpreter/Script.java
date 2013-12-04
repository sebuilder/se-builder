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

import com.sebuilder.interpreter.factory.TestRunFactory;
import com.sebuilder.interpreter.webdriverfactory.WebDriverFactory;
import java.util.ArrayList;
import java.util.HashMap;
import org.apache.commons.logging.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * A Selenium 2 script. To create and run a test, instantiate a Script object,
 * add some Script.Steps to its steps, then invoke "run". If you want to be able
 * to run the script step by step, invoke "start", which will return a TestRun
 * object.
 *
 * @author zarkonnen
 */
public class Script {
	public ArrayList<Step> steps = new ArrayList<Step>();
	public TestRunFactory testRunFactory = new TestRunFactory();

	/**
	 * @return A TestRun object that can be iterated to run the script step by
	 * step.
	 */
	public TestRun start() {
		return testRunFactory.createTestRun(this);
	}

	/**
	 * @param log Logger to log to.
	 * @param webDriverFactory Factory for the WebDriver to use for playback.
	 * @param webDriverConfig Configuration for the factory/WebDriver.
	 * @return A TestRun object that can be iterated to run the script step by
	 * step.
	 */
	public TestRun start(Log log, WebDriverFactory webDriverFactory, HashMap<String, String> webDriverConfig) {
		return testRunFactory.createTestRun(this, log, webDriverFactory, webDriverConfig);
	}

	/**
	 * Runs the script.
	 *
	 * @return Whether the run succeeded or failed.
	 * @throws RuntimeException If the script encountered a problem, including a
	 * failed Assertion or timed-out Wait.
	 */
	public boolean run() {
		return start().finish();
	}

	/**
	 * Runs the script.
	 *
	 * @param log Logger to log to.
	 * @param webDriverFactory Factory for the WebDriver to use for playback.
	 * @param webDriverConfig Configuration for the factory/WebDriver.
	 * @return Whether the run succeeded or failed.
	 * @throws RuntimeException If the script encountered a problem, including a
	 * failed Assertion or timed-out Wait.
	 */
	public boolean run(Log log, WebDriverFactory webDriverFactory, HashMap<String, String> webDriverConfig) {
		return start(log, webDriverFactory, webDriverConfig).finish();
	}

	@Override
	public String toString() {
		try {
			return toJSON().toString(4);
		} catch (JSONException e) {
			throw new RuntimeException(e);
		}
	}

	public JSONObject toJSON() throws JSONException {
		JSONObject o = new JSONObject();
		o.put("seleniumVersion", "2");
		o.put("formatVersion", 1);
		JSONArray stepsA = new JSONArray();
		for (Step s : steps) {
			stepsA.put(s.toJSON());
		}
		return o;
	}
}