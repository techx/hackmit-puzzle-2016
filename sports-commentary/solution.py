from z3 import *
from app import get_next_xorshift, PRECISION
import random

# Credit to: https://blog.securityevaluators.com/hacking-the-javascript-lottery-80cc437e3b7f#.fgagxw22v
# Symbolic execution of xs128p
def sym_xs128p(slvr, sym_state0, sym_state1, generated):
    s1 = sym_state0
    s0 = sym_state1
    s1 ^= (s1 << 23)
    s1 ^= LShR(s1, 17)
    s1 ^= s0
    s1 ^= LShR(s0, 26)
    sym_state0 = sym_state1
    sym_state1 = s1
    calc = (sym_state0 + sym_state1)

    condition = Bool('c%d' % int(generated * random.random()))
    # Firefox number
    impl = Implies(condition, (calc & ((1 << PRECISION) - 1)) == int(generated))
    slvr.add(impl)
    return sym_state0, sym_state1, [condition]

def main():
    array = input('gimme your array: ')
    print "solving..."
    array = array[-4:]
    ostate0, ostate1 = BitVecs('ostate0 ostate1', 64)
    sym_state0 = ostate0
    sym_state1 = ostate1
    slvr = Solver()
    conditions = []
    for number in array:
        sym_state0, sym_state1, ret_conditions = sym_xs128p(slvr, sym_state0, sym_state1, number)
        conditions.extend(ret_conditions)

    if slvr.check(conditions) == sat:
        m = slvr.model()
        state0 = m[ostate0].as_long()
        state1 = m[ostate1].as_long()
        state = (state0, state1)
        for i in range(len(array)):
            state, _ = get_next_xorshift(state)
        _, next = get_next_xorshift(state)
        print next
    else:
        print "wtf idk what happened"

if __name__ == "__main__":
    main()
