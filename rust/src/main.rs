

use std::{io,f64};


fn main() {
    println!("Hello, world!");

    let mut state = vec!["", "", "","", "", "","", "", ""];
    loop {
        println!("Enter your move:");
        let mut choice = String::new();

        io::stdin().read_line(&mut choice)
            .expect("failed to read line");
        
        let choice: usize = match choice.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
        state[choice] = "x";
        println!("{:?}", state);

        println!("Your move is {}", choice);
        println!("minimax is {:?}", minimax(&state, 9, false));

        if game_over(&state) {
            break;
        }
    }
}

fn game_over(state: &Vec<&str>) -> bool {
   let combinations = vec![
        vec![0,1,2], vec![3,4,5], vec![6,7,8], 
        vec![0,3,6], vec![1,4,7], vec![2,5,8],
        vec![0,4,8], vec![2,4,6]
    ];
    for c in combinations {
        let combination: Vec<&str> = c.iter().map(|i| state[*i as usize]).collect();
        let pattern: &str = &combination.join("");
        match pattern {
            "xxx" => return true,
            "ooo" => return true,
            _ => continue
        }
    };
    state.join("").len() == 9
}

fn minimax(
    state: &Vec<&str>, 
    depth: usize, 
    maximizing_player: bool
) -> (usize, f64) {
    let mut state = state.clone();
    // (move, score)
    if depth == 0 || game_over(&state) {
        return (0, -1.0)
    };
    
    let mut best_score = if maximizing_player { -f64::INFINITY } else { f64::INFINITY };
    let mut best_move = 0;

    for (i, v) in state.iter_mut().enumerate() {
        if !v.is_empty() {
            continue
        }
        let label = if maximizing_player { "x" } else { "o" };

        *v = label;
        let mut state = &state.clone();
        let (_, score) = minimax(&state, depth - 1, !maximizing_player); 
        if maximizing_player {
            if score > best_score {
                best_score = score;
                best_move = i;
            }
        } else {
            if score < best_score {
                best_score = score;
                best_move = i;
            }
        }
        *v = "";
    };
    (best_move, best_score)
}