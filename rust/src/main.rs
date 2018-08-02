use std::{cmp, io};

fn main() {
    let mut state = vec!["", "", "", "", "", "", "", "", ""];
    loop {
        println!("Enter your move:");
        let mut choice = String::new();

        io::stdin()
            .read_line(&mut choice)
            .expect("failed to read line");

        let choice: usize = match choice.trim().parse() {
            Ok(num) => num,
            Err(_) => continue,
        };
        if !state[choice].is_empty() {
            println!("move is choosen");
            continue;
        }
        state[choice] = "x";
        println!("{:?}", state);

        println!("Your move is {}", choice);
        // let (best_move, best_score) = minimax(&state, compute_depth(&state), false);
        let (best_move, best_score) =
            alphabeta(&state, isize::min_value(), isize::max_value(), false);
        println!("best_move is {} with best_score {}", best_move, best_score);
        state[best_move] = "o";

        println!(
            "{}|{}|{}\n{}|{}|{}\n{}|{}|{}",
            get_or_default(&state, 0),
            get_or_default(&state, 1),
            get_or_default(&state, 2),
            get_or_default(&state, 3),
            get_or_default(&state, 4),
            get_or_default(&state, 5),
            get_or_default(&state, 6),
            get_or_default(&state, 7),
            get_or_default(&state, 8)
        );

        if game_over(&state) {
            break;
        }
    }
}

fn get_or_default(state: &Vec<&str>, index: usize) -> String {
    match &state.get(index) {
        Some(&s) => match s.is_empty() {
            true => String::from("."),
            _ => s.to_string(),
        },
        _ => String::from("."),
    }
}

fn compute_depth(state: &Vec<&str>) -> usize {
    9 - state.join("").len()
}

fn game_over(state: &Vec<&str>) -> bool {
    let combinations = vec![
        vec![0, 1, 2],
        vec![3, 4, 5],
        vec![6, 7, 8],
        vec![0, 3, 6],
        vec![1, 4, 7],
        vec![2, 5, 8],
        vec![0, 4, 8],
        vec![2, 4, 6],
    ];
    for c in combinations {
        let combination: Vec<&str> = c.iter().map(|i| state[*i as usize]).collect();
        let pattern: &str = &combination.join("");
        match pattern {
            "xxx" => return true,
            "ooo" => return true,
            _ => continue,
        }
    }
    state.join("").len() == 9
}

fn evaluate(state: &Vec<&str>) -> isize {
    let combinations = vec![
        vec![0, 1, 2],
        vec![3, 4, 5],
        vec![6, 7, 8],
        vec![0, 3, 6],
        vec![1, 4, 7],
        vec![2, 5, 8],
        vec![0, 4, 8],
        vec![2, 4, 6],
    ];
    let mut scores: Vec<isize> = vec![];
    for c in combinations {
        let combination: Vec<&str> = c.iter().map(|i| state[*i as usize]).collect();
        let pattern: &str = &combination.join("");
        let value = match pattern {
            "xxx" => 100,
            "ooo" => -100,
            "xx" => 10,
            "oo" => -10,
            "x" => 1,
            "o" => -1,
            _ => 0,
        };
        scores.push(value);
    }
    scores.iter().fold(0, |sum, val| sum + val)
}

fn minimax(state: &Vec<&str>, depth: usize, maximizing_player: bool) -> (usize, isize) {
    if depth == 0 || game_over(&state) {
        return (0, evaluate(&state));
    };

    let mut best_score = if maximizing_player {
        isize::min_value()
    } else {
        isize::max_value()
    };
    let mut best_move = 0;

    for (i, v) in state.iter().enumerate() {
        if !v.is_empty() {
            continue;
        }
        let label = if maximizing_player { "x" } else { "o" };
        let mut state = state.clone();
        state[i] = label;
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
    }
    (best_move, best_score)
}

fn alphabeta(
    state: &Vec<&str>,
    alpha: isize,
    beta: isize,
    maximizing_player: bool,
) -> (usize, isize) {
    if compute_depth(&state) == 0 || game_over(&state) {
        return (0, evaluate(&state));
    };
    let mut best_score = match maximizing_player {
        true => isize::min_value(),
        false => isize::max_value(),
    };
    let mut best_move = 0;
    let mut alpha = alpha;
    let mut beta = beta;

    for (i, v) in state.iter().enumerate() {
        if !v.is_empty() {
            continue;
        }
        let label = if maximizing_player { "x" } else { "o" };
        let mut state = state.clone();
        state[i] = label;
        let (_, score) = alphabeta(&state, alpha, beta, !maximizing_player);
        if maximizing_player {
            best_score = cmp::max(best_score, score);
            if best_score > alpha {
                alpha = best_score;
                best_move = i;
            }
        } else {
            best_score = cmp::min(best_score, score);
            if best_score < beta {
                beta = best_score;
                best_move = i;
            }
        }
        if alpha >= beta {
            break;
        }
    }
    (best_move, best_score)
}
