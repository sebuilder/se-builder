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

import com.sebuilder.interpreter.webdriverfactory.Firefox;
import com.sebuilder.interpreter.webdriverfactory.WebDriverFactory;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.PriorityQueue;

/**
 * An interpreter for Builder JSON tests. Given one or more JSON script files, it plays them back
 * using the Java WebDriver bindings.
 * @author zarkonnen
 */
public class SeInterpreter {
	public static WebDriverFactory DEFAULT_DRIVER_FACTORY = new Firefox();
	
	public static void main(String[] args) {
		if (args.length == 0) {
			System.out.println("Usage: [--driver=<drivername] [--driver.<configkey>=<configvalue>...] <script path>...");
			System.exit(0);
		}
		
		Log log = LogFactory.getFactory().getInstance(SeInterpreter.class);
		
		WebDriverFactory wdf = DEFAULT_DRIVER_FACTORY;
		ArrayList<String> paths = new ArrayList<String>();
		HashMap<String, String> driverConfig = new HashMap<String, String>();
		for (String s : args) {
			if (s.startsWith("--driver")) {
				String[] kv = s.split("=", 2);
				if (kv.length < 2) {
					log.fatal("Driver configuration option \"" + s + "\" is not of the form \"--driver=<name>\" or \"--driver.<key>=<value\".");
					System.exit(1);
				}
				if (s.startsWith("--driver.")) {
					driverConfig.put(kv[0].substring("--driver.".length()), kv[1]);
				} else {
					try {
						wdf = (WebDriverFactory) Class.forName("com.sebuilder.interpreter.webdriverfactory." + kv[1]).newInstance();
					} catch (ClassNotFoundException e) {
						log.fatal("Unknown WebDriverFactory: " + "com.sebuilder.interpreter.webdriverfactory." + kv[1], e);
					} catch (InstantiationException e) {
						log.fatal("Could not instantiate WebDriverFactory " + "com.sebuilder.interpreter.webdriverfactory." + kv[1], e);
					} catch (IllegalAccessException e) {
						log.fatal("Could not instantiate WebDriverFactory " + "com.sebuilder.interpreter.webdriverfactory." + kv[1], e);
					}
				}
			} else {
				paths.add(s);
			}
		}
		
		if (paths.isEmpty()) {
			log.info("Configuration successful but no paths to scripts specified. Exiting.");
			System.exit(0);
		}
		
		try {
			//use a queue instead of iterating over the paths, as we may be adding to the paths if the script file is of type 'suite'
            PriorityQueue<String> queue = new PriorityQueue<String>(paths);
            while (queue.size() != 0) {
                String s = queue.remove();
				File f = new File(s);
				if (!f.exists() || f.isDirectory()) {
					throw new RuntimeException("The file " + f + " does not exist!");
				}
				BufferedReader br = null;
				try {
					Script script = IO.read(br = new BufferedReader(new InputStreamReader(new FileInputStream(f), "UTF-8")));
					HashMap<String, String> cfg = new HashMap<String, String>(driverConfig);
					if (!cfg.containsKey("name")) {
						cfg.put("name", f.getName());
					}
					try {
						if (script.run(log, wdf, cfg)) {
							log.info(s + " succeeded");
						} else {
							log.info(s + " failed");
						}
					} catch (Exception e) {
						log.info(s + " failed", e);
					}
				} catch (IO.SuiteException e) {
                    queue.addAll(e.getPaths());
                }
                finally {
					if (br != null) { br.close(); }
				}
			}
		} catch (Exception e) {
			log.fatal("Run error.", e);
			System.exit(1);
		}
	}	
}
