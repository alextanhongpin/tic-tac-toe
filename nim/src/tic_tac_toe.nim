import sequtils, strutils, future, tables

type
    # Tuple struct holds the best move and best score of the minimax algorithm
    Result = tuple[move: int, score: float]

const
    combinations = @[[0,1,2], [3,4,5], [6,7,8]
                    ,[0,3,6], [1,4,7], [2,5,8]
                    ,[0,4,8], [2,4,6]
                    ]
    scores = {"x": 1
             ,"xx": 10
             ,"xxx": 100
             ,"o": -1
             ,"oo": -10
             ,"ooo": -100
             }.toTable

proc game_over(node: seq[string]): bool =
    let patterns = combinations.map(s => s.map(i => node[i]).foldl(a & b))
    result = "xxx" in patterns or "ooo" in patterns

proc evaluate(node: seq[string]): float =
    let final_score = combinations
        .map(s => s.map(i => node[i]).foldl(a & b))
        .map(s => scores.getOrDefault(s))
        .foldl(a + b)
    result = float(final_score)

proc minimax(node: var seq[string], depth: int, 
             maximizing_player: bool): Result =
    if depth == 0 or game_over(node):
        result = (move: -1, score: evaluate(node))
        return
    let 
        score = if maximizing_player: -Inf else: Inf
        label = if maximizing_player: "x" else: "o"

    result = (move: -1, score: score)
    for i, v in node.pairs:
        if not v.isNilOrEmpty:
            continue

        node[i] = label

        let (_, best_score) = minimax(node, depth - 1, not maximizing_player)

        if maximizing_player and best_score > result.score:
            result = (move: i, score: best_score)
        elif not maximizing_player and best_score < result.score:
            result = (move: i, score: best_score)

        node[i] = ""

proc alphabeta(node: var seq[string], depth: int, 
               alpha = -Inf, beta = Inf, 
               maximizing_player: bool): Result =
    if depth == 0 or game_over(node):
        result = (move: -1, score: evaluate(node))
        return
    var 
        value = if maximizing_player: -Inf else: Inf
        score = if maximizing_player: -Inf else: Inf
        label = if maximizing_player: "x" else: "o"
        alpha = alpha
        beta = beta

    result = (move: -1, score: score)
    for i, v in node.pairs:
        if not v.isNilOrEmpty:
            continue

        node[i] = label
        
        let (_, best_score) = alphabeta(node, depth - 1, alpha, beta, not maximizing_player)
        if maximizing_player:
            value = max(value, best_score)
            if value > alpha:
                alpha = value
                result = (move: i, score: alpha)
        else:
            value = min(value, best_score)
            if value < beta:
                beta = value
                result = (move: i, score: beta)

        node[i] = ""
        if alpha >= beta:
            break
        
proc must_str(s: string): string = 
    result = if s.isNilOrEmpty: "." else: s

proc pretty_print(node: seq[string]): void =
    echo must_str(node[0]), " | ", must_str(node[1]), " | ", must_str(node[2])
    echo must_str(node[3]), " | ", must_str(node[4]), " | ", must_str(node[5])
    echo must_str(node[6]), " | ", must_str(node[7]), " | ", must_str(node[8])

proc main() =
    var 
        node: seq[string] = @["", "", "","", "", "","", "", "",]
        move: string
        depth: int

    echo "You play as x."
    while not game_over(node):
        echo "Enter your move:"
        move = readLine(stdin)
        if not node[parseInt(move)].isNilOrEmpty:
            echo "This block is used. Try another move."
            pretty_print(node)
            continue
        node[parseInt(move)] = "x"

        pretty_print(node)

        depth = 9 - foldl(node, a & b).len
        # let (best_move, best_score) = minimax(node, depth, false)
        let (best_move, best_score) = alphabeta(node, depth, -Inf, Inf, false)
        echo "best move is ", best_move, " with score ", best_score
        node[best_move] = "o"

        pretty_print(node)

main()
