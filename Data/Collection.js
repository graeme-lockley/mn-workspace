//- This interface defines a Collection of a
//-
//- ```haskell
//- interface Collection a where
//-      ~Nil :: Maybe ()
//-      ~Cons :: Maybe a * (Collection a)
//-
//-      reduce :: (() -> b) -> (a -> Collection a -> b) -> b
//-      reduce fNil fCons = this match
//-          | Nil => fNil ()
//-          | Cons x xs => fCons x xs
//-
//-      foldl :: b -> (b -> a -> b) -> b
//-      foldl z f =
//-          reduce (constant z) (\x \xs -> xs.foldl (f z x) f)
//-
//-      size :: () -> Int
//-      size () = foldl 0 (\a \_ -> a + 1)
//- ```

function CollectionType() {
}


CollectionType.prototype.reduce = function (fNil) {
    return fCons => {
        const cons = this.unapplyCons();

        if (cons.isJust()) {
            const unboxed = cons.withDefault([]);

            return fCons(unboxed[0])(unboxed[1]);
        } else {
            return fNil();
        }
    }
};


CollectionType.prototype.foldl = function (z) {
    return f => {
        let result = z;
        let current = this;

        while (true) {
            const cons = current.unapplyCons();

            if (cons.isJust()) {
                const unboxedCons = cons.withDefault([]);

                result = f(result)(unboxedCons[0]);
                current = unboxedCons[1];
            } else {
                return result;
            }
        }
    }
};


module.exports = {
    Collection: new CollectionType(),
    CollectionType
};