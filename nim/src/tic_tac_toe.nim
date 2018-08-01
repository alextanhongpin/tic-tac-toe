import sequtils

proc main() =
    echo @["hello", "world"].foldl(a & b)
#   echo "Enter your name:"
#   var name = readLine(stdin)
#   while name == "":
#     echo "What's your name?"
#     name = readLine(stdin)

main()

type
    # Tuple struct holds the best move and best score of the minimax algorithm
    Result = tuple[move: int, score: int]

var
    combinations = @[[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

proc gameOver(node): bool =
    let arrayString: seq[string] = node.map(proc(x: int): string = $x)
    let joined: string = foldl(arrayString, a & b)
    let isFilled = joined.len == 9
    return isFilled

proc minimax(node: seq[int], depth: int, maximizingPlayer: bool): Result =
    if depth == 0 or gameOver(node):
        return
    # Set the initial result
    result = (move: -1, score: -1)

## LEARN
# Joining strings
# @["hello", "world"].foldl(a & b)