-- polygon 1つにしか対応していない。
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE NoMonomorphismRestriction #-}
module Main where

import qualified Data.Text as T
import Diagrams.Prelude
import Diagrams.Backend.SVG.CmdLine
import Data.Ratio
import Data.List.Utils
import Algebra.Geometric
import qualified Data.Set as S

debug = putStrLn . show

main = do
    debug $ area $ polySQ
    debug $ area $ poly1
    debug $ area $ ((polySQ /\ poly1) :: Polygon)
    debug $ testScore polySQ poly1
    debug $ testScore poly2 poly1
    debug $ testScore poly1 poly1

mkPoly contour = PolygonC (S.fromList [(False, contour)])
polySQ = mkPoly $ ContourC [VertexC 0 0, VertexC 1 0, VertexC 1 1, VertexC 0 1]
poly1 = mkPoly $ ContourC [VertexC 0 0, VertexC 1 0, VertexC (0.5) (0.5), VertexC 0 (0.5)]
poly2 = mkPoly $ ContourC [VertexC 0 0, VertexC 1 0, VertexC 1 0.5, VertexC 0 0.5]


testScore :: Polygon -> Polygon -> Double
testScore tested prob = (area (tested /\ prob :: Polygon)) / (area tested)

mapFst f (a, b) = (f a, b)
mapSnd f (a, b) = (a, f b)

-- main = (lines <$> getContents) >>= (mainWith . drawVertices . fst . drawProblem)
drawP = (lines <$> getContents) >>= (mainWith . (uncurry (===)) . (mapFst drawVertices) . (mapSnd drawLines) . drawProblem)
  where append (x, y) = y # x
-- main = getContents >>= practice1 . lines

-- -- | at coder practice
-- -- >>> practice1 ["1", "2 3", "test"]
-- -- 6 test
-- practice1 :: [String] -> IO ()
-- practice1 (a:bc:s:_) = do
--   let (b:c:_) = (map T.unpack) . (T.splitOn " ") $ T.pack bc
--   putStrLn $ (show $ sum $ map read [a, b, c]) ++ " " ++ s

type OrigamiPoint = (Ratio Integer, Ratio Integer)
       
-- | drawProblem
-- >>> :{
-- drawProblem ["1"
-- , "4"
-- , "0,0"
-- , "1,0"
-- , "1/2,1/2"
-- , "0,1/2"
-- , "5"
-- , "0,0 1,0"
-- , "1,0 1/2,1/2"
-- , "1/2,1/2 0,1/2"
-- , "0,1/2 0,0"
-- , "0,0 1/2,1/2"]
-- :}
-- ([(0 % 1,0 % 1),(1 % 1,0 % 1),(1 % 2,1 % 2),(0 % 1,1 % 2)],[((0 % 1,0 % 1),(1 % 1,0 % 1)),((1 % 1,0 % 1),(1 % 2,1 % 2)),((1 % 2,1 % 2),(0 % 1,1 % 2)),((0 % 1,1 % 2),(0 % 1,0 % 1)),((0 % 1,0 % 1),(1 % 2,1 % 2))])
drawProblem :: [String] -> ([OrigamiPoint], [(OrigamiPoint, OrigamiPoint)])
drawProblem (numPoly:xs) = (verPos, linePos)
    where (numVers, xs') = splitAt (read numPoly) xs
          (vers, xs'') = splitAt (read $ numVers !! 0) xs'
          verPos = readVertexString <$> vers
          linePos = readLineString <$> tail xs''

-- | parse fraction
-- >>> readVertexString "1/2,1/3"
-- (1 % 2,1 % 3)
-- >>> readVertexString "3,7"
-- (3 % 1,7 % 1)
readVertexString :: String -> (Ratio Integer, Ratio Integer)
readVertexString s =
    let x:y:_ = split "," s
        f x = case split "/" x of
            a:b:_ -> (read a) % (read b)
            a:_ -> (read a) % 1
    in (f x, f y)

-- | parse str of line
-- >>> readLineString "1,0 1/2,1/2"
-- ((1 % 1,0 % 1),(1 % 2,1 % 2))
readLineString :: String -> (OrigamiPoint, OrigamiPoint)
readLineString x =
    let a:b:_ = split " " x
    in (readVertexString a, readVertexString b)

r2d :: (Ratio Integer, Ratio Integer) -> (Double, Double)
r2d (x,y) = ((10*) $ fromRational x, (10*) $ fromRational y)

drawVertices :: [OrigamiPoint] ->  Diagram B
drawVertices xs = pad 1.1 . center . fc orange $ strokeLoop $ closeLine $ fromVertices $ p2 <$> fmap r2d xs

drawLines :: [(OrigamiPoint, OrigamiPoint)] -> Diagram B
drawLines ((a,b):xs) = (lc red . fromVertices $ p2 <$> fmap r2d [a, b]) `mappend` (drawLines xs)
drawLines _ = mempty


