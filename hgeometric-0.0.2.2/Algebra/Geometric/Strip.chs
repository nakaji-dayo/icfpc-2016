{-# LANGUAGE ForeignFunctionInterface #-}

-- Strip.chs

-- hgeometric: A geometric library with bindings to GPC.
-- Strip.chs is part of hgeometric.

-- Copyright 2007, 2009 Marco Túlio Gontijo e Silva
-- Copyright 2007, 2009 Rafael Cunha de Almeida

-- See LICENSE

#include "gpc.h"

-- | 'Strip' data type and convertions.
module Algebra.Geometric.Strip (
        -- * Data Type
        Strip (StripC, stripSet),
        -- * Convertion
        safePolygonToStrip, polygonToStrip)
    where

import Data.Set hiding (map)
import Control.Monad
import Foreign
import Foreign.C

import Algebra.Geometric.Contour
import Algebra.Geometric.Polygon
import System.IO.Unsafe

{#context prefix = "gpc"#}

{#pointer *vertex_list as CContour -> Contour#}
{#pointer *polygon as CPolygon -> Polygon#}
{#pointer *tristrip as CStrip -> Strip#}

-- | A 'Strip' is an alternative form of representing a 'Polygon' composed
-- by 'Contour's that are not holes. It's a good idea to use it to draw filled
-- figures, and to use 'Polygon' to draw the 'Contour's.
newtype Strip = StripC {stripSet :: Set Contour} deriving Show

instance Storable Strip where
    sizeOf _ = {#sizeof tristrip#}

    alignment _ = alignment (undefined :: Int)

    peek cStrip =
        (StripC . fromList) `liftM`
        do
        numStrips <-
            fromIntegral `liftM` {#get tristrip.num_strips#} cStrip
        {#get tristrip.strip#} cStrip >>= peekArray numStrips

    poke cStrip (StripC strip) =
        {#set tristrip.num_strips#} cStrip (fromIntegral $ size strip) >>

        newArray (toList strip) >>= {#set tristrip.strip#} cStrip

-- | An 'IO' version of 'polygonToStrip', which does not use 'unsafePerformIO'.
safePolygonToStrip :: Polygon -> IO Strip
safePolygonToStrip polygon =
    alloca $
    \cStrip -> alloca $
    \cPolygon ->
    do
    poke cPolygon polygon

    {#call unsafe polygon_to_tristrip#} cPolygon cStrip
    result <- peek cStrip

    {#call unsafe free_polygon#} cPolygon
    {#call unsafe free_tristrip#} cStrip

    return result

-- | Converts a 'Polygon' to a 'Strip'.
polygonToStrip :: Polygon -> Strip
polygonToStrip = unsafePerformIO . safePolygonToStrip
