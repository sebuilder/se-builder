import sys

if 3 < len(sys.argv) > 4:
    print "Finds untranslated strings.\nUsage: python find_translatables.py en.js <lang>.js [<annotated_output>.js]\nExample usage: python find_translatables.py ../seleniumbuilder/chrome/content/html/js/builder/i18n/en.js ../seleniumbuilder/chrome/content/html/js/builder/i18n/pt-br.js pt_br_todo.js"
    quit(1)

with open(sys.argv[1]) as en_f:
    en_lines = [l for l in en_f if l[:2] == "m."][::-1]

with open(sys.argv[2]) as l_f:
    l_lines = list(l_f)

def insert_pt(i):
    for last_line in en_lines[i:]:
        last_key = last_line.split(" ", 1)[0]
        for l_i in range(0, len(l_lines)):
            if l_lines[l_i].startswith(last_key):
                return l_i + 1
    return len(l_lines) + 1

# Go backwards through all lines to translate
for i in range(0, len(en_lines)):
    key, value = en_lines[i].split(" ", 1)
    if not any(l.startswith(key) for l in l_lines):
            l_lines.insert(insert_pt(i), en_lines[i][:-1] + " //TODO\n")

if len(sys.argv) == 4:
    with open(sys.argv[3], 'w') as f:
        for l in l_lines:
            f.write(l)
else:
    for l in l_lines:
        print l,