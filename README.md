# mn-workspace



### Haskell Base Classes

```haskell
class  Eq a  where  
        (==), (/=)  ::  a -> a -> Bool  
 
        x /= y  = not (x == y)  
        x == y  = not (x /= y)
```

```haskell
class  (Eq a) => Ord a  where  
    compare              :: a -> a -> Ordering  
    (<), (<=), (>=), (>) :: a -> a -> Bool  
    max, min             :: a -> a -> a  
```

```haskell
class  Show a  where  
    showsPrec :: Int -> a -> ShowS  
    show      :: a -> String  
    showList  :: [a] -> ShowS 
```

```haskell
class  Enum a  where  
    succ, pred     :: a -> a  
    toEnum         :: Int -> a  
    fromEnum       :: a -> Int  
    enumFrom       :: a -> [a]            -- [n..]  
    enumFromThen   :: a -> a -> [a]       -- [n,n'..]  
    enumFromTo     :: a -> a -> [a]       -- [n..m]  
    enumFromThenTo :: a -> a -> a -> [a]  -- [n,n'..m]  
```

```haskell
class Bounded a where
    minBound, maxBound :: a
```

```haskell
class  Functor f  where  
    fmap    :: (a -> b) -> f a -> f b
```

```haskell
class  Monad m  where  
    (>>=)   :: m a -> (a -> m b) -> m b  
    (>>)    :: m a -> m b -> m b  
    return  :: a -> m a  
    fail    :: String -> m a 
```


### mn Base Classes

```haskell
class  Eq a  where  
        (==), (!=)  ::  a -> Bool  
```

Note the following:

* The Haskell not-equal `(/=)` has been replaced with `(!=)`.


```haskell
class  (Eq a) => Ord a  where  
    compare              :: a -> Ordering  
    (<), (<=), (>=), (>) :: a -> Bool  
    max, min             :: a -> a  
```

```haskell
class  Show a  where  
    show      :: a -> String  
```

```haskell
class  Enum a  where  
    succ, pred     :: () -> Maybe a  
```

Note the following:

* `succ` and `pred` return a `Maybe` to deal with the scenario where an attempt is made invoke `succ` against the 
  maximum value or `pred` against minimum value.
* The method `toEnum` has been removed as this method only makes sense when dealing with instances that can be mapped 
  onto an Int.
* The remaining methods have been removed as they do not operate over instances by rather deal with the class as a 
  whole.
  

```haskell
class Bounded a where
    minBound, maxBound :: () -> a
```

### Haskell Numeric Classes

```haskell
class  (Eq a, Show a) => Num a  where  
    (+), (-), (⋆)  :: a -> a -> a  
    negate         :: a -> a  
    abs, signum    :: a -> a  
    fromInteger    :: Integer -> a  
```

```haskell 
class  (Num a, Ord a) => Real a  where  
    toRational ::  a -> Rational  
```

```haskell
class  (Real a, Enum a) => Integral a  where  
    quot, rem, div, mod :: a -> a -> a  
    quotRem, divMod     :: a -> a -> (a,a)  
    toInteger           :: a -> Integer  
```

```haskell
class  (Num a) => Fractional a  where  
    (/)          :: a -> a -> a  
    recip        :: a -> a  
    fromRational :: Rational -> a  
```

```haskell
class  (Fractional a) => Floating a  where  
    pi                  :: a  
    exp, log, sqrt      :: a -> a  
    (⋆⋆), logBase       :: a -> a -> a  
    sin, cos, tan       :: a -> a  
    asin, acos, atan    :: a -> a  
    sinh, cosh, tanh    :: a -> a  
    asinh, acosh, atanh :: a -> a
```

```haskell
class  (Real a, Fractional a) => RealFrac a  where  
    properFraction   :: (Integral b) => a -> (b,a)  
    truncate, round  :: (Integral b) => a -> b  
    ceiling, floor   :: (Integral b) => a -> b  
```

```haskell
class  (RealFrac a, Floating a) => RealFloat a  where  
    floatRadix          :: a -> Integer  
    floatDigits         :: a -> Int  
    floatRange          :: a -> (Int,Int)  
    decodeFloat         :: a -> (Integer,Int)  
    encodeFloat         :: Integer -> Int -> a  
    exponent            :: a -> Int  
    significand         :: a -> a  
    scaleFloat          :: Int -> a -> a  
    isNaN, isInfinite, isDenormalized, isNegativeZero, isIEEE  
                        :: a -> Bool  
    atan2               :: a -> a -> a  
```
 
 
### mn Numeric Data-Types
 
Will use a similar hierarchy as provided by Haskell but with the following thinking:
 
* There will be 3 native data-types - Float, Int and Char.  These data-types correspond to the native JavaScript 
 `number` which is exactly what underscores `Float` whilst `Int` and `Char` are subtypes.
* `Int` corresponds to a signed 32 bit integer
* `Char` corresponds to a UTF-8 character code and, although has numeric properties, is not considered a numeric is it 
  makes no sense to add two characters together.

The following classes represent the intention of what I'm trying to do:

```haskell
class  (Eq a, Show a) => Num a  where  
    (+), (-), (⋆)  :: a -> a  
    negate         :: () -> a  
    abs, signum    :: () -> a
    toNative       :: () -> b
```

Note the following:

* The first argument has been dropped because I'm using instances which contain a boxed value.
* There is no `(/)` operation as this operation is dependent on the actual type.
* The `fromInteger` has been removed as this function is a constructor and contained within the data-type's package.
* The method `toNative` has been included to convert an instance into a native representation.  This method is used to
  unbox the value so that it can be re-boxed when using different versions of a package.
  
  
```haskell
class  (Num a, Ord a, Enum a) => Integer a  where  
    quot, rem, div, mod :: a -> Maybe a  
    quotRem, divMod     :: a -> Maybe (a * a)  
```

Note the following:

* This class represents all numbers that can be expressed without a fractional component.
* The division centered operations all return a Maybe to cater for the scenario where an attempt is used to divide by 0.
* The type `a * a` signifies a tuple.


```haskell
class  (Num a, Ord a) => Real a  where  
    exp, log, sqrt      :: () -> a  
    log                 :: () -> Maybe a  
    logBase             :: a -> Maybe a  
    (⋆⋆)                :: a -> a  
    sin, cos, tan       :: () -> a  
    asin, acos, atan    :: () -> a  
    sinh, cosh, tanh    :: () -> a  
    asinh, acosh, atanh :: () -> a
```

Note the following:

* `log` and `logBase` both return a `Maybe` to cater for an attempt to get the logarithm of 0.
* Division operations are not included because, depending of the implementation, there will be different strategies for
  performing division.  For example floating point numbers will return infinity when divided by (almost) 0.0 whilst a 
  rational number or BigNum implementation would return a Maybe.
  
Beyond the above 3 classes, at this stage, there is no need to introduce any further numeric classes.


Given the intention of supporting Float, Int and Char these instances would have the following signatures:

```haskell
instance Real a => Float a

instance Integer a => Int a
 
instance (Eq a, Bounded a) => Char a
```