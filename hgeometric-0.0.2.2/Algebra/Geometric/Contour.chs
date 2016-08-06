{-# LANGUAGE ForeignFunctionInterface #-}

-- Contour.chs

-- hgeometric: A geometric library with bindings to GPC.
-- Contour.chs is part of hgeometric.

-- Copyright 2007, 2009 Marco Túlio Gontijo e Silva
-- Copyright 2007, 2009 Rafael Cunha de Almeida

-- See LICENSE

#include "gpc.h"

#include <stdio.h>

-- | Basic geometric types used by 'Algebra.Geometric.Polygon.Polygon' and
-- 'Algebra.Geometric.Strip.Strip'.
module Algebra.Geometric.Contour (
        -- * Contour
        Contour (ContourC, contourList),
        -- * Vertex
        Vertex (VertexC, vertexX, vertexY))
    where

import Data.List
import Control.Monad
import Foreign
import Foreign.C

import Algebra.Geometric.Area

{#context prefix = "gpc"#}

-- | A list of 2D Points. A 'Contour' is the border of a
-- 'Algebra.Geometric.Polygon.Polygon' or the internal border of a hole in a
-- 'Algebra.Geometric.Polygon.Polygon'. In a 'Algebra.Geometric.Strip.Strip',
-- it is the border of each division of the 'Algebra.Geometric.Strip.Strip'.
newtype Contour = ContourC {contourList :: [Vertex]} deriving (Ord, Show)

{#pointer *vertex as CVertex -> Vertex#}

instance Storable Contour where
    sizeOf _ = {#sizeof vertex_list#}

    alignment _ = alignment (undefined :: Int)

    peek cContour =
        ContourC `liftM`
        do
        numVertices <-
            fromIntegral `liftM` {#get vertex_list.num_vertices#} cContour

        contour <- {#get vertex_list.vertex#} cContour
        peekArray numVertices contour

    poke cContour (ContourC contour) =
        do
        {#set vertex_list.num_vertices#} cContour $ fromIntegral $
            length contour

        vertex <- newArray contour
        {#set vertex_list.vertex#} cContour vertex

instance Eq Contour where
    (ContourC list1) == (ContourC list2) =
        list1 `elem` rotation list2 ++ rotation (reverse list2)

rotation :: Eq a => [a] -> [[a]]
rotation list = nub $ zipWith (++) (tails list) $ inits list

instance Area Contour where
    area (ContourC []) = 0
    area (ContourC [_]) = 0
    area (ContourC (vertex1 : rest)) =
        abs (addVertex (last rest) vertex1 + sumMulti rest) / 2

addVertex :: Vertex -> Vertex -> Double
addVertex (VertexC x1 y1) (VertexC x2 y2) = (x1 + x2) * (y2 - y1)

sumMulti :: [Vertex] -> Double
sumMulti [] = error "sumMulti []"
sumMulti [_] = 0
sumMulti (vertex1 : rest@(vertex2 : _)) =
    addVertex vertex1 vertex2 + sumMulti rest

-- | A 2D Point.
data Vertex =
    VertexC {
        vertexX :: Double,
        vertexY :: Double}
    deriving (Eq, Ord, Show)

instance Storable Vertex where
    sizeOf _ = {#sizeof vertex#}

    alignment _ = alignment (undefined :: Int)

    peek cVertex =
        do
        x <- get {#get vertex.x#}
        y <- get {#get vertex.y#}
        return $ VertexC x y

        where get field = realToFrac `liftM` field cVertex

    poke cVertex (VertexC x y) =
        do
        {#set vertex.x#} cVertex (realToFrac x)
        {#set vertex.y#} cVertex (realToFrac y)
