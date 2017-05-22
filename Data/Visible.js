//- The Show type class represents those types which can be converted into a
//- human-readable String representation.
//-
//- While not required, it is recommended that for any expression `x`, the
//- string `x.show()` be executable JavaScript code which evaluates to the same
//- content as the expression `x`.
//-
//- ```haskell
//- import NativeString from "core:Native.Data.String:1.0.0"
//-
//- interface Show a where
//-     show :: () -> NativeString
//-     show () =
//-         JSON.stringify(this)
//-
//-     showDetail :: () -> NativeString
//-
//- Show ~> show () =
//-     JSON.stringify(this)
//- ```

function VisibleType() {
}


VisibleType.prototype.show = function () {
    return this.hasOwnProperty('content')
        ? JSON.stringify(this.content)
        : JSON.stringify(this);
};


module.exports = {
    Visible: new VisibleType(),
    VisibleType
};