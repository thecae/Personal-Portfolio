// find card handler
export const findCard = (state, card) => {
  const checkPiles = (card) => {
    const piles = [
      state.pile1,
      state.pile2,
      state.pile3,
      state.pile4,
      state.pile5,
      state.pile6,
      state.pile7,
    ];
    for (let i = 0; i < piles.length; ++i) {
      const found = piles[i].find(
        (c) => card.suit === c.suit && card.value === c.value
      );
      if (found) return { card: found, pile: `pile${i + 1}` };
    }
    return null;
  };
  const checkStacks = (card) => {
    const stacks = [state.stack1, state.stack2, state.stack3, state.stack4];
    for (let i = 0; i < stacks.length; ++i) {
      if (stacks[i].length === 0) continue;
      const top = stacks[i].slice(-1)[0];
      if (top.suit === card.suit && top.value === card.value)
        return { card: top, pile: `stack${i + 1}` };
    }
    return null;
  };
  let find = checkPiles(card);
  if (find) return find;
  find = checkStacks(card);
  if (find) return find;
  if (
    state.draw.length > 0 &&
    card.suit === state.draw.slice(-1)[0].suit &&
    card.value === state.draw.slice(-1)[0].value
  )
    return { card: state.draw.slice(-1)[0], pile: "draw" };
  else return { card: state.discard.slice(-1)[0], pile: "discard" };
};

const hierarchy = [
  "ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "jack",
  "queen",
  "king",
];

const same = (one, two) => one.suit === two.suit && one.value === two.value;

// gets last card of a pile/stack
const last = (pile) => {
  try {
    return pile.slice(-1)[0];
  } catch (err) {
    return null;
  }
};

const oppositeSuit = (suit) => {
  // get opposite suit
  const reds = ["diamonds", "hearts"];
  const blacks = ["spades", "clubs"];
  if (reds.indexOf(suit) !== -1) return blacks;
  else return reds;
};

const gameContinue = (state) => {
  const top = (pile) => {
    const flipped = pile.find((card) => card.up);
    if (flipped) return flipped;
  };
  // finds usable cards for piles (-1) and stacks (+1)
  const usableCard = (card, offset) => {
    if (!card) {
      return offset < 0
        ? [
            {
              suit: "spades",
              value: "king",
            },
            {
              suit: "hearts",
              value: "king",
            },
            {
              suit: "diamonds",
              value: "king",
            },
            {
              suit: "clubs",
              value: "king",
            },
          ]
        : [];
    }

    const suit = oppositeSuit(card.suit);

    // get next num
    if (offset > 0) {
      return [
        {
          suit: card.suit,
          value: hierarchy[hierarchy.indexOf(card.value) + offset],
        },
      ];
    } else {
      if (card.value == "ace") return [];

      // make all combinations
      return suit.map((s) => ({
        suit: s,
        value: hierarchy[hierarchy.indexOf(card.value) + offset],
      }));
    }
  };
  const intersect = (list1, list2) => {
    return list1.filter((p) => list2.some((s) => p && s && same(p, s)));
  };

  // get our list of usable cards on the piles
  const lastsPile = [];
  Object.keys(state).forEach((k) => {
    if (k.startsWith("pile")) lastsPile.push(last(state[k]));
  });
  let usablePile = lastsPile.map((l) => usableCard(l, -1)).flat();

  // get list of usable cards on the stack
  const lastsStack = [];
  Object.keys(state).forEach((k) => {
    if (k.startsWith("stack")) lastsStack.push(last(state[k]));
  });
  let usableStack = lastsStack.map((l) => usableCard(l, 1)).flat();
  // add aces if empty
  if (usableStack.length !== 4) {
    // figure out which suits are in the stack
    const suits = [];
    Object.keys(state).forEach((k) => {
      if (k.startsWith("stack")) {
        if (state[k].length === 0) return;
        suits.push(state[k][0].suit);
      }
    });
    const all = ["spades", "hearts", "diamonds", "clubs"];
    const diff = all.filter((x) => !suits.includes(x));
    diff.forEach((d) => {
      usableStack.push({ suit: d, value: "ace" });
    });
  }

  // find the intersection of available and usable cards
  const available = state.draw.concat(state.discard);
  const intDeckPiles = intersect(usablePile.concat(usableStack), available);

  // check if there are movable cards from pile to stack
  const intPileStack = intersect(lastsPile, usableStack);

  // check if there are movable cards between piles
  const topPiles = [];
  Object.keys(state).forEach((k) => {
    if (k.startsWith("pile")) topPiles.push(top(state[k]));
  });
  let intPilePile = intersect(topPiles, usablePile);
  // a king on an empty pile can't be moved to another
  let tmp = [];
  intPilePile.forEach((c) => {
    if (c.value === "king") {
      const pile = findCard(state, c).pile;
      if (!same(state[pile][0], c)) tmp.push(c);
    } else tmp.push(c);
  });
  intPilePile = tmp;

  return { pp: intPilePile, ps: intPileStack, dp: intDeckPiles };
};

export const getMove = (state) => {
  // get movement lists
  const { pp, ps, dp } = gameContinue(state);

  // gets destination pile for a card
  const getDestination = (card) => {
    // get options for dest
    const lastsPile = {};
    Object.keys(state).forEach((k) => {
      if (k.startsWith("pile")) lastsPile[k] = last(state[k]);
    });
    const os = oppositeSuit(card.suit);
    let dest;
    Object.keys(lastsPile).forEach((k) => {
      if (
        lastsPile[k] &&
        lastsPile[k].value === hierarchy[hierarchy.indexOf(card.value) + 1] &&
        os.indexOf(lastsPile[k].suit) !== -1
      ) {
        dest = k;
        return;
      }
    });
    if (!dest && card.value === "king") {
      // it's a king: find the first available pile
      Object.keys(state).forEach((k) => {
        if (k.startsWith("pile")) {
          if (state[k].length === 0) {
            dest = k;
            return;
          }
        }
      });
    }
    if (!dest && card.value === "ace") {
      // it's an ace: find the first available stack
      Object.keys(state).forEach((k) => {
        if (k.startsWith("stack")) {
          if (state[k].length === 0) {
            dest = k;
            return;
          }
        }
      });
    }
    if (!dest) {
      // attempt a move to a stack
      Object.keys(state).forEach((k) => {
        if (k.startsWith("stack")) {
          if (state[k].length > 0 && state[k][0].suit === card.suit) {
            dest = k;
            return;
          }
        }
      });
    }
    return dest;
  };

  // prioritize p->s, p->p, d->p
  if (ps.length > 0) {
    let src = findCard(state, ps[0]);
    let dest;
    Object.keys(state).forEach((k) => {
      if (k.startsWith("stack")) {
        if (state[k].length > 0 && state[k][0].suit === src.card.suit) {
          dest = k;
          return;
        }
      }
    });
    // dest is undefined if the card is an ace
    if (!dest) {
      // find the first available stack
      Object.keys(state).forEach((k) => {
        if (k.startsWith("stack")) {
          if (state[k].length === 0) {
            dest = k;
            return;
          }
        }
      });
    }
    return { cards: [ps[0]], src: src.pile, dest: dest };
  } else if (pp.length > 0) {
    let src = findCard(state, pp[0]);
    let cards = [];
    // get all the cards to move
    Object.keys(state).forEach((k) => {
      if (k.startsWith("pile")) {
        const found = state[k].find((c) => same(c, src.card));
        if (found)
          cards = cards.concat(state[k].slice(state[k].indexOf(found)));
      }
    });
    let dest = getDestination(src.card);
    return { cards: cards, src: src.pile, dest: dest };
  } else if (dp.length > 0) {
    // is the top in deck-pile, move it, else draw
    const top = last(state.discard);
    if (!top) return { src: "draw", dest: "discard" };
    let dest = getDestination(top);

    if (dp.find((c) => same(c, top)))
      return { cards: [top], src: "discard", dest: dest };
    return { src: "draw", dest: "discard" };
  } else return null;
};
