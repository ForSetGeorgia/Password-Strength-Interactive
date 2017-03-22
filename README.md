# Password-Strength-Interactive
Allow users to learn that using multiple character sets and making passwords longer makes the brute force approach of cracking a password to take a long time.

## Installation Steps
#### Prerequisites
  - node
  - npm
#### Installation
- git clone
- npm install
- npm run dev

Mockup of Character Processing

Upper Lower Number Symbol Letter Upper1 Lower1 Symbols1

by default use latin if other letter appear ex: german than we will go through all letters and find out
if all other letter are in german if yes change 1 block, if another alphabets letter than ?

block should be without alphabets

if not latin group than get alphabet with greater letter amount and sort alphabetically

give ability to change language


Ä german
Ó czech hungarian polish

case:
0 letter
1 upper
2 lower

00-1F(0-31) control
20-7F(32-127) basic latin
61-7A(97-122) lower
41-5A(65-90) upper
30-39(48-57) number
80-FF(128-255) latin supplement
