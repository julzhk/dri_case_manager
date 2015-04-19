__author__ = 'julian.harley'
names = ['Cecilia', 'Lise', 'Marie']
letters = [len(n) for n in names]


longest_name = None
max_letters = 0

for i in range(len(names)):
    count = letters[i]
    if count > max_letters:
        longest_name = names[i]
        max_letters = count
print(longest_name)

max_letters = 0
for name, count in zip(names, letters):
    if count > max_letters:
        longest_name = name
        max_letters = count

print max_letters

max_letters = 0
for i, name in enumerate(names):
    count = letters[i]
    if count > max_letters:
        longest_name = name
        max_letters = count
print max_letters

for i in range(3):
    print('Loop %d' % i)
else:
    print('Else block!')