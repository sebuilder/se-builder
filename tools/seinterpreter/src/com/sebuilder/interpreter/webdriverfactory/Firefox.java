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

import java.io.File;
import java.util.HashMap;
import org.openqa.selenium.firefox.FirefoxBinary;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxProfile;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

public class Firefox implements WebDriverFactory {
	/**
	 * @param config Key/value pairs treated as required capabilities, with the exception of:
	 *        <ul>
	 *			<li>binary: path to Firefox binary to use</li>
	 *          <li>profile: path to Firefox profile to use</li>
	 *        </ul>
	 * @return A FirefoxDriver.
	 */
	@Override
	public RemoteWebDriver make(HashMap<String, String> config) {
		FirefoxBinary fb = config.containsKey("binary")
				? new FirefoxBinary(new File(config.get("binary")))
				: new FirefoxBinary();
		FirefoxProfile fp = config.containsKey("profile")
				? new FirefoxProfile(new File(config.get("profile")))
				: new FirefoxProfile();
		HashMap<String, String> caps = new HashMap<String, String>(config);
		caps.remove("binary");
		caps.remove("profile");
		return new FirefoxDriver(fb, fp, new DesiredCapabilities(caps));
	}
}
