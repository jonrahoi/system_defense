# LeetCode: System Defense AKA **Captain Client**

*A game that teaches system design concepts*

## Overview

This game is made with the backdrop of existing tower defense games such as Plants vs. Zombies and Balloons Tower Defense. The most closely related game in existence is [MiniMetro](https://store.steampowered.com/app/287980/Mini_Metro/). The similarities arise from the structure of the games where the objective is not to destroy enemies but instead to strategically place objects in a way that will create and optimize a path/network for automated components to travel. In the case of MiniMetro, this manifests as connecting subway stations and if the system isn't optimized well enough, the passengers will get angry and the game is over. For this game, *System Defense*, the objects being placed are network system components and the paths are data transfer lines. The simulation consists of internet request objects sourcing from client objects that travel through the network of data processors that the user laid out and depending on the optimization of the system, a variable number of requests will be completed in the given time frame. If not enough requests are processed, then game over!

## Simple Implementation

This repo is meant to provide a simplified implementation of the game logic for use integrating with the game interface and combining modules within game logic
