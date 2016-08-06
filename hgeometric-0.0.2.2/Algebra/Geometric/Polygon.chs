{-# LANGUAGE ForeignFunctionInterface #-}

-- Polygon.chs

-- hgeometric: A geometric library with bindings to GPC.
-- Polygon.chs is part of hgeometric.

-- Copyright 2007, 2009 Marco Túlio Gontijo e Silva
-- Copyright 2007, 2009 Rafael Cunha de Almeida

-- See LICENSE

-- | 'Polygon' data type.
module Algebra.Geometric.Polygon (Polygon (PolygonC, polygonSet)) where

#include "gpc.h"

import Data.Set hiding (map)
import Control.Monad
import Foreign
import Foreign.C

import Algebra.Geometric.Area
import Algebra.Geometric.Contour

{#context prefix = "gpc"#}

-- | A 'Polygon', which support holes and disjoint areas. Each 'Bool' in the
-- tuple tells if the 'Contour' is the border of a hole ('True') or of a
-- 'Polygon' ('False').
newtype Polygon = PolygonC {polygonSet :: Set (Bool, Contour)} deriving Show

{#pointer *vertex_list as CContour -> Contour#}

instance Storable Polygon where
    sizeOf _ = {#sizeof polygon#}

    alignment _ = alignment (undefined :: Int)

    peek cPolygon =
        (PolygonC . fromList) `liftM`
        do
        numContours <-
            fromIntegral `liftM` {#get polygon.num_contours#} cPolygon

        cHoles <- {#get polygon.hole#} cPolygon
        holes <- peekArray numContours cHoles

        cContours <- {#get polygon.contour#} cPolygon
        contours <- peekArray numContours cContours

        return $ zip (map toBool holes) contours

    poke cPolygon (PolygonC polygon) =
        do
        {#set polygon.num_contours#} cPolygon $ fromIntegral $ size polygon

        cHoles <- newArray $ map fromBool holes
        {#set polygon.hole#} cPolygon cHoles

        cContours <- newArray contours
        {#set polygon.contour#} cPolygon cContours

        where (holes, contours) = unzip $ toList polygon

instance Area Polygon where
    area (PolygonC polygon) =
        sum $ map signal $ toList polygon
        where
        signal (False, contour) = area contour
        signal (True, contour) = negate $ area contour
