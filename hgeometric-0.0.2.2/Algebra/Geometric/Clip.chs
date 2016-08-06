{-# LANGUAGE ForeignFunctionInterface #-}

-- Clip.chs

-- hgeometric: A geometric library with bindings to GPC.
-- Clip.chs is part of hgeometric.

-- Copyright 2007, 2009 Marco Túlio Gontijo e Silva
-- Copyright 2007, 2009 Rafael Cunha de Almeida

-- See LICENSE

-- | 'Clip' operations to 'Polygon's and 'Strip's.
module Algebra.Geometric.Clip (
        Clip (
            difference, intersection, xor, union,
            (\\), (/\), (<+>), (\/)))
    where

#include "gpc.h"

import Foreign hiding (xor)
import Foreign.C

import Algebra.Geometric.Polygon
import Algebra.Geometric.Strip
import System.IO.Unsafe

{#context prefix = "gpc"#}

{#pointer *polygon as CPolygon -> Polygon#}
{#pointer *tristrip as CStrip -> Strip#}

infixl 7 \\, /\, <+>, \/

class Storable geometry => Clip geometry where
    cClip :: CInt -> Ptr Polygon -> Ptr Polygon -> Ptr geometry -> IO ()

    clipFree :: Ptr geometry -> IO ()

    clip :: CInt -> Polygon -> Polygon -> IO geometry
    clip op subject clip_ =
        alloca $
        \cSubject -> alloca $
        \cClip_ -> alloca $
        \cResult ->
        do
        poke cSubject subject
        poke cClip_ clip_

        cClip op cSubject cClip_ cResult
        result <- peek cResult

        {#call unsafe free_polygon#} cSubject
        {#call unsafe free_polygon#} cClip_
        clipFree cResult

        return result

    -- | An 'IO' version of '\\', which does not use 'unsafePerformIO'.
    difference :: Polygon -> Polygon -> IO geometry
    difference = clip 0

    -- | An 'IO' version of '/\', which does not use 'unsafePerformIO'.
    intersection :: Polygon -> Polygon -> IO geometry
    intersection = clip 1

    -- | An 'IO' version of '<+>', which does not use 'unsafePerformIO'.
    xor :: Polygon -> Polygon -> IO geometry
    xor = clip 2

    -- | An 'IO' version of '\/', which does not use 'unsafePerformIO'.
    union :: Polygon -> Polygon -> IO geometry
    union = clip 3

    -- | 'difference': Returns a 'Polygon' with the area in the first 'Polygon'
    -- and not in the second.
    (\\) :: Polygon -> Polygon -> geometry
    subject \\ clip_ = unsafePerformIO $ subject `difference` clip_

    -- | 'intersection': a 'Polygon' with the area in both the first and the
    -- second 'Polygon'.
    (/\) :: Polygon -> Polygon -> geometry
    subject /\ clip_ = unsafePerformIO $ subject `intersection` clip_

    -- | 'xor': Returns a 'Polygon' with the area in the first or the second
    -- 'Polygon', but not in both.
    (<+>) :: Polygon -> Polygon -> geometry
    subject <+> clip_ = unsafePerformIO $ subject `xor` clip_

    -- | 'union': Returns a 'Polygon' with the area in the first or the second
    -- 'Polygon'.
    (\/) :: Polygon -> Polygon -> geometry
    subject \/ clip_ = unsafePerformIO $ subject `union` clip_

instance Clip Polygon where
    cClip = {#call unsafe polygon_clip#}
    clipFree = {#call unsafe free_polygon#}

instance Clip Strip where
    cClip = {#call unsafe tristrip_clip#}
    clipFree = {#call unsafe free_tristrip#}
