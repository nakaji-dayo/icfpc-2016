-- Tests.hs

-- hgeometric: A geometric library with bindings to GPC.
-- Tests.hs is part of hgeometric.

-- Copyright 2007, 2009 Marco Túlio Gontijo e Silva
-- See LICENSE

module Main (main) where

import Data.Maybe
import Control.Monad
import System.Directory
import System.Exit

import Test.HUnit

import Algebra.Geometric
import Algebra.Geometric.Polygon.File

main :: IO ()
main =
    do
    polygon1 <- fromJust `liftM` readPolygon "tests/FileTestInput.gpf" False

    let
        polygon2 :: Polygon
        polygon2 = polygon1 \\ polygon1

    success <- writePolygon output False polygon2
    removeFile output

    let
        area1 = area polygon1
        area2 = area polygon2

    result <-
        runTestTT $
        TestList [
            success ~=? True,
            area1 ~=? 1,
            area2 ~=? 0,
            area1 ~=? area (polygon1 /\ polygon1 :: Polygon),
            area2 ~=? area (polygon1 <+> polygon1 :: Polygon),
            area1 ~=? area (polygon1 \/ polygon1 :: Polygon),
            area1 ~=? area (polygon1 \\ polygon2 :: Polygon),
            area2 ~=? area (polygon1 /\ polygon2 :: Polygon),
            area1 ~=? area (polygon1 <+> polygon2 :: Polygon),
            area1 ~=? area (polygon1 \/ polygon2 :: Polygon)]
    when (errors result /= 0 || failures result /= 0) exitFailure


output :: String
output = "tests/FileTestOutput.gpf"
