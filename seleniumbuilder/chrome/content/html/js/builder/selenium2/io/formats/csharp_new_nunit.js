builder.selenium2.io.addDerivedLangFormatter("C#", {
  name: "C#/NUnit",
  start:
    "using OpenQA.Selenium;\n" +
    "using OpenQA.Selenium.Remote;\n" +
    "using OpenQA.Selenium.Support.UI;\n"+
    "using System;\n" +
    "using NUnit.Framework;\n" +
    "\n" +
    "namespace se_builder {\n" +
    "  [TestFixture()]\n" +
    "  public class {scriptName} {\n" +
    "    [Test()]\n" +
    "    public void TestCase() {\n" +
	  "      IWebDriver wd = new RemoteWebDriver(DesiredCapabilities.Firefox());\n" +
	  "      try {\n",
  end:
    "      } finally { wd.Quit(); }\n" +
    "    }\n" +
    "  }\n}\n",
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return "        Assert.AreNotEqual(" + doSubs(getter.getter) + ", " + doSubs(getter.cmp) + ");\n";
    } else {
      return "        Assert.AreEqual(" + doSubs(getter.getter) + ", " + doSubs(getter.cmp) + ");\n";
    }
  },
  boolean_assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return "        Assert.IsFalse(" + doSubs(getter.getter) + ");\n";
    } else {
      return "        Assert.IsTrue(" + doSubs(getter.getter) + ");\n";
    }
  }
});