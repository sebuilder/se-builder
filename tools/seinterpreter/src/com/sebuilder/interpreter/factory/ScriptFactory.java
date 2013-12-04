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
package com.sebuilder.interpreter.factory;

import com.sebuilder.interpreter.Locator;
import com.sebuilder.interpreter.Script;
import com.sebuilder.interpreter.Step;
import java.io.IOException;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

/**
 * Factory to create Script objects from a string, a reader or JSONObject.
 *
 * @author jkowalczyk
 */
public class ScriptFactory {
	StepTypeFactory stepTypeFactory = new StepTypeFactory();
	TestRunFactory testRunFactory = new TestRunFactory();

	public void setStepTypeFactory(StepTypeFactory stepTypeFactory) {
		this.stepTypeFactory = stepTypeFactory;
	}

	public void setTestRunFactory(TestRunFactory testRunFactory) {
		this.testRunFactory = testRunFactory;
	}

	/**
	 * @return A new instance of script
	 */
	public Script create() {
		Script script = new Script();
		script.testRunFactory = testRunFactory;
		return script;
	}

	/**
	 * @param scriptO A JSONObject describing a script.
	 * @return A script, ready to run.
	 * @throws IOException If anything goes wrong with interpreting the JSON.
	 */
	public Script parse(JSONObject scriptO) throws IOException, SuiteException {
		try {
			if (!scriptO.get("seleniumVersion").equals("2")) {
				throw new IOException("Unsupported Selenium version: \"" + scriptO.get("seleniumVersion") + "\".");
			}
			if (scriptO.getInt("formatVersion") != 1) {
				throw new IOException("Unsupported Selenium script format version: \"" + scriptO.get("formatVersion") + "\".");
			}
			if (scriptO.has("type")) {
				String type = scriptO.getString("type");
				if (type.equals("suite")) {
					throw new SuiteException(scriptO);
				}
			}
			Script script = create();
			JSONArray stepsA = scriptO.getJSONArray("steps");
			for (int i = 0; i < stepsA.length(); i++) {
				JSONObject stepO = stepsA.getJSONObject(i);
				Step step = new Step(stepTypeFactory.getStepTypeOfName(stepO.getString("type")));
				step.negated = stepO.optBoolean("negated", false);
				script.steps.add(step);
				JSONArray keysA = stepO.names();
				for (int j = 0; j < keysA.length(); j++) {
					String key = keysA.getString(j);
					if (key.equals("type") || key.equals("negated")) {
						continue;
					}
					if (stepO.optJSONObject(key) != null) {
						step.locatorParams.put(key, new Locator(
								stepO.getJSONObject(key).getString("type"),
								stepO.getJSONObject(key).getString("value")));
					} else {
						step.stringParams.put(key, stepO.getString(key));
					}
				}
			}
			return script;
		} catch (SuiteException e) {
			throw e;
		} catch (Exception e) {
			throw new IOException("Could not parse script.", e);
		}
	}

	/**
	 * @param r A String pointing to a JSON stream describing a script.
	 * @return A script, ready to run.
	 * @throws IOException If anything goes wrong with interpreting the JSON, or
	 * with the Reader.
	 * @throws JSONException If the JSON can't be parsed.
	 */
	public Script parse(String jsonString) throws IOException, JSONException, SuiteException {
		return parse(new JSONObject(new JSONTokener(jsonString)));
	}

	/**
	 * @param r A Reader pointing to a JSON stream describing a script.
	 * @return A script, ready to run.
	 * @throws IOException If anything goes wrong with interpreting the JSON, or
	 * with the Reader.
	 * @throws JSONException If the JSON can't be parsed.
	 */
	public Script parse(Reader reader) throws IOException, JSONException, SuiteException {
		return parse(new JSONObject(new JSONTokener(reader)));
	}

	/**
	 * Exception which is thrown when the {@link IO#parse(org.json.JSONObject)}
	 * method detects that a Script file is a suite.
	 *
	 * @author Ross Rowe
	 */
	public static class SuiteException extends Exception {
		private List<String> paths = new ArrayList<String>();

		/**
		 * Constructs the exception, and populates the {@link #paths} by parsing
		 * the jsonObject.
		 *
		 * @param jsonObject A JSONObject describing a script.
		 * @throws org.json.JSONException if any errors occur retrieving the
		 * attributes from the jsonObject
		 */
		public SuiteException(JSONObject jsonObject) throws JSONException {
			JSONArray scriptLocations = jsonObject.getJSONArray("scripts");
			for (int i = 0; i < scriptLocations.length(); i++) {
				JSONObject script = scriptLocations.getJSONObject(i);
				String where = script.getString("where");
				//TODO handle 'where' types other than 'local'
				String path = script.getString("path");
				paths.add(path);
			}
		}

		public List<String> getPaths() {
			return paths;
		}
	}
}