builder.selenium2.io.addDerivedLangFormatter("Python", {
  name: "Python/unittest",
  start:
    "from selenium.webdriver.firefox.webdriver import WebDriver\n" +
    "from selenium.webdriver.common.action_chains import ActionChains\n" +
    "import time, unittest\n" +
    "\n" +
    "def is_alert_present(wd):\n" +
    "    try:\n" +
    "        wd.switch_to_alert().text\n" +
    "        return True\n" +
    "    except:\n" +
    "        return False\n" +
    "\n" +
    "class {scriptName}(unittest.TestCase):\n" +
    "    def setUp(self):\n" +
    "        self.wd = WebDriver()\n" +
    "        self.wd.implicitly_wait(60)\n" +
    "    \n" +
    "    def test_{scriptName}(self):\n" +
    "        success = True\n" +
    "        wd = self.wd\n",
  end:
    "        self.assertTrue(success)\n" +
    "    \n" +
    "    def tearDown(self):\n" +
    "        self.wd.quit()\n" +
    "\n" +
    "if __name__ == '__main__':\n" +
    "    unittest.main()\n",
  ind: "        ",
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs("{ind}self.assertNotEqual({cmp}, {getter})\n", getter);
    } else {
      return doSubs("{ind}self.assertEqual({cmp}, {getter})\n", getter);
    }
  },
  boolean_assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs("{ind}self.assertFalse({getter})\n", getter);
    } else {
      return doSubs("{ind}self.assertTrue({getter})\n", getter);
    }
  }
  /*assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return "        self.assertNotEqual(" + doSubs(getter.cmp) + ", " + doSubs(getter.getter) + ")\n";
    } else {
      return "        self.assertEqual(" + doSubs(getter.cmp) + ", " + doSubs(getter.getter) + ")\n";
    }
  },
  boolean_assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return "        self.assertFalse(" + doSubs(getter.getter) + ")\n";
    } else {
      return "        self.assertTrue(" + doSubs(getter.getter) + ")\n";
    }
  }*/
});