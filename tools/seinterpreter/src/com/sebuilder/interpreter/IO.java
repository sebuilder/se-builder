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

import com.sebuilder.interpreter.factory.ScriptFactory;
import com.sebuilder.interpreter.factory.ScriptFactory.SuiteException;
import java.io.IOException;
import java.io.Reader;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;

/**
 * Utilities for reading scripts.
 *
 * @author zarkonnen
 */
public final class IO {
	/**
	 * The script factory instance
	 */
	private static final ScriptFactory SCRIPT_F = new ScriptFactory();

	/**
	 * Private constructor : Hide Utility Class Constructor
	 */
	private IO() {}

	/**
	 * @param r A Reader pointing to a JSON stream describing a script.
	 * @return A script, ready to run.
	 * @throws IOException If anything goes wrong with interpreting the JSON, or
	 * with the Reader.
	 * @throws JSONException If the JSON can't be parsed.
	 * @throws SuiteException If the JSON is a suite.
	 */
	public static Script read(Reader r) throws IOException, JSONException, SuiteException {
		return SCRIPT_F.parse(new JSONObject(new JSONTokener(r)));
	}

	/**
	 * @param r A String pointing to a JSON stream describing a script.
	 * @return A script, ready to run.
	 * @throws IOException If anything goes wrong with interpreting the JSON, or
	 * with the Reader.
	 * @throws JSONException If the JSON can't be parsed.
	 * @throws SuiteException If the JSON is a suite.
	 */
	public static Script read(String s) throws IOException, JSONException, SuiteException {
		return SCRIPT_F.parse(new JSONObject(new JSONTokener(s)));
	}
}