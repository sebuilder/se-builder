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

package com.sebuilder.interpreter.webdriverfactory;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

public class Remote implements WebDriverFactory {
	/**
	 * @param config Key/value pairs treated as required capabilities, with the exception of:
	 *        <ul>
	 *			<li>url: Remote URL to connect to.</li>
	 *        </ul>
	 * @return A RemoteWebDriver.
	 */
	@Override
	public RemoteWebDriver make(HashMap<String, String> config) throws MalformedURLException {
		URL url = config.containsKey("url")
				? new URL(config.get("url"))
				: null;
		HashMap<String, String> caps = new HashMap<String, String>(config);
		caps.remove("url");
		return url == null
				? new RemoteWebDriver(new DesiredCapabilities(caps))
				: new RemoteWebDriver(url, new DesiredCapabilities(caps)); 
	}
}
