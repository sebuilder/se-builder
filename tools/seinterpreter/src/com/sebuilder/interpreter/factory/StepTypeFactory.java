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

import com.sebuilder.interpreter.*;
import java.util.HashMap;

/**
 * Factory to create a StepType objects from the step name. Each step can be
 * loaded from a settable primary package or a secondary package. Thanks to this
 * mechanism, steps can be easily overridden when needed.
 *
 * @author jkowalczyk
 */
public class StepTypeFactory {
	public static final String DEFAULT_PACKAGE = "com.sebuilder.interpreter.steptype";

	/**
	 * Primary package used to load stepType instances
	 */
	private String primaryPackage = DEFAULT_PACKAGE;
	/**
	 * Secondary package used to load stepType instances when first package is
	 * not found
	 */
	private String secondaryPackage = DEFAULT_PACKAGE;

	public String getPrimaryPackage() { return primaryPackage;}
	public void setPrimaryPackage(String primaryPackage) { this.primaryPackage = primaryPackage; }

	public String getSecondaryPackage() { return secondaryPackage; }
	public void setSecondaryPackage(String secondaryPackage) { this.secondaryPackage = secondaryPackage; }

	/**
	 * Mapping of the names of step types to their implementing classes, lazily
	 * loaded through reflection. StepType classes must be either in the first
	 * package either in the second one and their name must be the capitalized
	 * name of their type. For example, the class for "get" is at
	 * com.sebuilder.interpreter.steptype.Get.
	 *
	 * Assert/Verify/WaitFor/Store steps use "Getter" objects that encapsulate
	 * how to get the value they are about. Getters should be named e.g "Title"
	 * for "verifyTitle" and also be in the com.sebuilder.interpreter.steptype
	 * package.
	 */
	private final HashMap<String, StepType> typesMap = new HashMap<String, StepType>();

	/**
	 *
	 * @param name
	 * @return a stepType instance for a given name
	 */
	public StepType getStepTypeOfName(String name) {
		try {
			if (!typesMap.containsKey(name)) {
				String className = name.substring(0, 1).toUpperCase() + name.substring(1);
				boolean rawStepType = true;
				if (name.startsWith("assert")) {
					className = className.substring("assert".length());
					rawStepType = false;
				}
				if (name.startsWith("verify")) {
					className = className.substring("verify".length());
					rawStepType = false;
				}
				if (name.startsWith("waitFor")) {
					className = className.substring("waitFor".length());
					rawStepType = false;
				}
				if (name.startsWith("store") && !name.equals("store")) {
					className = className.substring("store".length());
					rawStepType = false;
				}
				Class c = null;
				try {
					c = Class.forName(primaryPackage + "." + className);
				} catch (ClassNotFoundException cnfe) {
					try {
						if (secondaryPackage != null) {
							c = Class.forName(secondaryPackage + "." + className);
						}
					} catch (ClassNotFoundException cnfe2) {
						throw new RuntimeException("No implementation class for step type \"" + name + "\" could be found.", cnfe);
					}
				}
				if (c != null) {
					try {
						Object o = c.newInstance();
						if (name.startsWith("assert")) {
							typesMap.put(name, new Assert((Getter) o));
						} else if (name.startsWith("verify")) {
							typesMap.put(name, new Verify((Getter) o));
						} else if (name.startsWith("waitFor")) {
							typesMap.put(name, new WaitFor((Getter) o));
						} else if (name.startsWith("store") && !name.equals("store")) {
							typesMap.put(name, new Store((Getter) o));
						} else {
							typesMap.put(name, (StepType) o);
						}
					} catch (InstantiationException ie) {
						throw new RuntimeException(c.getName() + " could not be instantiated.", ie);
					} catch (IllegalAccessException iae) {
						throw new RuntimeException(c.getName() + " could not be instantiated.", iae);
					} catch (ClassCastException cce) {
						throw new RuntimeException(c.getName() + " does not extend "
								+ (rawStepType ? "StepType" : "Getter") + ".", cce);
					}
				}
			}

			return typesMap.get(name);
		} catch (Exception e) {
			throw new RuntimeException("Step type \"" + name + "\" is not implemented.", e);
		}
	}
}