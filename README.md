# LeetCode: System Defense AKA **Captain Client**

*A game that teaches system design concepts*

## Overview

This is a prototype for the system defense game. It includes a `Node.js` & `Fastify.js` app that utilizes[`Kaboom.js`](https://kaboomjs.com/)to provide a user interface. The current status is a homescreen with a "play" button that takes the user to a new screen with a templated "level". There is also a test panel that can be overlayed on the screen that provides simple buttons corresponding to more complex actions to be used during development. There is also an operational timer that is controlled by buttons in the status bar. For proof of concept, the timer decrements the displayed clock as well as increments the user score and money with every interval. The speedup button is cyclical with the initial speed being 1x then the interval will be cut in half and the speed becomes 2x with another click and finally the initial interval length is cut into a third and the speed becomes 3x. After the speedup is at 3x, if clicked again, the speedup button will return the game speed to 1x.

**NOTE**: there are many features that are either missing entirely or only print out console information. It is helpful to have the browser's *JavaScript Console* open when playing around with the app to see what information is being exchanged under the hood.

## Quick Start

*Prerequisite is having Node.js >=12.0.0 installed in the environment. For more information please see the [Node.js download page](https://nodejs.org/en/download/)*

1. `cd <whatever directory to store the code>`
2. `git clone https://github.com/jonrahoi/system_defense.git`
3. `cd system_defense`
4. `git checkout peterg/interface_dev`
5. `npm install`
6. `npm start`
7. Visit the address provided in the output of the above command (will most likely be **127.0.0.1:3000**)

