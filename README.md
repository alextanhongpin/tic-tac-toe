# Tic-Tac-Toe
A naive minmax algorithm implementation for tic-tac-toe in javascript.

There are several ways of solving tic-tac-toe:

1. Minimax Algorithm
2. Minimax with Alpha-Beta Pruning (a more efficient way of solving Tic-Tac-Toe with less search space)
3. Q-learning (Reinforcement learning)

This repo will contain tutorials on how to solve all three of them.


## TODO: Clean up codes to make them more readable and pseudo-code like


## Problems

Some of the issues faced when implementing `Q-learning` for tic-tac-toe is that it takes too long to propagate the values from the final to the first move because the outcome of the game is only known the end.

  Based on the paper [Learning to play Tic-tac-toe (2009) by Dwi H. Widyantoro and Yus G. Vembrina](http://ieeexplore.ieee.org/document/5254776/), ther are some modifications that needs to be taken into account. The bastract provided is as follow:

```
Abstract:
This paper reports our experiment on applying Q Learning algorithm for learning to play Tic-tac-toe. The original algorithm is modified by updating the Q value only when the game terminates, propagating the update process from the final move backward to the first move, and incorporating a new update rule. We evaluate the agent performance using full-board and partial-board representations. In this evaluation, the agent plays the tic-tac-toe game against human players. The evaluation results show that the performance of modified Q Learning algorithm with partial-board representation is comparable to that of human players.
```

The following modifications are done to improve the efficiency of the Q-learning model:
1. a non-negative reward is given at the end of the game (except for draw), and q-updates are not performed at every action step (which changes nothing), rather only after the game ends
2. the q-updates is performed by propagating its new value from the last move backwards to the first move
3. another update formula is incorporated that also considers the opponent point of view because of the turn-taking nature of two players
